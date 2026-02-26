#!/bin/bash

# XLAB Docker 啟動腳本
# 用法: ./scripts/docker-start.sh

set -e

# 設定目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 顏色輸出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

cd "$PROJECT_DIR"

# 預設端口
PORT="${XLAB_PORT:-4567}"

echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}       XLAB Docker 啟動${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

# 建立資料目錄
log_info "建立資料目錄..."
mkdir -p "$PROJECT_DIR/data/uploads"
mkdir -p "$PROJECT_DIR/data/db"

# 複製資料庫（如果本地有的話）
if [ -f "$PROJECT_DIR/prisma/dev.db" ] && [ ! -f "$PROJECT_DIR/data/db/dev.db" ]; then
    log_info "複製現有資料庫..."
    cp "$PROJECT_DIR/prisma/dev.db" "$PROJECT_DIR/data/db/dev.db"
fi

# 複製上傳檔案（如果本地有的話）
if [ -d "$PROJECT_DIR/public/uploads" ] && [ "$(ls -A $PROJECT_DIR/public/uploads 2>/dev/null)" ]; then
    log_info "複製現有上傳檔案..."
    cp -r "$PROJECT_DIR/public/uploads/"* "$PROJECT_DIR/data/uploads/" 2>/dev/null || true
fi

# 檢查映像是否存在
if ! docker images xlab:latest --format "{{.Repository}}" | grep -q xlab; then
    log_warn "Docker 映像不存在，先建置映像..."
    "$SCRIPT_DIR/docker-build.sh"
fi

# 啟動容器
log_info "啟動 Docker 容器..."
docker compose up -d

# 等待服務啟動
log_info "等待服務啟動..."
sleep 5

# 初始化資料庫（如果需要）
if [ ! -f "$PROJECT_DIR/data/db/dev.db" ]; then
    log_info "初始化資料庫..."
    docker compose exec -T xlab npx prisma db push
    docker compose exec -T xlab npx tsx prisma/seed-xlab.ts
fi

# 檢查服務狀態
if docker compose ps | grep -q "running"; then
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}       XLAB 啟動成功！${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "服務網址："
    echo "  前台: http://localhost:$PORT"
    echo "  後台: http://localhost:$PORT/admin"
    echo ""
    echo "後台登入："
    echo "  帳號: admin@xlab.com"
    echo "  密碼: admin123"
    echo ""
    echo "管理指令："
    echo "  查看日誌: docker compose logs -f"
    echo "  停止服務: ./scripts/docker-stop.sh"
    echo "  重啟服務: ./scripts/docker-restart.sh"
    echo -e "${GREEN}=========================================${NC}"
else
    echo ""
    log_warn "服務可能啟動失敗，查看日誌："
    docker compose logs --tail=20
fi

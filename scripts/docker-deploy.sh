#!/bin/bash

# XLAB 一鍵部署腳本
# 用法: curl -fsSL https://raw.githubusercontent.com/jheweilin/xlab/main/scripts/docker-deploy.sh | bash
# 或: ./scripts/docker-deploy.sh

set -e

# 顏色輸出
RED='\033[0;31m'
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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════╗"
echo "║                                       ║"
echo "║        XLAB 一鍵部署腳本              ║"
echo "║                                       ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# 檢查 Docker
log_info "檢查 Docker..."
if ! command -v docker &> /dev/null; then
    log_error "Docker 未安裝！請先安裝 Docker"
    echo "安裝指南: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    log_error "Docker 未運行！請先啟動 Docker"
    exit 1
fi

log_info "Docker 版本: $(docker --version)"

# 檢查 Docker Compose
if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
    log_error "Docker Compose 未安裝！"
    exit 1
fi

# 設定目錄
INSTALL_DIR="${XLAB_INSTALL_DIR:-$HOME/xlab}"
PORT="${XLAB_PORT:-4567}"

log_info "安裝目錄: $INSTALL_DIR"
log_info "服務端口: $PORT"

# 如果目錄已存在，詢問是否覆蓋
if [ -d "$INSTALL_DIR" ]; then
    log_warn "目錄已存在: $INSTALL_DIR"
    read -p "是否更新？(y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "取消安裝"
        exit 0
    fi
    cd "$INSTALL_DIR"
    log_info "更新程式碼..."
    git pull
else
    # 克隆專案
    log_info "下載 XLAB..."
    git clone https://github.com/jheweilin/xlab.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# 設定權限
chmod +x scripts/*.sh

# 建立資料目錄
mkdir -p data/uploads data/db

# 設定環境變數
if [ ! -f .env ]; then
    log_info "建立環境設定..."
    cat > .env << EOF
XLAB_PORT=$PORT
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:$PORT
EOF
fi

# 建置與啟動
log_info "建置 Docker 映像..."
docker compose build

log_info "啟動服務..."
docker compose up -d

# 等待服務啟動
log_info "等待服務啟動..."
sleep 10

# 初始化資料庫
if [ ! -f "data/db/dev.db" ]; then
    log_info "初始化資料庫..."
    docker compose exec -T xlab npx prisma db push 2>/dev/null || true
    docker compose exec -T xlab npx tsx prisma/seed-xlab.ts 2>/dev/null || true
fi

# 檢查服務
if curl -s "http://localhost:$PORT" > /dev/null 2>&1; then
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║       XLAB 部署成功！                 ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
    echo ""
    echo "服務網址："
    echo "  前台: http://localhost:$PORT"
    echo "  後台: http://localhost:$PORT/admin"
    echo ""
    echo "後台登入："
    echo "  帳號: admin@xlab.com"
    echo "  密碼: admin123"
    echo ""
    echo "安裝目錄: $INSTALL_DIR"
    echo ""
    echo "管理指令："
    echo "  cd $INSTALL_DIR"
    echo "  ./scripts/docker-stop.sh    # 停止"
    echo "  ./scripts/docker-start.sh   # 啟動"
    echo "  ./scripts/docker-restart.sh # 重啟"
    echo "  docker compose logs -f      # 查看日誌"
    echo ""
else
    log_warn "服務可能尚未完全啟動，請稍等片刻後訪問"
    log_info "查看日誌: docker compose logs -f"
fi

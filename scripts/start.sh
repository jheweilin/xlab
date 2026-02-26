#!/bin/bash

# XLAB 網站啟動腳本
# 用法: ./scripts/start.sh [dev|prod]

set -e

# 設定目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.xlab.pid"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/xlab.log"

# 預設配置
PORT="${XLAB_PORT:-4567}"
HOST="${XLAB_HOST:-0.0.0.0}"
MODE="${1:-dev}"

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 檢查是否已在運行
check_running() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
        fi
    fi
    return 1
}

# 檢查端口是否被佔用
check_port() {
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    fi
    return 1
}

# 建立日誌目錄
mkdir -p "$LOG_DIR"

# 切換到專案目錄
cd "$PROJECT_DIR"

# 檢查是否已在運行
if check_running; then
    log_warn "XLAB 服務已在運行中 (PID: $(cat $PID_FILE))"
    log_info "請先執行 ./scripts/stop.sh 停止服務"
    exit 1
fi

# 檢查端口是否被佔用
if check_port; then
    log_error "端口 $PORT 已被佔用"
    log_info "請執行以下指令查看佔用程序: lsof -i :$PORT"
    exit 1
fi

# 檢查 node_modules
if [ ! -d "node_modules" ]; then
    log_info "安裝依賴套件..."
    npm install
fi

# 檢查資料庫
if [ ! -f "prisma/dev.db" ]; then
    log_info "初始化資料庫..."
    npx prisma db push
    log_info "建立初始資料..."
    npx tsx prisma/seed-xlab.ts
fi

log_info "啟動 XLAB 網站服務..."
log_info "模式: $MODE"
log_info "位址: http://$HOST:$PORT"

# 清除快取以確保 CSS 正確編譯
log_info "清除建置快取..."
rm -rf "$PROJECT_DIR/.next"

if [ "$MODE" = "prod" ]; then
    # 生產模式
    log_info "建置生產版本..."
    npm run build

    log_info "啟動生產伺服器..."
    nohup npm run start -- -H "$HOST" -p "$PORT" > "$LOG_FILE" 2>&1 &
else
    # 開發模式
    log_info "啟動開發伺服器..."
    nohup npm run dev -- -H "$HOST" -p "$PORT" > "$LOG_FILE" 2>&1 &
fi

# 儲存 PID
PID=$!
echo $PID > "$PID_FILE"

# 等待服務啟動並編譯
log_info "等待服務啟動與編譯..."
sleep 5

# 預熱首頁確保 CSS 編譯完成
log_info "預熱頁面..."
curl -s http://localhost:$PORT > /dev/null 2>&1 || true
sleep 2

# 驗證服務是否成功啟動
if check_running; then
    log_info "========================================="
    log_info "XLAB 網站啟動成功！"
    log_info "========================================="
    log_info "PID: $PID"
    log_info "網址: http://$HOST:$PORT"
    log_info "日誌: $LOG_FILE"
    log_info ""
    log_info "後台管理: http://$HOST:$PORT/admin"
    log_info "帳號: admin@xlab.com"
    log_info "密碼: admin123"
    log_info "========================================="
else
    log_error "服務啟動失敗，請查看日誌: $LOG_FILE"
    tail -20 "$LOG_FILE"
    exit 1
fi

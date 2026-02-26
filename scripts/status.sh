#!/bin/bash

# XLAB 網站狀態檢查腳本
# 用法: ./scripts/status.sh

# 設定目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.xlab.pid"
LOG_FILE="$PROJECT_DIR/logs/xlab.log"
PORT="${XLAB_PORT:-4567}"

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

echo ""
echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}       XLAB 網站服務狀態${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

# 檢查 PID 檔案
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    echo -e "PID 檔案: ${GREEN}存在${NC} ($PID_FILE)"
    echo -e "記錄 PID: $PID"

    if ps -p "$PID" > /dev/null 2>&1; then
        echo -e "程序狀態: ${GREEN}運行中${NC}"

        # 顯示程序詳細資訊
        echo ""
        echo "程序資訊:"
        ps -p "$PID" -o pid,ppid,user,%cpu,%mem,etime,command | head -2
    else
        echo -e "程序狀態: ${RED}已停止${NC} (PID 檔案過期)"
    fi
else
    echo -e "PID 檔案: ${YELLOW}不存在${NC}"
fi

echo ""

# 檢查端口
echo "端口檢查 ($PORT):"
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "狀態: ${GREEN}端口被佔用${NC}"
    echo ""
    echo "佔用程序:"
    lsof -Pi :$PORT -sTCP:LISTEN
else
    echo -e "狀態: ${YELLOW}端口空閒${NC}"
fi

echo ""

# 檢查服務回應
echo "服務回應檢查:"
if curl -s --connect-timeout 3 "http://localhost:$PORT" > /dev/null 2>&1; then
    echo -e "HTTP 回應: ${GREEN}正常${NC}"

    # 檢查 API
    API_RESPONSE=$(curl -s --connect-timeout 3 "http://localhost:$PORT/api/products" 2>/dev/null || echo "error")
    if echo "$API_RESPONSE" | grep -q '"success":true'; then
        echo -e "API 回應: ${GREEN}正常${NC}"
    else
        echo -e "API 回應: ${RED}異常${NC}"
    fi
else
    echo -e "HTTP 回應: ${RED}無回應${NC}"
fi

echo ""

# 顯示日誌摘要
if [ -f "$LOG_FILE" ]; then
    echo "最近日誌 (最後 10 行):"
    echo -e "${CYAN}-----------------------------------------${NC}"
    tail -10 "$LOG_FILE" | sed 's/^/  /'
    echo -e "${CYAN}-----------------------------------------${NC}"
else
    echo -e "日誌檔案: ${YELLOW}不存在${NC}"
fi

echo ""

# 服務資訊
echo -e "${CYAN}=========================================${NC}"
echo "服務網址:"
echo "  前台: http://localhost:$PORT"
echo "  後台: http://localhost:$PORT/admin"
echo ""
echo "常用指令:"
echo "  啟動: ./scripts/start.sh"
echo "  停止: ./scripts/stop.sh"
echo "  重啟: ./scripts/restart.sh"
echo "  日誌: tail -f logs/xlab.log"
echo -e "${CYAN}=========================================${NC}"
echo ""

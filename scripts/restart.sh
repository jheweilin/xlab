#!/bin/bash

# XLAB 網站重啟腳本
# 用法: ./scripts/restart.sh [dev|prod]

set -e

# 設定目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 顏色輸出
GREEN='\033[0;32m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

MODE="${1:-dev}"

log_info "重啟 XLAB 網站服務..."
log_info ""

# 停止服務
"$SCRIPT_DIR/stop.sh"

# 等待端口釋放
sleep 2

# 啟動服務
"$SCRIPT_DIR/start.sh" "$MODE"

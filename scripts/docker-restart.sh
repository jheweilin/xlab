#!/bin/bash

# XLAB Docker 重啟腳本
# 用法: ./scripts/docker-restart.sh

set -e

# 設定目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 顏色輸出
GREEN='\033[0;32m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_info "重啟 XLAB Docker 容器..."

# 停止
"$SCRIPT_DIR/docker-stop.sh"

# 等待
sleep 2

# 啟動
"$SCRIPT_DIR/docker-start.sh"

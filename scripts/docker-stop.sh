#!/bin/bash

# XLAB Docker 停止腳本
# 用法: ./scripts/docker-stop.sh

set -e

# 設定目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 顏色輸出
GREEN='\033[0;32m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

cd "$PROJECT_DIR"

log_info "停止 XLAB Docker 容器..."
docker compose down

log_info "========================================="
log_info "XLAB Docker 容器已停止"
log_info "========================================="

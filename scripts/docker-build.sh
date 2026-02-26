#!/bin/bash

# XLAB Docker 建置腳本
# 用法: ./scripts/docker-build.sh

set -e

# 設定目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 顏色輸出
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

cd "$PROJECT_DIR"

echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}       XLAB Docker 映像建置${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

log_info "建置 Docker 映像..."
docker build -t xlab:latest .

log_info "建置完成！"
echo ""
echo "映像資訊："
docker images xlab:latest

echo ""
echo -e "${CYAN}=========================================${NC}"
echo "使用方式："
echo "  啟動: ./scripts/docker-start.sh"
echo "  停止: ./scripts/docker-stop.sh"
echo -e "${CYAN}=========================================${NC}"

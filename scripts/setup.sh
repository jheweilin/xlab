#!/bin/bash

# XLAB 網站初始化腳本
# 用法: ./scripts/setup.sh

set -e

# 設定目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

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
echo -e "${CYAN}       XLAB 網站初始化設定${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

cd "$PROJECT_DIR"

# 檢查 Node.js
log_info "檢查 Node.js..."
if ! command -v node &> /dev/null; then
    log_error "Node.js 未安裝，請先安裝 Node.js 18+"
    exit 1
fi
NODE_VERSION=$(node -v)
log_info "Node.js 版本: $NODE_VERSION"

# 檢查 npm
log_info "檢查 npm..."
if ! command -v npm &> /dev/null; then
    log_error "npm 未安裝"
    exit 1
fi
NPM_VERSION=$(npm -v)
log_info "npm 版本: $NPM_VERSION"

# 安裝依賴
log_info "安裝專案依賴..."
npm install

# 建立日誌目錄
log_info "建立目錄結構..."
mkdir -p logs
mkdir -p public/uploads

# 初始化資料庫
log_info "初始化資料庫..."
npx prisma generate
npx prisma db push

# 建立種子資料
log_info "建立初始資料..."
if [ -f "prisma/seed-xlab.ts" ]; then
    npx tsx prisma/seed-xlab.ts
else
    log_warn "找不到種子資料腳本，跳過..."
fi

# 設定腳本執行權限
log_info "設定腳本權限..."
chmod +x "$SCRIPT_DIR"/*.sh

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}       初始化完成！${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "後續步驟:"
echo "  1. 啟動開發伺服器: ./scripts/start.sh"
echo "  2. 啟動生產伺服器: ./scripts/start.sh prod"
echo "  3. 查看服務狀態: ./scripts/status.sh"
echo ""
echo "後台管理:"
echo "  網址: http://localhost:4567/admin"
echo "  帳號: admin@xlab.com"
echo "  密碼: admin123"
echo ""

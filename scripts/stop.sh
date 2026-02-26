#!/bin/bash

# XLAB 網站停止腳本
# 用法: ./scripts/stop.sh

set -e

# 設定目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.xlab.pid"
PORT="${XLAB_PORT:-4567}"

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# 停止服務函數
stop_service() {
    local pid=$1
    local timeout=10
    local count=0

    # 先嘗試正常終止
    kill "$pid" 2>/dev/null || true

    # 等待程序結束
    while ps -p "$pid" > /dev/null 2>&1; do
        sleep 1
        count=$((count + 1))
        if [ $count -ge $timeout ]; then
            log_warn "程序未響應，強制終止..."
            kill -9 "$pid" 2>/dev/null || true
            break
        fi
    done
}

log_info "停止 XLAB 網站服務..."

STOPPED=false

# 方法1: 使用 PID 檔案
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        log_info "停止程序 (PID: $PID)..."
        stop_service "$PID"
        STOPPED=true
    fi
    rm -f "$PID_FILE"
fi

# 方法2: 查找佔用端口的程序
PORT_PIDS=$(lsof -ti :$PORT 2>/dev/null || true)
if [ -n "$PORT_PIDS" ]; then
    for PID in $PORT_PIDS; do
        log_info "停止佔用端口 $PORT 的程序 (PID: $PID)..."
        stop_service "$PID"
        STOPPED=true
    done
fi

# 方法3: 查找 Next.js 開發伺服器程序
NEXT_PIDS=$(pgrep -f "next dev.*$PORT" 2>/dev/null || true)
if [ -n "$NEXT_PIDS" ]; then
    for PID in $NEXT_PIDS; do
        log_info "停止 Next.js 程序 (PID: $PID)..."
        stop_service "$PID"
        STOPPED=true
    done
fi

if [ "$STOPPED" = true ]; then
    log_info "========================================="
    log_info "XLAB 網站服務已停止"
    log_info "========================================="
else
    log_warn "沒有找到運行中的服務"
fi

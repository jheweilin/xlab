#!/bin/bash

# XLAB 日誌查看腳本
# 用法: ./scripts/logs.sh [lines] [-f]

# 設定目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/logs/xlab.log"

# 預設顯示行數
LINES=50
FOLLOW=false

# 解析參數
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--follow)
            FOLLOW=true
            shift
            ;;
        -n|--lines)
            LINES="$2"
            shift 2
            ;;
        [0-9]*)
            LINES="$1"
            shift
            ;;
        -h|--help)
            echo "用法: ./scripts/logs.sh [選項]"
            echo ""
            echo "選項:"
            echo "  -f, --follow     持續監控日誌"
            echo "  -n, --lines N    顯示最後 N 行 (預設: 50)"
            echo "  [數字]           顯示最後指定行數"
            echo "  -h, --help       顯示此說明"
            echo ""
            echo "範例:"
            echo "  ./scripts/logs.sh           顯示最後 50 行"
            echo "  ./scripts/logs.sh 100       顯示最後 100 行"
            echo "  ./scripts/logs.sh -f        持續監控日誌"
            echo "  ./scripts/logs.sh -n 200    顯示最後 200 行"
            exit 0
            ;;
        *)
            echo "未知選項: $1"
            exit 1
            ;;
    esac
done

# 檢查日誌檔案
if [ ! -f "$LOG_FILE" ]; then
    echo "日誌檔案不存在: $LOG_FILE"
    echo "服務可能尚未啟動過"
    exit 1
fi

# 顯示日誌
if [ "$FOLLOW" = true ]; then
    echo "持續監控日誌 (Ctrl+C 退出)..."
    echo "========================================="
    tail -f "$LOG_FILE"
else
    echo "日誌檔案: $LOG_FILE"
    echo "顯示最後 $LINES 行"
    echo "========================================="
    tail -n "$LINES" "$LOG_FILE"
fi

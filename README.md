# XLAB - 3C 電商網站

類似 Cooler Master 風格的 3C 電子產品展示網站，包含前台展示與後台管理系統。

## 技術棧

- **前端框架**: Next.js 14 (App Router)
- **UI 樣式**: Tailwind CSS + shadcn/ui
- **後端 API**: Next.js API Routes
- **ORM**: Prisma
- **資料庫**: SQLite
- **驗證**: NextAuth.js
- **容器化**: Docker

---

## 快速部署 (Docker)

### 一鍵部署

```bash
# 需要先安裝 Docker
curl -fsSL https://raw.githubusercontent.com/jheweilin/xlab/main/scripts/docker-deploy.sh | bash
```

### 手動部署

```bash
# 1. 克隆專案
git clone https://github.com/jheweilin/xlab.git
cd xlab

# 2. 建置並啟動
./scripts/docker-build.sh
./scripts/docker-start.sh
```

### Docker 管理指令

```bash
./scripts/docker-start.sh    # 啟動
./scripts/docker-stop.sh     # 停止
./scripts/docker-restart.sh  # 重啟
docker compose logs -f       # 查看日誌
```

---

## 本地開發

### 1. 安裝依賴

```bash
npm install
```

### 2. 初始化專案

```bash
./scripts/setup.sh
```

### 3. 啟動開發伺服器

```bash
./scripts/start.sh
```

或指定端口：

```bash
XLAB_PORT=8080 ./scripts/start.sh
```

### 管理指令

```bash
./scripts/start.sh    # 啟動服務
./scripts/stop.sh     # 停止服務
./scripts/restart.sh  # 重啟服務
./scripts/status.sh   # 查看狀態
./scripts/logs.sh -f  # 查看日誌
```

---

## 服務網址

| 項目 | 網址 |
|------|------|
| 前台首頁 | http://localhost:4567 |
| 產品列表 | http://localhost:4567/products |
| 後台管理 | http://localhost:4567/admin |

## 後台登入

| 項目 | 值 |
|------|-----|
| 帳號 | `admin@xlab.com` |
| 密碼 | `admin123` |

---

## 專案結構

```
xlab/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/         # 前台路由群組
│   │   ├── (admin)/            # 後台路由群組
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 基礎元件
│   │   ├── frontend/           # 前台專用元件
│   │   └── admin/              # 後台專用元件
│   ├── lib/                    # 工具函式
│   └── types/                  # TypeScript 型別
├── prisma/
│   ├── schema.prisma           # 資料庫 Schema
│   └── seed-xlab.ts            # 種子資料
├── scripts/                    # 管理腳本
├── public/
│   └── uploads/                # 上傳的圖片
├── docs/                       # 操作手冊
├── Dockerfile                  # Docker 生產映像
├── Dockerfile.dev              # Docker 開發映像
└── docker-compose.yml          # Docker Compose 配置
```

---

## 功能列表

### 前台
- 首頁（Hero Banner + 分類展示 + 精選商品）
- 商品列表頁（分頁）
- 商品詳情頁（圖片輪播）
- 分類頁面

### 後台
- 登入驗證
- 儀表板統計
- 分類管理 (CRUD)
- 商品管理 (CRUD + 圖片上傳)

---

## 環境變數

| 變數 | 預設值 | 說明 |
|------|--------|------|
| XLAB_PORT | 4567 | 服務端口 |
| XLAB_HOST | 0.0.0.0 | 監聽位址 |
| NEXTAUTH_SECRET | - | NextAuth 密鑰 |
| NEXTAUTH_URL | http://localhost:4567 | 網站 URL |

---

## License

MIT

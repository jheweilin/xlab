# Xlab - 3C 電商網站

類似 Cooler Master 風格的 3C 電子產品展示網站，包含前台展示與後台管理系統。

## 技術棧

- **前端框架**: Next.js 14 (App Router)
- **UI 樣式**: Tailwind CSS + shadcn/ui
- **後端 API**: Next.js API Routes
- **ORM**: Prisma
- **資料庫**: PostgreSQL
- **驗證**: NextAuth.js

## 開始使用

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env` 並填入正確的資料庫連線資訊：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/xlab?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
ADMIN_EMAIL="admin@xlab.com"
ADMIN_PASSWORD="admin123"
```

### 3. 初始化資料庫

```bash
# 生成 Prisma Client
npm run db:generate

# 推送資料庫結構
npm run db:push

# 建立種子資料
npm run db:seed
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問：
- 前台：http://localhost:3000
- 後台：http://localhost:3000/admin
- 登入：http://localhost:3000/login

## 預設管理員帳號

- Email: admin@xlab.com
- Password: admin123

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
│   └── seed.ts                 # 種子資料
└── public/
    └── uploads/                # 上傳的圖片
```

## 功能列表

### 前台
- 首頁（Hero Banner + 分類展示 + 精選商品）
- 商品列表頁（分頁）
- 商品詳情頁
- 分類頁面

### 後台
- 登入驗證
- 儀表板統計
- 分類管理 (CRUD)
- 商品管理 (CRUD + 圖片上傳)

## 指令

```bash
# 開發
npm run dev

# 建置
npm run build

# 啟動
npm start

# 資料庫
npm run db:generate   # 生成 Prisma Client
npm run db:push       # 推送資料庫結構
npm run db:migrate    # 執行 Migration
npm run db:seed       # 建立種子資料
npm run db:studio     # 開啟 Prisma Studio
```

## License

MIT

# 階段 1: 依賴安裝
FROM node:20-slim AS deps
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# 階段 2: 建置
FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL="file:./dev.db"

# 生成 Prisma Client
RUN npx prisma generate

# 建立初始資料庫（用於 build 及作為初始 seed）
RUN npx prisma db push --skip-generate

# 建置 Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 階段 3: 運行
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/data/dev.db"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 複製必要檔案
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 複製 build 階段產生的初始資料庫
COPY --from=builder /app/prisma/dev.db /app/init.db

# 複製 entrypoint 腳本
COPY entrypoint.sh ./entrypoint.sh

# 建立上傳目錄和資料目錄
RUN mkdir -p ./public/uploads ./data
RUN chown -R nextjs:nodejs ./public/uploads ./data /app/entrypoint.sh /app/init.db

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["/app/entrypoint.sh"]

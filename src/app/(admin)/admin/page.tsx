import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, Eye, TrendingUp } from "lucide-react";
import prisma from "@/lib/prisma";

async function getStats() {
  const [productsCount, categoriesCount, activeProducts, featuredProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isFeatured: true } }),
    ]);

  return {
    productsCount,
    categoriesCount,
    activeProducts,
    featuredProducts,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: "總商品數",
      value: stats.productsCount,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "分類數",
      value: stats.categoriesCount,
      icon: FolderTree,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "上架商品",
      value: stats.activeProducts,
      icon: Eye,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "精選商品",
      value: stats.featuredProducts,
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">儀表板</h1>
        <p className="text-white/60 mt-1">歡迎回到 Xlab 後台管理系統</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="bg-xlab-dark border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/60">
                {card.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}
              >
                <card.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-xlab-dark border-white/10">
          <CardHeader>
            <CardTitle className="text-white">快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href="/admin/products"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Package className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-white">管理商品</div>
                <div className="text-sm text-white/60">
                  新增、編輯或刪除商品
                </div>
              </div>
            </a>
            <a
              href="/admin/categories"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <FolderTree className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-white">管理分類</div>
                <div className="text-sm text-white/60">
                  新增、編輯或刪除分類
                </div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-xlab-dark border-white/10">
          <CardHeader>
            <CardTitle className="text-white">系統資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">系統版本</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Next.js 版本</span>
                <span className="text-white">14.1.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">資料庫</span>
                <span className="text-white">PostgreSQL</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

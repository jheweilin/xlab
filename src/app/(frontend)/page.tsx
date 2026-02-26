import { HeroBanner } from "@/components/frontend/HeroBanner";
import { CategoryGrid } from "@/components/frontend/CategoryGrid";
import { ProductCard } from "@/components/frontend/ProductCard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getHomeData() {
  const [categories, featuredProducts, latestProducts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { order: "asc" },
      take: 4,
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { order: "asc" },
      take: 4,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
  ]);

  return { categories, featuredProducts, latestProducts };
}

export default async function HomePage() {
  const { categories, featuredProducts, latestProducts } = await getHomeData();

  return (
    <div>
      <HeroBanner />

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  產品分類
                </h2>
                <p className="text-white/60 mt-1">
                  探索我們的產品系列
                </p>
              </div>
              <Button asChild variant="ghost" className="text-white/60 hover:text-white">
                <Link href="/categories">
                  查看全部
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <CategoryGrid categories={categories} />
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-xlab-dark/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  精選商品
                </h2>
                <p className="text-white/60 mt-1">
                  我們推薦的優質產品
                </p>
              </div>
              <Button asChild variant="ghost" className="text-white/60 hover:text-white">
                <Link href="/products?featured=true">
                  查看全部
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products Section */}
      {latestProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  最新商品
                </h2>
                <p className="text-white/60 mt-1">
                  剛上架的新品
                </p>
              </div>
              <Button asChild variant="ghost" className="text-white/60 hover:text-white">
                <Link href="/products">
                  查看全部
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-xlab-dark to-xlab-darker">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            準備好開始了嗎？
          </h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            探索我們完整的產品目錄，找到適合您的 3C 產品
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-xlab hover:opacity-90"
          >
            <Link href="/products">
              立即瀏覽
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

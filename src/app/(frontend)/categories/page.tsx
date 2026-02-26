import { CategoryGrid } from "@/components/frontend/CategoryGrid";
import prisma from "@/lib/prisma";

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { order: "asc" },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      _count: { select: { products: true } },
    },
  });
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            產品分類
          </h1>
          <p className="text-white/60 mt-2">
            瀏覽所有產品分類
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <CategoryGrid categories={categories} />
        ) : (
          <div className="text-center py-16">
            <p className="text-white/60">目前沒有分類</p>
          </div>
        )}
      </div>
    </div>
  );
}

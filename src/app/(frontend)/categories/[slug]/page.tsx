import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/frontend/ProductCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

async function getCategoryData(slug: string, page: number) {
  const pageSize = 12;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!category || !category.isActive) return null;

  // Get products from this category and its children
  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        isActive: true,
      },
      orderBy: { order: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
    }),
    prisma.product.count({
      where: {
        categoryId: { in: categoryIds },
        isActive: true,
      },
    }),
  ]);

  return {
    category,
    products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const page = parseInt(searchParams.page || "1");
  const data = await getCategoryData(params.slug, page);

  if (!data) {
    notFound();
  }

  const { category, products, total, totalPages } = data;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            首頁
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/categories" className="hover:text-white transition-colors">
            產品分類
          </Link>
          <ChevronRight className="w-4 h-4" />
          {category.parent && (
            <>
              <Link
                href={`/categories/${category.parent.slug}`}
                className="hover:text-white transition-colors"
              >
                {category.parent.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-white">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/60 mt-2 max-w-2xl">
              {category.description}
            </p>
          )}
          <p className="text-white/40 mt-2">共 {total} 件商品</p>
        </div>

        {/* Subcategories */}
        {category.children.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20"
              >
                <Link href={`/categories/${category.slug}`}>全部</Link>
              </Button>
              {category.children.map((child) => (
                <Button
                  key={child.id}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Link href={`/categories/${child.slug}`}>{child.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/60">此分類目前沒有商品</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/categories/${params.slug}?page=${p}`}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  p === page
                    ? "bg-primary text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

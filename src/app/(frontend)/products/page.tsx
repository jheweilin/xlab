import { ProductCard } from "@/components/frontend/ProductCard";
import prisma from "@/lib/prisma";

interface ProductsPageProps {
  searchParams: {
    page?: string;
    category?: string;
    featured?: string;
    search?: string;
  };
}

async function getProducts(searchParams: ProductsPageProps["searchParams"]) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 12;

  const where: Record<string, unknown> = { isActive: true };

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  if (searchParams.featured === "true") {
    where.isFeatured = true;
  }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { order: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { products, total, page, totalPages } = await getProducts(searchParams);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {searchParams.featured === "true" ? "精選商品" : "所有商品"}
          </h1>
          <p className="text-white/60 mt-2">
            共 {total} 件商品
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/60">目前沒有商品</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/products?page=${p}${
                  searchParams.category ? `&category=${searchParams.category}` : ""
                }${searchParams.featured ? "&featured=true" : ""}`}
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

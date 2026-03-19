import prisma from "@/lib/prisma";
import { ProductsContent } from "@/components/frontend/ProductsContent";

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
    <ProductsContent
      products={products}
      total={total}
      page={page}
      totalPages={totalPages}
      isFeatured={searchParams.featured === "true"}
      searchParams={searchParams}
    />
  );
}

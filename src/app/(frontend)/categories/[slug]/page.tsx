import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CategoryDetailContent } from "@/components/frontend/CategoryDetailContent";

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
    <CategoryDetailContent
      category={category}
      products={products}
      total={total}
      page={page}
      totalPages={totalPages}
      slug={params.slug}
    />
  );
}

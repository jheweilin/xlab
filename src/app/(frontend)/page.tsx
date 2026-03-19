export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import { HomeContent } from "@/components/frontend/HomeContent";

async function getHomeData() {
  const [categories, featuredProducts, latestProducts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { order: "asc" },
      take: 4,
      include: {
        _count: { select: { products: true, children: true } },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { order: "asc" },
      take: 4,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
    }),
  ]);

  return { categories, featuredProducts, latestProducts };
}

export default async function HomePage() {
  const { categories, featuredProducts, latestProducts } = await getHomeData();

  return (
    <HomeContent
      categories={categories}
      featuredProducts={featuredProducts}
      latestProducts={latestProducts}
    />
  );
}

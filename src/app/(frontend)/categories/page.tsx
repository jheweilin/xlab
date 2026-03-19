export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import { CategoriesContent } from "@/components/frontend/CategoriesContent";

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { order: "asc" },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      _count: { select: { products: true, children: true } },
    },
  });
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <CategoriesContent categories={categories} />;
}

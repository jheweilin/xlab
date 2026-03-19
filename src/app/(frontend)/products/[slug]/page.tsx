import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductDetailContent } from "@/components/frontend/ProductDetailContent";

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
  });

  if (!product || !product.isActive) return null;

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
    },
  });

  return { product, relatedProducts };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const data = await getProduct(params.slug);

  if (!data) {
    notFound();
  }

  const { product, relatedProducts } = data;

  return (
    <ProductDetailContent
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

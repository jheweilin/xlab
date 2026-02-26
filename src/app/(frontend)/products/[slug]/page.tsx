import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/frontend/ProductCard";
import { ImageGallery } from "@/components/frontend/ImageGallery";

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
      category: { select: { id: true, name: true, slug: true } },
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            首頁
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/categories/${product.category.slug}`}
            className="hover:text-white transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Back button */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-6 text-white/60 hover:text-white"
        >
          <Link href="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回商品列表
          </Link>
        </Button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <ImageGallery images={product.images} productName={product.name} />

          {/* Info */}
          <div className="space-y-6">
            {/* Tags */}
            {product.tags && (
              <div className="flex flex-wrap gap-2">
                {(typeof product.tags === 'string' ? product.tags.split(',') : product.tags).map((tag: string, i: number) => (
                  <Badge key={i} variant="outline" className="border-white/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {product.name}
            </h1>

            {/* Category */}
            <Link
              href={`/categories/${product.category.slug}`}
              className="inline-block text-white/60 hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>

            {/* Price */}
            <div className="text-3xl font-bold text-gradient">
              {formatPrice(product.price?.toString())}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-white/70 text-lg leading-relaxed">
                {product.description}
              </p>
            )}

            {/* CTA */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-xlab hover:opacity-90"
              >
                聯絡購買
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                加入詢價
              </Button>
            </div>

            {/* Content / Specs */}
            {product.content && (
              <div className="pt-6 border-t border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">
                  產品規格
                </h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  <div
                    className="text-white/70 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: product.content }}
                  />
                </div>
              </div>
            )}

            {/* Specs JSON */}
            {product.specs && (() => {
              const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;
              return typeof specs === 'object' && Object.keys(specs).length > 0 ? (
                <div className="pt-6 border-t border-white/10">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    詳細規格
                  </h2>
                  <div className="space-y-2">
                    {Object.entries(specs as Record<string, string>).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-white/5"
                        >
                          <span className="text-white/60">{key}</span>
                          <span className="text-white">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8">相關商品</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

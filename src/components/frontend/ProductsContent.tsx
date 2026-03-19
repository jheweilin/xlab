"use client";

import { ProductCard } from "@/components/frontend/ProductCard";
import { useLanguage } from "@/context/LanguageContext";

interface ProductsContentProps {
  products: any[];
  total: number;
  page: number;
  totalPages: number;
  isFeatured: boolean;
  searchParams: {
    category?: string;
    featured?: string;
  };
}

export function ProductsContent({
  products,
  total,
  page,
  totalPages,
  isFeatured,
  searchParams,
}: ProductsContentProps) {
  const { t } = useLanguage();
  const totalFn = t("products_total") as (n: number) => string;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {isFeatured
              ? (t("products_featured_title") as string)
              : (t("products_title") as string)}
          </h1>
          <p className="text-white/60 mt-2">
            {totalFn(total)}
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
            <p className="text-white/60">{t("products_empty") as string}</p>
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

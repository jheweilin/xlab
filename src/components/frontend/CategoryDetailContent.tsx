"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/frontend/ProductCard";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryDetailContentProps {
  category: any;
  products: any[];
  total: number;
  page: number;
  totalPages: number;
  slug: string;
}

export function CategoryDetailContent({
  category,
  products,
  total,
  page,
  totalPages,
  slug,
}: CategoryDetailContentProps) {
  const { t, localized } = useLanguage();
  const totalFn = t("category_total") as (n: number) => string;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            {t("breadcrumb_home") as string}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/categories" className="hover:text-white transition-colors">
            {t("breadcrumb_categories") as string}
          </Link>
          <ChevronRight className="w-4 h-4" />
          {category.parent && (
            <>
              <Link
                href={`/categories/${category.parent.slug}`}
                className="hover:text-white transition-colors"
              >
                {localized(category.parent, "name")}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-white">{localized(category, "name")}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {localized(category, "name")}
          </h1>
          {(category.description || category.descriptionEn) && (
            <p className="text-white/60 mt-2 max-w-2xl">
              {localized(category, "description")}
            </p>
          )}
          <p className="text-white/40 mt-2">{totalFn(total)}</p>
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
                <Link href={`/categories/${category.slug}`}>{t("category_all") as string}</Link>
              </Button>
              {category.children.map((child: any) => (
                <Button
                  key={child.id}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Link href={`/categories/${child.slug}`}>{localized(child, "name")}</Link>
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
            <p className="text-white/60">{t("category_empty") as string}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/categories/${slug}?page=${p}`}
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

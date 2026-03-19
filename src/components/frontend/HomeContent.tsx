"use client";

import { HeroBanner } from "@/components/frontend/HeroBanner";
import { CategoryGrid } from "@/components/frontend/CategoryGrid";
import { ProductCard } from "@/components/frontend/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface HomeContentProps {
  categories: any[];
  featuredProducts: any[];
  latestProducts: any[];
}

export function HomeContent({ categories, featuredProducts, latestProducts }: HomeContentProps) {
  const { t } = useLanguage();

  return (
    <div>
      <HeroBanner />

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {t("home_categories_title") as string}
                </h2>
                <p className="text-white/60 mt-1">
                  {t("home_categories_desc") as string}
                </p>
              </div>
              <Button asChild variant="ghost" className="text-white/60 hover:text-white">
                <Link href="/categories">
                  {t("home_view_all") as string}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <CategoryGrid categories={categories} />
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-xlab-dark/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {t("home_featured_title") as string}
                </h2>
                <p className="text-white/60 mt-1">
                  {t("home_featured_desc") as string}
                </p>
              </div>
              <Button asChild variant="ghost" className="text-white/60 hover:text-white">
                <Link href="/products?featured=true">
                  {t("home_view_all") as string}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products Section */}
      {latestProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {t("home_latest_title") as string}
                </h2>
                <p className="text-white/60 mt-1">
                  {t("home_latest_desc") as string}
                </p>
              </div>
              <Button asChild variant="ghost" className="text-white/60 hover:text-white">
                <Link href="/products">
                  {t("home_view_all") as string}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-xlab-dark to-xlab-darker">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("home_cta_title") as string}
          </h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            {t("home_cta_desc") as string}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-xlab hover:opacity-90"
          >
            <Link href="/products">
              {t("home_cta_button") as string}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

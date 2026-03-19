"use client";

import { CategoryGrid } from "@/components/frontend/CategoryGrid";
import { useLanguage } from "@/context/LanguageContext";

interface CategoriesContentProps {
  categories: any[];
}

export function CategoriesContent({ categories }: CategoriesContentProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {t("categories_title") as string}
          </h1>
          <p className="text-white/60 mt-2">
            {t("categories_desc") as string}
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <CategoryGrid categories={categories} />
        ) : (
          <div className="text-center py-16">
            <p className="text-white/60">{t("categories_empty") as string}</p>
          </div>
        )}
      </div>
    </div>
  );
}

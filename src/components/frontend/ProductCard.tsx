"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductWithImages } from "@/types";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: ProductWithImages;
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale, t, localized } = useLanguage();
  const showPrice = (product as any).showPrice !== false;
  const mainImage = product.images[0]?.url;
  const rawTags = locale === "en" && (product as any).tagsEn ? (product as any).tagsEn : product.tags;
  const tags: string[] = rawTags ? (typeof rawTags === 'string' ? rawTags.split(',') : rawTags) : [];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl overflow-hidden bg-xlab-dark border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0">
        {mainImage ? (
          <Image
            src={getImageUrl(mainImage)}
            alt={localized(product, "name")}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/20 text-6xl font-bold">X</span>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, i) => (
              <Badge
                key={i}
                variant="default"
                className="bg-xlab-red/90 text-white text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Featured badge */}
        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-xlab text-white border-0">
              {t("product_featured_badge") as string}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <p className="text-white/40 text-xs uppercase tracking-wider">
          {localized(product.category, "name")}
        </p>
        <h3 className="text-white font-medium line-clamp-2 group-hover:text-primary transition-colors">
          {localized(product, "name")}
        </h3>
        {(product.description || (product as any).descriptionEn) && (
          <p className="text-white/60 text-sm line-clamp-2">
            {localized(product, "description")}
          </p>
        )}
        {showPrice && (
          <p className="text-lg font-semibold text-gradient">
            {formatPrice(product.price?.toString())}
          </p>
        )}
      </div>
    </Link>
  );
}

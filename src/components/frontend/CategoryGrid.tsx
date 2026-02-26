import Link from "next/link";
import Image from "next/image";
import { CategoryWithChildren } from "@/types";
import { getImageUrl } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface CategoryGridProps {
  categories: CategoryWithChildren[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className={`
            relative group overflow-hidden rounded-2xl bg-xlab-dark border border-white/10
            hover:border-white/20 transition-all duration-300
            ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}
          `}
        >
          <div
            className={`
            relative overflow-hidden
            ${index === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-square"}
          `}
          >
            {category.image ? (
              <Image
                src={getImageUrl(category.image)}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-white/20 text-4xl font-bold">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-white/60 text-sm line-clamp-2 mb-2">
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-white/60 text-sm group-hover:text-primary transition-colors">
                <span>瀏覽商品</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

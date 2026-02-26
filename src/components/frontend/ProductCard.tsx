import Image from "next/image";
import Link from "next/link";
import { ProductWithImages } from "@/types";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: ProductWithImages;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0]?.url;
  const tags = product.tags ? (typeof product.tags === 'string' ? product.tags.split(',') : product.tags) : [];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl overflow-hidden bg-xlab-dark border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0">
        {mainImage ? (
          <Image
            src={getImageUrl(mainImage)}
            alt={product.name}
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
              精選
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <p className="text-white/40 text-xs uppercase tracking-wider">
          {product.category.name}
        </p>
        <h3 className="text-white font-medium line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-white/60 text-sm line-clamp-2">
            {product.description}
          </p>
        )}
        <p className="text-lg font-semibold text-gradient">
          {formatPrice(product.price?.toString())}
        </p>
      </div>
    </Link>
  );
}

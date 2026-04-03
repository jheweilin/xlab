import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return "價格洽詢";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
  }).format(num);
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  return fullPath.split("/").map(segment => encodeURIComponent(segment)).join("/");
}

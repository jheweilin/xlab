import { Category, Product, ProductImage } from "@prisma/client";

export type ProductWithImages = Product & {
  images: ProductImage[];
  category: Category;
};

export type CategoryWithChildren = Category & {
  children?: CategoryWithChildren[];
  parent?: Category | null;
  products?: Product[];
  _count?: {
    products: number;
    children: number;
  };
};

export type ProductFormData = {
  name: string;
  slug: string;
  description?: string;
  content?: string;
  price?: number;
  categoryId: string;
  specs?: Record<string, string> | string;
  tags?: string[] | string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  images?: string[];
};

export type CategoryFormData = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  order: number;
  isActive: boolean;
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

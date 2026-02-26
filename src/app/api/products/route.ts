import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const categoryId = searchParams.get("categoryId");
    const categorySlug = searchParams.get("categorySlug");
    const featured = searchParams.get("featured");
    const active = searchParams.get("active");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "order";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (active === "true") {
      where.isActive = true;
    } else if (active === "false") {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === "price") {
      orderBy.price = sortOrder as Prisma.SortOrder;
    } else if (sortBy === "createdAt") {
      orderBy.createdAt = sortOrder as Prisma.SortOrder;
    } else if (sortBy === "name") {
      orderBy.name = sortOrder as Prisma.SortOrder;
    } else {
      orderBy.order = sortOrder as Prisma.SortOrder;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { order: "asc" },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: products,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "無法取得商品列表" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      content,
      price,
      categoryId,
      specs,
      tags,
      isFeatured,
      isActive,
      order,
      images,
    } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "商品名稱為必填" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "請選擇商品分類" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "此商品名稱已存在" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        content,
        price: price ? parseFloat(price) : null,
        categoryId,
        specs: specs ? JSON.stringify(specs) : null,
        tags: Array.isArray(tags) ? tags.join(",") : (tags || null),
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,
        order: order ?? 0,
        images: images?.length
          ? {
              create: images.map((img: { url: string; alt?: string }, index: number) => ({
                url: img.url,
                alt: img.alt || name,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "建立商品失敗" },
      { status: 500 }
    );
  }
}

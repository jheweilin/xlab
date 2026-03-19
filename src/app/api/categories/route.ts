import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get("includeProducts") === "true";
    const activeOnly = searchParams.get("activeOnly") === "true";
    const parentId = searchParams.get("parentId");

    const where: Record<string, unknown> = {};

    if (activeOnly) {
      where.isActive = true;
    }

    if (parentId === "null") {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: {
          include: {
            _count: {
              select: { products: true },
            },
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: { products: true, children: true },
        },
        ...(includeProducts && {
          products: {
            where: { isActive: true },
            take: 10,
            orderBy: { order: "asc" },
          },
        }),
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "無法取得分類列表" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameEn, description, descriptionEn, image, parentId, order, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "分類名稱為必填" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "此分類名稱已存在" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        nameEn: nameEn || null,
        slug,
        description,
        descriptionEn: descriptionEn || null,
        image,
        parentId: parentId || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "建立分類失敗" },
      { status: 500 }
    );
  }
}

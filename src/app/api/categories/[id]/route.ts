import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        children: {
          orderBy: { order: "asc" },
        },
        parent: true,
        products: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: {
            images: {
              orderBy: { order: "asc" },
              take: 1,
            },
          },
        },
        _count: {
          select: { products: true, children: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "找不到此分類" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "無法取得分類資料" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, nameEn, description, descriptionEn, image, parentId, order, isActive } = body;

    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: "找不到此分類" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (name && name !== existingCategory.name) {
      const newSlug = slugify(name);
      const slugExists = await prisma.category.findFirst({
        where: {
          slug: newSlug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "此分類名稱已存在" },
          { status: 400 }
        );
      }

      updateData.name = name;
      updateData.slug = newSlug;
    }

    if (description !== undefined) updateData.description = description;
    if (descriptionEn !== undefined) updateData.descriptionEn = descriptionEn || null;
    if (nameEn !== undefined) updateData.nameEn = nameEn || null;
    if (image !== undefined) updateData.image = image;
    if (parentId !== undefined) updateData.parentId = parentId || null;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await prisma.category.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: "更新分類失敗" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true, children: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "找不到此分類" },
        { status: 404 }
      );
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { success: false, error: "此分類下仍有商品，無法刪除" },
        { status: 400 }
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { success: false, error: "此分類下仍有子分類，無法刪除" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "分類已刪除" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: "刪除分類失敗" },
      { status: 500 }
    );
  }
}

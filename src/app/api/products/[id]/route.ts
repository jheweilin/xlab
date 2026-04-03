import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to find by ID first, then by slug
    let product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        category: true,
      },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: params.id },
        include: {
          images: {
            orderBy: { order: "asc" },
          },
          category: true,
        },
      });
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: "找不到此商品" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "無法取得商品資料" },
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
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      content,
      contentEn,
      price,
      categoryId,
      specs,
      tags,
      tagsEn,
      isFeatured,
      isActive,
      showPrice,
      order,
      images,
    } = body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "找不到此商品" },
        { status: 404 }
      );
    }

    const updateData: Prisma.ProductUpdateInput = {};

    if (name && name !== existingProduct.name) {
      const newSlug = slugify(name);
      const slugExists = await prisma.product.findFirst({
        where: {
          slug: newSlug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "此商品名稱已存在" },
          { status: 400 }
        );
      }

      updateData.name = name;
      updateData.slug = newSlug;
    }

    if (description !== undefined) updateData.description = description;
    if (descriptionEn !== undefined) updateData.descriptionEn = descriptionEn || null;
    if (content !== undefined) updateData.content = content;
    if (contentEn !== undefined) updateData.contentEn = contentEn || null;
    if (nameEn !== undefined) updateData.nameEn = nameEn || null;
    if (price !== undefined) {
      updateData.price = price ? parseFloat(price) : null;
    }
    if (categoryId !== undefined) updateData.category = { connect: { id: categoryId } };
    if (specs !== undefined) updateData.specs = specs ? JSON.stringify(specs) : null;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags.join(",") : (tags || null);
    if (tagsEn !== undefined) updateData.tagsEn = Array.isArray(tagsEn) ? tagsEn.join(",") : (tagsEn || null);
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (showPrice !== undefined) updateData.showPrice = showPrice;
    if (order !== undefined) updateData.order = order;

    // Handle images update
    if (images !== undefined) {
      // Delete existing images and create new ones
      await prisma.productImage.deleteMany({
        where: { productId: params.id },
      });

      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((img: { url: string; alt?: string }, index: number) => ({
            productId: params.id,
            url: img.url,
            alt: img.alt || existingProduct.name,
            order: index,
          })),
        });
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: "更新商品失敗" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "找不到此商品" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "商品已刪除" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "刪除商品失敗" },
      { status: 500 }
    );
  }
}

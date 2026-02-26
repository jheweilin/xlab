"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package, Eye, EyeOff, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ProductWithImages, CategoryWithChildren } from "@/types";
import { formatPrice, getImageUrl } from "@/lib/utils";

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithImages | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductWithImages | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: "",
    price: "",
    categoryId: "",
    tags: "",
    isFeatured: false,
    isActive: true,
    order: 0,
    images: [] as string[],
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?pageSize=100");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.items);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      content: "",
      price: "",
      categoryId: "",
      tags: "",
      isFeatured: false,
      isActive: true,
      order: 0,
      images: [],
    });
    setDialogOpen(true);
  };

  const openEditDialog = (product: ProductWithImages) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      content: product.content || "",
      price: product.price?.toString() || "",
      categoryId: product.categoryId,
      tags: product.tags || "",
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      order: product.order,
      images: product.images.map((img) => img.url),
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          content: formData.content || null,
          price: formData.price ? parseFloat(formData.price) : null,
          categoryId: formData.categoryId,
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim())
            : [],
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
          order: formData.order,
          images: formData.images.map((url) => ({ url })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingProduct ? "商品已更新" : "商品已建立",
          variant: "default",
        });
        setDialogOpen(false);
        fetchProducts();
      } else {
        toast({
          title: "操作失敗",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "操作失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "商品已刪除",
          variant: "default",
        });
        setDeleteDialogOpen(false);
        fetchProducts();
      } else {
        toast({
          title: "刪除失敗",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "刪除失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (product: ProductWithImages) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: product.isActive ? "商品已下架" : "商品已上架",
          variant: "default",
        });
        fetchProducts();
      }
    } catch {
      toast({
        title: "操作失敗",
        variant: "destructive",
      });
    }
  };

  const flatCategories = categories.flatMap((c) => [
    c,
    ...(c.children || []),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">商品管理</h1>
          <p className="text-white/60 mt-1">管理所有商品</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-gradient-xlab">
          <Plus className="w-4 h-4 mr-2" />
          新增商品
        </Button>
      </div>

      <Card className="bg-xlab-dark border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="w-5 h-5" />
            商品列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">載入中...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              尚無商品，請新增第一個商品
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/60">圖片</TableHead>
                  <TableHead className="text-white/60">名稱</TableHead>
                  <TableHead className="text-white/60">分類</TableHead>
                  <TableHead className="text-white/60">價格</TableHead>
                  <TableHead className="text-white/60">狀態</TableHead>
                  <TableHead className="text-white/60 text-right">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="border-white/10">
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5">
                        {product.images[0] ? (
                          <Image
                            src={getImageUrl(product.images[0].url)}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-white/20" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {product.name}
                        </span>
                        {product.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-white/60">
                      {product.category.name}
                    </TableCell>
                    <TableCell className="text-white">
                      {formatPrice(product.price?.toString())}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isActive ? "success" : "secondary"}
                      >
                        {product.isActive ? "上架" : "下架"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(product)}
                          className="text-white/60 hover:text-white"
                        >
                          {product.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(product)}
                          className="text-white/60 hover:text-white"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingProduct(product);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-white/60 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-xlab-dark border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProduct ? "編輯商品" : "新增商品"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>商品圖片</Label>
              <ImageUpload
                value={formData.images}
                onChange={(urls) => setFormData({ ...formData, images: urls })}
                maxFiles={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>商品名稱 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>分類 *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                  required
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent className="bg-xlab-dark border-white/10">
                    {flatCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.parentId ? `└ ${category.name}` : category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>簡短描述</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-white/5 border-white/10"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>詳細內容 / 規格</Label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="bg-white/5 border-white/10"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>價格</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="留空表示洽詢"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>標籤（以逗號分隔）</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="新品, 熱銷, 限量"
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>排序</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>精選商品</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isFeatured: checked })
                    }
                  />
                  <span className="text-sm text-white/60">
                    {formData.isFeatured ? "是" : "否"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>狀態</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <span className="text-sm text-white/60">
                    {formData.isActive ? "上架" : "下架"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                取消
              </Button>
              <Button type="submit" className="bg-gradient-xlab">
                {editingProduct ? "更新" : "建立"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-xlab-dark border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              確定要刪除此商品？
            </AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原，商品將被永久刪除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

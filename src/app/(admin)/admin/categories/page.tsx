"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
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
import { CategoryWithChildren } from "@/types";

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithChildren | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<CategoryWithChildren | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
    order: 0,
    isActive: true,
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      parentId: "",
      order: 0,
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (category: CategoryWithChildren) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parentId: category.parentId || "",
      order: category.order,
      isActive: category.isActive,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingCategory
      ? `/api/categories/${editingCategory.id}`
      : "/api/categories";
    const method = editingCategory ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingCategory ? "分類已更新" : "分類已建立",
          variant: "default",
        });
        setDialogOpen(false);
        fetchCategories();
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
    if (!deletingCategory) return;

    try {
      const res = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "分類已刪除",
          variant: "default",
        });
        setDeleteDialogOpen(false);
        fetchCategories();
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

  const rootCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">分類管理</h1>
          <p className="text-white/60 mt-1">管理商品分類</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-gradient-xlab">
          <Plus className="w-4 h-4 mr-2" />
          新增分類
        </Button>
      </div>

      <Card className="bg-xlab-dark border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5" />
            分類列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">載入中...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              尚無分類，請新增第一個分類
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/60">名稱</TableHead>
                  <TableHead className="text-white/60">描述</TableHead>
                  <TableHead className="text-white/60">商品數</TableHead>
                  <TableHead className="text-white/60">狀態</TableHead>
                  <TableHead className="text-white/60">排序</TableHead>
                  <TableHead className="text-white/60 text-right">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rootCategories.map((category) => (
                  <>
                    <TableRow key={category.id} className="border-white/10">
                      <TableCell className="font-medium text-white">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-white/60 max-w-xs truncate">
                        {category.description || "-"}
                      </TableCell>
                      <TableCell className="text-white/60">
                        {category._count?.products || 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isActive ? "success" : "secondary"}
                        >
                          {category.isActive ? "啟用" : "停用"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/60">
                        {category.order}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(category)}
                            className="text-white/60 hover:text-white"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingCategory(category);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-white/60 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {category.children?.map((child) => (
                      <TableRow key={child.id} className="border-white/10">
                        <TableCell className="font-medium text-white pl-8">
                          └ {child.name}
                        </TableCell>
                        <TableCell className="text-white/60 max-w-xs truncate">
                          {child.description || "-"}
                        </TableCell>
                        <TableCell className="text-white/60">
                          {child._count?.products || 0}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={child.isActive ? "success" : "secondary"}
                          >
                            {child.isActive ? "啟用" : "停用"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/60">
                          {child.order}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(child as CategoryWithChildren)}
                              className="text-white/60 hover:text-white"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeletingCategory(child as CategoryWithChildren);
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
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-xlab-dark border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCategory ? "編輯分類" : "新增分類"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>分類名稱</Label>
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
              <Label>描述</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>上層分類</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, parentId: value })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="無（作為頂層分類）" />
                </SelectTrigger>
                <SelectContent className="bg-xlab-dark border-white/10">
                  <SelectItem value="">無（作為頂層分類）</SelectItem>
                  {rootCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>排序</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-white/10"
                />
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
                    {formData.isActive ? "啟用" : "停用"}
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
                {editingCategory ? "更新" : "建立"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-xlab-dark border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              確定要刪除此分類？
            </AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原。若分類下有商品或子分類，將無法刪除。
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

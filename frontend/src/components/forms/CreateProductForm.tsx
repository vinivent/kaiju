"use client";

import { useState } from "react";
import { ProductCategory } from "@/app/types/common";
import { CreateProductRequest } from "@/features/products/model";
import { productService } from "@/features/products/services";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CreateProductFormProps {
  onSuccess?: () => void;
}

export function CreateProductForm({ onSuccess }: CreateProductFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    category: ProductCategory.FOOD,
    price: 0,
    stockQuantity: 0,
    images: [],
  });

  const categories: { value: ProductCategory; label: string }[] = [
    { value: ProductCategory.FOOD, label: "Alimentos" },
    { value: ProductCategory.HABITAT, label: "Habitat" },
    { value: ProductCategory.HEALTHCARE, label: "Saúde" },
    { value: ProductCategory.ACCESSORIES, label: "Acessórios" },
    { value: ProductCategory.LIGHTING, label: "Iluminação" },
    { value: ProductCategory.HEATING, label: "Aquecimento" },
    { value: ProductCategory.BOOKS, label: "Livros" },
    { value: ProductCategory.DECORATION, label: "Decoração" },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await productService.createProduct(formData);
      toast.success("Produto cadastrado com sucesso!");
      setIsDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        category: ProductCategory.FOOD,
        price: 0,
        stockQuantity: 0,
        images: [],
      });
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      toast.error(
        error?.response?.data || "Erro ao criar produto. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all whitespace-nowrap shrink-0">
          <Plus className="mr-2 h-4 w-4 shrink-0" />
          <span className="hidden md:inline">Cadastrar Produto</span>
          <span className="hidden sm:inline md:hidden">Cadastrar</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os dados do produto que deseja cadastrar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome do Produto
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Ração para Iguana"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="Descreva o produto..."
              className="min-h-[100px] rounded-md border border-input bg-input/30 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Categoria
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ProductCategory,
                })
              }
              className="flex h-9 w-full rounded-md border border-input bg-input/30 px-3 py-1 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="price" className="text-sm font-medium">
              Preço (R$)
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="stock" className="text-sm font-medium">
              Quantidade em Estoque
            </label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stockQuantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stockQuantity: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting || !formData.name || !formData.description
            }
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


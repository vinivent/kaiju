"use client";

import { useState } from "react";
import { ProductCategory, ProductStatus } from "@/app/types/common";
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
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  formatCurrencyInput,
  parseCurrency,
  isValidURL,
  formatNumber,
} from "@/lib/formatters";

interface CreateProductFormProps {
  onSuccess?: () => void;
}

export function CreateProductForm({ onSuccess }: CreateProductFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState("");
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    category: ProductCategory.FOOD,
    price: 0,
    status: ProductStatus.ACTIVE,
    stockQuantity: 0,
    images: [],
    brand: "",
    manufacturer: "",
    tags: [],
  });

  const [imageUrl, setImageUrl] = useState("");
  const [tagInput, setTagInput] = useState("");

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

  const statusOptions: { value: ProductStatus; label: string }[] = [
    { value: ProductStatus.ACTIVE, label: "Ativo" },
    { value: ProductStatus.INACTIVE, label: "Inativo" },
    { value: ProductStatus.OUT_OF_STOCK, label: "Sem Estoque" },
    { value: ProductStatus.DISCONTINUED, label: "Descontinuado" },
  ];

  const addImage = () => {
    if (imageUrl.trim()) {
      if (!isValidURL(imageUrl.trim())) {
        toast.error("URL inválida. Por favor, insira uma URL válida.");
        return;
      }
      setFormData({
        ...formData,
        images: [...(formData.images || []), imageUrl.trim()],
      });
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...(formData.tags || [])];
    newTags.splice(index, 1);
    setFormData({ ...formData, tags: newTags });
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "Nome do produto é obrigatório.";
    }
    if (formData.name.trim().length < 3) {
      return "Nome do produto deve ter pelo menos 3 caracteres.";
    }
    if (!formData.description.trim()) {
      return "Descrição é obrigatória.";
    }
    if (formData.description.trim().length < 10) {
      return "Descrição deve ter pelo menos 10 caracteres.";
    }
    if (formData.price <= 0) {
      return "Preço deve ser maior que zero.";
    }
    if (formData.price > 999999.99) {
      return "Preço não pode ser maior que R$ 999.999,99.";
    }
    if (formData.stockQuantity < 0) {
      return "Quantidade em estoque não pode ser negativa.";
    }
    if (formData.stockQuantity > 999999) {
      return "Quantidade em estoque não pode ser maior que 999.999.";
    }
    if (formData.images && formData.images.length > 0) {
      const invalidUrls = formData.images.filter((url) => !isValidURL(url));
      if (invalidUrls.length > 0) {
        return "Uma ou mais URLs de imagens são inválidas.";
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data: remove empty optional fields
      const submitData: CreateProductRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: formData.price,
        status: formData.status,
        stockQuantity: formData.stockQuantity,
        images:
          formData.images && formData.images.length > 0
            ? formData.images
            : undefined,
        brand: formData.brand?.trim() || undefined,
        manufacturer: formData.manufacturer?.trim() || undefined,
        tags:
          formData.tags && formData.tags.length > 0 ? formData.tags : undefined,
      };

      await productService.createProduct(submitData);
      toast.success("Produto cadastrado com sucesso!");
      setIsDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        category: ProductCategory.FOOD,
        price: 0,
        status: ProductStatus.ACTIVE,
        stockQuantity: 0,
        images: [],
        brand: "",
        manufacturer: "",
        tags: [],
      });
      setPriceDisplay("");
      setImageUrl("");
      setTagInput("");
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Erro ao criar produto. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setFormData({
        name: "",
        description: "",
        category: ProductCategory.FOOD,
        price: 0,
        status: ProductStatus.ACTIVE,
        stockQuantity: 0,
        images: [],
        brand: "",
        manufacturer: "",
        tags: [],
      });
      setPriceDisplay("");
      setImageUrl("");
      setTagInput("");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all whitespace-nowrap shrink-0">
          <Plus className="mr-2 h-4 w-4 shrink-0" />
          <span className="hidden md:inline">Cadastrar Produto</span>
          <span className="hidden sm:inline md:hidden">Cadastrar</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ProductStatus,
                })
              }
              className="flex h-9 w-full rounded-md border border-input bg-input/30 px-3 py-1 text-sm"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
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
              type="text"
              value={priceDisplay}
              onChange={(e) => {
                const value = e.target.value;
                const formatted = formatCurrencyInput(value);
                setPriceDisplay(formatted);
                const numericValue = parseCurrency(value);
                if (numericValue >= 0 && numericValue <= 999999.99) {
                  setFormData({
                    ...formData,
                    price: numericValue,
                  });
                }
              }}
              onBlur={() => {
                if (formData.price === 0) {
                  setPriceDisplay("");
                }
              }}
              placeholder="0,00"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="stock" className="text-sm font-medium">
              Quantidade em Estoque
            </label>
            <Input
              id="stock"
              type="text"
              value={formData.stockQuantity || ""}
              onChange={(e) => {
                const numbers = formatNumber(e.target.value);
                const value = numbers ? parseInt(numbers, 10) : 0;
                if (value >= 0 && value <= 999999) {
                  setFormData({
                    ...formData,
                    stockQuantity: value,
                  });
                }
              }}
              placeholder="0"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="brand" className="text-sm font-medium">
              Marca (opcional)
            </label>
            <Input
              id="brand"
              value={formData.brand || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  brand: e.target.value,
                })
              }
              placeholder="Ex: ZooMed"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="manufacturer" className="text-sm font-medium">
              Fabricante (opcional)
            </label>
            <Input
              id="manufacturer"
              value={formData.manufacturer || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  manufacturer: e.target.value,
                })
              }
              placeholder="Ex: Exo Terra"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="images" className="text-sm font-medium">
              Imagens (URLs)
            </label>
            <div className="flex gap-2">
              <Input
                id="images"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value && !isValidURL(e.target.value)) {
                    toast.error(
                      "URL inválida. Por favor, insira uma URL válida."
                    );
                  }
                }}
                placeholder="https://exemplo.com/imagem.jpg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImage();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addImage}
                disabled={!imageUrl.trim()}
              >
                Adicionar
              </Button>
            </div>
            {formData.images && formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md text-sm"
                  >
                    <span className="truncate max-w-[200px]">{image}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags (opcional)
            </label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Digite uma tag e pressione Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!tagInput.trim()}
              >
                Adicionar
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-primary hover:text-primary/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              isSubmitting ||
              !formData.name ||
              !formData.description ||
              formData.price <= 0
            }
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Package, ArrowUpDown } from "lucide-react";
import { Product } from "@/features/products/model";
import { productService } from "@/features/products/services";
import { ProductCategory, ProductStatus, UserRole } from "@/app/types/common";
import { PageHeader } from "@/components/listings/PageHeader";
import { FilterBar, FilterSelect } from "@/components/listings/FilterBar";
import { ProductCard } from "@/components/listings/ProductCard";
import { LoadingState } from "@/components/listings/LoadingState";
import { EmptyState } from "@/components/listings/EmptyState";
import { Pagination } from "@/components/listings/Pagination";
import { ProductSearchParams } from "@/features/products/model";
import { useUser } from "@/contexts/UserContext";
import { CreateProductForm } from "@/components/forms/CreateProductForm";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { user } = useUser();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "ALL"
  >((categoryParam as ProductCategory) || "ALL");
  const [sortBy, setSortBy] = useState<string>("name");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const categories: { value: ProductCategory | "ALL"; label: string }[] = [
    { value: "ALL", label: "Todas Categorias" },
    { value: ProductCategory.FOOD, label: "Alimentos" },
    { value: ProductCategory.HABITAT, label: "Habitat" },
    { value: ProductCategory.HEALTHCARE, label: "Saúde" },
    { value: ProductCategory.ACCESSORIES, label: "Acessórios" },
    { value: ProductCategory.LIGHTING, label: "Iluminação" },
    { value: ProductCategory.HEATING, label: "Aquecimento" },
    { value: ProductCategory.BOOKS, label: "Livros" },
    { value: ProductCategory.DECORATION, label: "Decoração" },
  ];

  const sortOptions = [
    { value: "name", label: "Nome (A-Z)" },
    { value: "price", label: "Preço (Menor)" },
    { value: "rating", label: "Avaliação" },
    { value: "createdAt", label: "Mais Recentes" },
  ];

  const categoryLabels: Record<ProductCategory, string> = {
    [ProductCategory.FOOD]: "Alimentos",
    [ProductCategory.HABITAT]: "Habitat",
    [ProductCategory.HEALTHCARE]: "Saúde",
    [ProductCategory.ACCESSORIES]: "Acessórios",
    [ProductCategory.LIGHTING]: "Iluminação",
    [ProductCategory.HEATING]: "Aquecimento",
    [ProductCategory.BOOKS]: "Livros",
    [ProductCategory.DECORATION]: "Decoração",
  };

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam as ProductCategory);
    }
  }, [categoryParam]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: ProductSearchParams = {
        query: searchQuery || undefined,
        category: selectedCategory !== "ALL" ? selectedCategory : undefined,
        status: ProductStatus.ACTIVE,
        page: currentPage,
        size: 12,
        sortBy,
        sortDirection: sortBy === "price" ? "asc" : "desc",
      };

      const response = searchQuery.trim()
        ? await productService.searchProducts(params)
        : await productService.getAllProducts(params);

      setProducts(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        icon={Package}
        badge="Loja Especializada"
        title="Produtos para Répteis"
        description="Tudo que seu réptil precisa, cuidadosamente selecionado por especialistas"
      />

      <FilterBar
        searchPlaceholder="Buscar produtos..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onClearFilters={handleClearFilters}
        hasActiveFilters={searchQuery !== "" || selectedCategory !== "ALL"}
      >
        <div className="flex flex-wrap gap-2 items-center">
          <FilterSelect
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value as ProductCategory | "ALL")
            }
            options={categories}
            placeholder="Categoria"
            width="w-full sm:w-[200px]"
          />
          <FilterSelect
            value={sortBy}
            onValueChange={setSortBy}
            options={sortOptions}
            icon={ArrowUpDown}
            placeholder="Ordenar por"
            width="w-full sm:w-[200px]"
          />
          {user?.role === UserRole.SELLER && (
            <div className="w-full sm:w-auto flex justify-end sm:justify-start">
              <CreateProductForm onSuccess={loadProducts} />
            </div>
          )}
        </div>
      </FilterBar>

      <section className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <LoadingState message="Carregando produtos..." />
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Nenhum produto encontrado"
              description="Tente ajustar seus filtros ou busca para encontrar o que precisa"
              onClearFilters={handleClearFilters}
            />
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Mostrando {products.length} produtos
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    categoryLabels={categoryLabels}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

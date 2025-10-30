"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Search,
    ShoppingCart,
    Star,
    Filter,
    ArrowUpDown,
    Package,
    Heart,
    Loader2
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Product, ProductSearchParams } from '@/features/products/model';
import { productService } from '@/features/products/services';
import { ProductCategory, ProductStatus } from '@/app/types/common';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>((categoryParam as ProductCategory) || 'ALL');
    const [sortBy, setSortBy] = useState<string>('name');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const categories: { value: ProductCategory | 'ALL'; label: string }[] = [
        { value: 'ALL', label: 'Todas Categorias' },
        { value: ProductCategory.FOOD, label: 'Alimentos' },
        { value: ProductCategory.HABITAT, label: 'Habitat' },
        { value: ProductCategory.HEALTHCARE, label: 'Saúde' },
        { value: ProductCategory.ACCESSORIES, label: 'Acessórios' },
        { value: ProductCategory.LIGHTING, label: 'Iluminação' },
        { value: ProductCategory.HEATING, label: 'Aquecimento' },
        { value: ProductCategory.BOOKS, label: 'Livros' },
        { value: ProductCategory.DECORATION, label: 'Decoração' },
    ];

    const sortOptions = [
        { value: 'name', label: 'Nome (A-Z)' },
        { value: 'price', label: 'Preço (Menor)' },
        { value: 'rating', label: 'Avaliação' },
        { value: 'createdAt', label: 'Mais Recentes' },
    ];

    useEffect(() => {
        loadProducts();
    }, [searchQuery, selectedCategory, sortBy, currentPage]);

    useEffect(() => {
        if (!categoryParam || categoryParam === 'ALL') {
            setSelectedCategory('ALL');
        } else {
            setSelectedCategory(categoryParam as ProductCategory);
        }
    }, [categoryParam]);

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam as ProductCategory);
        }
    }, [categoryParam]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params: ProductSearchParams = {
                query: searchQuery || undefined,
                category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
                status: ProductStatus.ACTIVE,
                page: currentPage,
                size: 12,
                sortBy,
                sortDirection: sortBy === 'price' ? 'asc' : 'desc',
            };

            const response = searchQuery.trim()
                ? await productService.searchProducts(params)
                : await productService.getAllProducts(params);

            setProducts(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            setProducts([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/5 via-background to-background py-16 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <Badge variant="secondary" className="mb-2">
                            <Package className="h-3 w-3 mr-2" />
                            Loja Especializada
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            Produtos para Répteis
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Tudo que seu réptil precisa, selecionado por especialistas
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar produtos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category Filter */}
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => setSelectedCategory(value as ProductCategory | 'ALL')}
                        >
                            <SelectTrigger className="w-full md:w-[200px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-16">
                            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
                            <p className="text-muted-foreground">
                                Tente ajustar seus filtros ou busca
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <Card key={product.productId} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        <CardHeader className="p-0 relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-3 right-3 z-10 bg-background/80 hover:bg-background"
                                            >
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                            <div className="aspect-square overflow-hidden bg-muted">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-16 w-16 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="p-4 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-semibold line-clamp-2 flex-1">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({product.reviewCount})
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {product.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-2">
                                                <div>
                                                    <p className="text-2xl font-bold text-primary">
                                                        R$ {product.price}
                                                    </p>
                                                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                                                        <p className="text-xs text-orange-500">
                                                            Apenas {product.stockQuantity} em estoque
                                                        </p>
                                                    )}
                                                    {product.stockQuantity === 0 && (
                                                        <p className="text-xs text-red-500">Esgotado</p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="p-4 pt-0 flex gap-2">
                                            <Button
                                                className="flex-1 cursor-pointer"
                                                disabled={product.stockQuantity === 0}
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Adicionar
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-12">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        disabled={currentPage === 0}
                                    >
                                        Anterior
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const page = currentPage < 3 ? i : currentPage - 2 + i;
                                            if (page >= totalPages) return null;
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? 'default' : 'outline'}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page + 1}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                        disabled={currentPage === totalPages - 1}
                                    >
                                        Próximo
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ShoppingCart,
    Star,
    Heart,
    Package,
    User,
    ArrowLeft,
    Loader2,
    Minus,
    Plus,
    Share2,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { Product, ProductReview } from '@/features/products/model';
import { productService } from '@/features/products/services';
import { ProductCategory } from '@/app/types/common';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (productId) {
            loadProduct();
        }
    }, [productId]);

    const loadProduct = async () => {
        if (!productId) return;
        setLoading(true);
        setError(null);
        try {
            const id = productId as string;
            const productData = await productService.getProductById(id);
            setProduct(productData);

            try {
                const reviewsData = await productService.getProductReviews(id, 0, 10);
                setReviews(reviewsData.content || []);
            } catch (err) {
                console.error('Erro ao carregar avaliações:', err);
            }
        } catch (err: any) {
            console.error('Erro ao carregar produto:', err);
            setError(err.message || 'Produto não encontrado');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
        }
    };

    const categoryLabels: Record<ProductCategory, string> = {
        [ProductCategory.FOOD]: 'Alimentos',
        [ProductCategory.HABITAT]: 'Habitat',
        [ProductCategory.HEALTHCARE]: 'Saúde',
        [ProductCategory.ACCESSORIES]: 'Acessórios',
        [ProductCategory.LIGHTING]: 'Iluminação',
        [ProductCategory.HEATING]: 'Aquecimento',
        [ProductCategory.BOOKS]: 'Livros',
        [ProductCategory.DECORATION]: 'Decoração',
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-16">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                </Button>
                <div className="text-center py-16">
                    <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Produto não encontrado</h3>
                    <p className="text-muted-foreground mb-4">
                        {error || 'O produto que você está procurando não existe'}
                    </p>
                    <Button onClick={() => router.push('/produtos')}>
                        Ver Todos os Produtos
                    </Button>
                </div>
            </div>
        );
    }

    const maxQuantity = Math.min(product.stockQuantity, 10);
    const images = product.images && product.images.length > 0 ? product.images : [];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Back Button */}
            <div className="container mx-auto px-4 pt-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                </Button>
            </div>

            {/* Product Content */}
            <div className="container mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Images Section */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square overflow-hidden rounded-xl bg-muted border">
                            {images.length > 0 ? (
                                <img
                                    src={images[selectedImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-24 w-24 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                            ? 'border-primary'
                                            : 'border-transparent hover:border-muted-foreground'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <Badge variant="secondary" className="mb-3">
                                {categoryLabels[product.category]}
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-lg font-semibold">
                                        {product.rating.toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-muted-foreground">
                                    ({product.reviewCount} avaliações)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <p className="text-4xl font-bold text-primary mb-2">
                                    R$ {product.price.toFixed(2)}
                                </p>
                                {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                                    <p className="text-sm text-orange-500 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        Apenas {product.stockQuantity} em estoque
                                    </p>
                                )}
                                {product.stockQuantity === 0 && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        Esgotado
                                    </p>
                                )}
                                {product.stockQuantity >= 10 && (
                                    <p className="text-sm text-green-600 flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Em estoque
                                    </p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Seller Info */}
                        <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Vendedor</p>
                                <p className="font-medium">{product.sellerName}</p>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        {product.stockQuantity > 0 && (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 border rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10"
                                        onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                                        disabled={quantity >= maxQuantity}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Máximo: {maxQuantity}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button
                                className="flex-1 cursor-pointer"
                                size="lg"
                                disabled={product.stockQuantity === 0}
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Adicionar ao Carrinho
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="cursor-pointer"
                            >
                                <Heart className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="cursor-pointer"
                            >
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Additional Info */}
                        {(product.brand || product.manufacturer) && (
                            <div className="pt-4 border-t space-y-2">
                                {product.brand && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Marca:</span>
                                        <span className="font-medium">{product.brand}</span>
                                    </div>
                                )}
                                {product.manufacturer && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Fabricante:</span>
                                        <span className="font-medium">{product.manufacturer}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <Separator className="my-12" />
                <div>
                    <h2 className="text-2xl font-bold mb-6">
                        Avaliações ({product.reviewCount})
                    </h2>
                    {reviews.length === 0 ? (
                        <p className="text-muted-foreground">
                            Ainda não há avaliações para este produto.
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <Card key={review.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold">{review.userName}</h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rating
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-muted-foreground'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{review.comment}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, Package, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/features/products/model';
import { ProductCategory } from '@/app/types/common';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
    product: Product;
    categoryLabels: Record<ProductCategory, string>;
}

export function ProductCard({ product, categoryLabels }: ProductCardProps) {
    const categoryLabel = categoryLabels[product.category] || product.category;
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(product, 1);
    };

    return (
        <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-border/50 hover:border-primary/20">
            <CardHeader className="p-0 relative">
                <Link href={`/produtos/${product.productId}`}>
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50 cursor-pointer relative">
                        <div className="absolute top-3 left-3 z-10">
                            <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                                {categoryLabel}
                            </Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 z-10 bg-background/90 hover:bg-background shadow-md hover:shadow-lg transition-all"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <Heart className="h-4 w-4" />
                        </Button>
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-20 w-20 text-muted-foreground opacity-50" />
                            </div>
                        )}
                    </div>
                </Link>
            </CardHeader>

            <CardContent className="p-5 space-y-3">
                <Link href={`/produtos/${product.productId}`}>
                    <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer leading-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        ({product.reviewCount} avaliações)
                    </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                <div className="pt-2 border-t">
                    <div className="flex items-baseline justify-between">
                        <div>
                            <p className="text-2xl font-bold text-primary">
                                R$ {product.price.toFixed(2).replace('.', ',')}
                            </p>
                            {product.stockQuantity === 0 && (
                                <p className="text-xs text-red-500 mt-1 font-medium">Esgotado</p>
                            )}
                            {product.stockQuantity > 0 && product.stockQuantity < 10 && (
                                <p className="text-xs text-orange-500 mt-1 font-medium">
                                    Apenas {product.stockQuantity} em estoque
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Button
                    className="flex-1 cursor-pointer h-10 font-medium"
                    disabled={product.stockQuantity === 0}
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Adicionar
                </Button>
            </CardFooter>
        </Card>
    );
}


import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CartItem {
    id: string;
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartModalProps {
    items: CartItem[];
    onClose: () => void;
    onCheckout: () => void;
    onUpdateQuantity?: (productId: string, quantity: number) => void;
    onRemoveItem?: (productId: string) => void;
}

export function CartModal({
    items,
    onClose,
    onCheckout,
    onUpdateQuantity,
    onRemoveItem
}: CartModalProps) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal + shipping;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        onUpdateQuantity?.(productId, newQuantity);
    };

    return (
        <>
            {/* Overlay para mobile */}
            <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={onClose}
            />

            <Card className={cn(
                "fixed md:absolute z-50",
                "w-full max-w-[calc(100vw-2rem)] md:w-[380px]",
                "h-[calc(100vh-2rem)] md:h-auto md:max-h-[90vh]",
                "top-4 left-1/2 -translate-x-1/2 md:top-full md:mt-2 md:left-auto md:right-0 md:translate-x-0",
                "shadow-2xl border border-border",
                "animate-in slide-in-from-top-2 duration-300",
                "flex flex-col"
            )}>
                <CardHeader className="">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Seu Carrinho</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    {items.length} {items.length === 1 ? 'item' : 'itens'}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full hover:bg-muted cursor-pointer flex-shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                <Separator className="flex-shrink-0" />

                <CardContent className="p-0 flex-1 min-h-0 flex flex-col">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 flex-1">
                            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-1">Carrinho vazio</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                                Adicione produtos para começar suas compras
                            </p>
                            <Button onClick={onClose} variant="outline" className="rounded-full cursor-pointer hover:bg-accent hover:text-accent-foreground">
                                Continuar Comprando
                            </Button>
                        </div>
                    ) : (
                        <>
                            <ScrollArea className="flex-1 md:h-[300px]">
                                <div className="pb-3 md:pb-4">
                                    {items.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "group flex gap-2 md:gap-3 rounded-lg hover:bg-muted/50 transition-colors px-3 md:px-4 py-2 md:py-2.5",
                                                index > 0 && "mt-2 md:mt-3"
                                            )}
                                        >
                                            <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/placeholder-product.png';
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1.5 md:mb-2">
                                                    <h4 className="font-medium text-xs md:text-sm line-clamp-2 flex-1">
                                                        {item.name}
                                                    </h4>
                                                    {onRemoveItem && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="cursor-pointer h-7 w-7 md:h-6 md:w-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                            onClick={() => onRemoveItem(item.productId || item.id)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5 md:h-3 md:w-3 text-destructive" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-1 border rounded-full p-0.5">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 md:h-6 md:w-6 rounded-full hover:bg-muted cursor-pointer"
                                                            onClick={() => handleUpdateQuantity(item.productId || item.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-3.5 w-3.5 md:h-3 md:w-3" />
                                                        </Button>
                                                        <span className="text-xs md:text-sm font-medium w-6 md:w-8 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 md:h-6 md:w-6 rounded-full hover:bg-muted cursor-pointer"
                                                            onClick={() => handleUpdateQuantity(item.productId || item.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3.5 w-3.5 md:h-3 md:w-3" />
                                                        </Button>
                                                    </div>

                                                    <p className="font-bold text-xs md:text-sm">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <Separator className="flex-shrink-0" />

                            <div className="p-3 md:p-4 space-y-2 md:space-y-3 flex-shrink-0">
                                <div className="space-y-1.5 md:space-y-2">
                                    <div className="flex justify-between text-xs md:text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs md:text-sm">
                                        <span className="text-muted-foreground">Frete</span>
                                        <span className="font-medium">
                                            {shipping === 0 ? (
                                                <span className="text-green-600">Grátis</span>
                                            ) : (
                                                formatPrice(shipping)
                                            )}
                                        </span>
                                    </div>
                                    {subtotal < 200 && (
                                        <p className="text-xs text-muted-foreground">
                                            Falta {formatPrice(200 - subtotal)} para frete grátis!
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-sm md:text-base">Total</span>
                                    <span className="text-xl md:text-2xl font-bold text-primary">
                                        {formatPrice(total)}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>

                {items.length > 0 && (
                    <>
                        <Separator className="flex-shrink-0" />
                        <CardFooter className="p-3 md:p-4 flex-col gap-2 flex-shrink-0">
                            <Button
                                onClick={onCheckout}
                                className="w-full rounded-full font-semibold group cursor-pointer text-sm md:text-base"
                                size="lg"
                            >
                                Finalizar Compra
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="w-full rounded-full cursor-pointer text-sm md:text-base"
                            >
                                Continuar Comprando
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Card>
        </>
    );
}

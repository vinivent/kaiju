import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartModalProps {
    items: CartItem[];
    onClose: () => void;
    onCheckout: () => void;
    onUpdateQuantity?: (id: string, quantity: number) => void;
    onRemoveItem?: (id: string) => void;
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

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        onUpdateQuantity?.(id, newQuantity);
    };

    return (
        <Card className="w-[380px] shadow-2xl border-2 animate-in slide-in-from-top-2 duration-300">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                        className="h-8 w-8 rounded-full hover:bg-muted cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">Carrinho vazio</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            Adicione produtos para começar suas compras
                        </p>
                        <Button onClick={onClose} variant="outline" className="rounded-full">
                            Continuar Comprando
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="h-[300px]">
                            <div className="p-4 space-y-3">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h4 className="font-medium text-sm line-clamp-2 flex-1">
                                                    {item.name}
                                                </h4>
                                                {onRemoveItem && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => onRemoveItem(item.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3 text-destructive" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1 border rounded-full p-0.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-full hover:bg-muted cursor-pointer"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-sm font-medium w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-full hover:bg-muted cursor-pointer"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <p className="font-bold text-sm">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <Separator />

                        <div className="p-4 space-y-3">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
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

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Total</span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatPrice(total)}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>

            {items.length > 0 && (
                <>
                    <Separator />
                    <CardFooter className="p-4 flex-col gap-2">
                        <Button
                            onClick={onCheckout}
                            className="w-full rounded-full font-semibold group cursor-pointer"
                            size="lg"
                        >
                            Finalizar Compra
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="w-full rounded-full cursor-pointer"
                        >
                            Continuar Comprando
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}
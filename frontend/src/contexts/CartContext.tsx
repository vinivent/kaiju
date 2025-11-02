'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product } from '@/features/products/model';
import { toast } from 'sonner';

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    stockQuantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'kaiju-cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Carregar carrinho do localStorage ao inicializar
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                setItems(parsedCart);
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // Salvar carrinho no localStorage sempre que houver mudanças
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
            } catch (error) {
                console.error('Erro ao salvar carrinho:', error);
            }
        }
    }, [items, isInitialized]);

    const addItem = useCallback((product: Product, quantity: number = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find(item => item.productId === product.productId);

            if (existingItem) {
                // Se o item já existe, atualiza a quantidade
                const newQuantity = existingItem.quantity + quantity;

                // Verifica se não excede o estoque
                if (newQuantity > product.stockQuantity) {
                    toast.error(`Quantidade indisponível. Apenas ${product.stockQuantity} unidades em estoque.`, {
                        id: `cart-error-${product.productId}`
                    });
                    return prevItems;
                }

                toast.success(`${product.name} atualizado no carrinho!`, {
                    id: `cart-update-${product.productId}`
                });
                return prevItems.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                // Se o item não existe, adiciona novo
                if (quantity > product.stockQuantity) {
                    toast.error(`Quantidade indisponível. Apenas ${product.stockQuantity} unidades em estoque.`, {
                        id: `cart-error-${product.productId}`
                    });
                    return prevItems;
                }

                toast.success(`${product.name} adicionado ao carrinho!`, {
                    id: `cart-add-${product.productId}`
                });
                return [
                    ...prevItems,
                    {
                        id: `${product.productId}-${Date.now()}`,
                        productId: product.productId,
                        name: product.name,
                        price: product.price,
                        quantity,
                        image: product.images?.[0] || '',
                        stockQuantity: product.stockQuantity,
                    },
                ];
            }
        });
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems((prevItems) => {
            const item = prevItems.find(i => i.productId === productId);
            if (item) {
                toast.success(`${item.name} removido do carrinho.`, {
                    id: `cart-remove-${productId}`
                });
            }
            return prevItems.filter(item => item.productId !== productId);
        });
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(productId);
            return;
        }

        setItems((prevItems) => {
            const item = prevItems.find(i => i.productId === productId);
            if (!item) return prevItems;

            // Verifica se não excede o estoque
            if (quantity > item.stockQuantity) {
                toast.error(`Quantidade indisponível. Apenas ${item.stockQuantity} unidades em estoque.`, {
                    id: `cart-error-${productId}`
                });
                return prevItems;
            }

            return prevItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity }
                    : item
            );
        });
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
        toast.success('Carrinho limpo!', {
            id: 'cart-clear'
        });
    }, []);

    const getItemCount = useCallback(() => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }, [items]);

    const getTotalPrice = useCallback(() => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items]);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getItemCount,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};


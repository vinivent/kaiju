"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "./button";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { CartModal } from "./CartModal";
import { useUser } from "@/contexts/UserContext";

const ProtectedNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
    const { user } = useUser();

    useEffect(() => setMounted(true), []);

    useEffect(() => console.log(user), []);

    const navLinks = [
        { name: "Produtos", path: "/produtos?category=ALL" },
        { name: "Veterinários", path: "/veterinarios" },
        { name: "Locais", path: "/locais" },
        { name: "Artigos", path: "/artigos" },
    ];

    // Mock de itens no carrinho (substitua pelo estado global futuramente)
    const [cartItems] = useState([
        { id: "1", name: "Ração para Répteis", price: 59.9, quantity: 1, image: "/assets/sample1.jpg" },
        { id: "2", name: "Lâmpada UVB 100W", price: 129.9, quantity: 2, image: "/assets/sample2.jpg" },
    ]);

    const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between relative">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center space-x-2">
                        {mounted && (
                            <Image
                                src={theme === "dark" ? "/assets/LogoBranca.png" : "/assets/LogoPreta.png"}
                                width={70}
                                height={70}
                                alt="logo"
                                priority
                            />
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-8 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden items-center space-x-4 md:flex relative">
                        <ThemeToggle />

                        {/* Carrinho (Desktop) */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer relative"
                                onClick={() => setIsCartOpen((prev) => !prev)}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">
                                        {itemCount}
                                    </Badge>
                                )}
                            </Button>

                            {isCartOpen && (
                                <div className="absolute right-0 top-10">
                                    <CartModal
                                        items={cartItems}
                                        onClose={() => setIsCartOpen(false)}
                                        onCheckout={() => alert("Indo para checkout...")}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Usuário */}
                        <Link href="/login">
                            <Button variant="ghost" className="cursor-pointer" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href="/register">
                            {user !== null ? "" : <Button className="rounded-full cursor-pointer">Criar Conta</Button>}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />

                        {/* Carrinho (Mobile) */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer relative"
                                onClick={() => setIsCartOpen((prev) => !prev)}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">
                                        {itemCount}
                                    </Badge>
                                )}
                            </Button>

                            {isCartOpen && (
                                <div className="absolute right-0 top-10">
                                    <CartModal
                                        items={cartItems}
                                        onClose={() => setIsCartOpen(false)}
                                        onCheckout={() => alert("Indo para checkout...")}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Botão menu */}
                        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="border-t border-border py-4 md:hidden">
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                                <Link href="/profile" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full cursor-pointer">
                                        Meu Perfil
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default ProtectedNav;

"use client";

import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import {
  Package,
  Stethoscope,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  UserPlus,
  CheckCircle2,
  Zap,
  Star,
  Award,
  Heart,
  Shield,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { userService } from "@/features/user/service";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { productService } from "@/features/products/services";

export default function HomePage() {
  const { user, loading, refreshUser } = useUser();
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [productCount, setProductCount] = useState<number>(0);

  useEffect(() => {
    productService.getProductCount().then((count) => {
      console.log("Total de produtos:", count);
      setProductCount(count);
    });
  }, []);

  const handleBecomeVeterinarian = async () => {
    setIsUpdatingRole(true);
    try {
      await userService.becomeVeterinarian();
      await refreshUser();
      toast.success("Perfil de veterinário ativado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar role:", error);
      toast.error(
        error?.response?.data || "Erro ao atualizar role. Tente novamente."
      );
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleBecomeSeller = async () => {
    setIsUpdatingRole(true);
    try {
      await userService.becomeSeller();
      await refreshUser();
      toast.success("Perfil de vendedor ativado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar role:", error);
      toast.error(
        error?.response?.data || "Erro ao atualizar role. Tente novamente."
      );
    } finally {
      setIsUpdatingRole(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 dark:from-primary/20 dark:via-background dark:to-primary/10 py-24 md:py-36">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 border border-primary/30 dark:border-primary/20 mb-6 animate-in fade-in slide-in-from-top-4 duration-700 shadow-lg backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">
                Bem-vindo de volta!
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-foreground text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                Olá,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80">
                  {user?.name || "Amigo"}
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 font-light">
                Tudo o que você precisa para cuidar do seu réptil em um só lugar
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/produtos">
                <Button
                  size="lg"
                  className="cursor-pointer group bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-6 text-base"
                >
                  <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Explorar Produtos
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/veterinarios">
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer group hover:bg-accent/50 transition-all duration-300 hover:scale-105 px-8 py-6 text-base shadow-md hover:shadow-lg"
                >
                  <Stethoscope className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Encontrar Veterinários
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Produtos */}
          <Link href="/produtos" className="group block">
            <Card className="h-full border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer bg-gradient-to-br from-card via-card to-primary/5 dark:to-primary/10">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <Package className="h-12 w-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
                      <Award className="h-3 w-3 text-primary" />
                      <span className="text-xs font-semibold text-primary">
                        Premium
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      Produtos em Destaque
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                      Explore os melhores produtos para seu réptil com qualidade
                      garantida
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 dark:bg-muted/30">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">
                      Produtos Premium
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 dark:bg-muted/30">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">
                      Qualidade Garantida
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 dark:bg-muted/30">
                    <Star className="h-5 w-5 text-primary fill-primary flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {productCount === 0
                        ? "Produtos Disponíveis"
                        : productCount === 1
                        ? "1 Produto"
                        : `${productCount} Produtos`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 dark:bg-primary/10 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-semibold text-lg">
                    Ver Produtos
                  </span>
                  <ArrowRight className="h-6 w-6 text-primary group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Professional Sections */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 mb-6">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Comunidade
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Faça Parte da Nossa Comunidade
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Junte-se a centenas de profissionais que confiam na nossa plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Veterinário */}
          <Card className="border-2 overflow-hidden group hover:border-primary/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card via-card to-primary/5 dark:to-primary/10">
            <div className="p-10">
              <div className="flex items-start gap-6 mb-10">
                <div className="p-5 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Stethoscope className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 mb-3">
                    <Award className="h-3 w-3 text-primary" />
                    <span className="text-xs font-semibold text-primary">
                      Profissional
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-3">
                    Seja um Veterinário
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Junte-se à nossa comunidade de especialistas
                  </p>
                </div>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/20 hover:bg-muted/50 transition-colors">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base font-medium">
                    Conecte-se com proprietários de répteis
                  </span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/20 hover:bg-muted/50 transition-colors">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base font-medium">
                    Perfil profissional verificado
                  </span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/20 hover:bg-muted/50 transition-colors">
                  <MessageCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base font-medium">
                    Sistema de chat em tempo real
                  </span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/20 hover:bg-muted/50 transition-colors">
                  <Star className="h-6 w-6 text-primary fill-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base font-medium">
                    Receba avaliações e feedback
                  </span>
                </li>
              </ul>

              <Button
                onClick={handleBecomeVeterinarian}
                disabled={isUpdatingRole}
                size="lg"
                className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 group/btn shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <UserPlus className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                Seja um veterinário
                <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          {/* Vendedor */}
          <Card className="border-2 overflow-hidden group hover:border-secondary/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card via-card to-secondary/5 dark:to-secondary/10">
            <div className="p-10">
              <div className="flex items-start gap-6 mb-10">
                <div className="p-5 rounded-3xl bg-gradient-to-br from-secondary/20 to-secondary/10 dark:from-secondary/30 dark:to-secondary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <ShoppingBag className="h-12 w-12 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 dark:bg-secondary/20 mb-3">
                    <Zap className="h-3 w-3 text-secondary" />
                    <span className="text-xs font-semibold text-secondary">
                      E-commerce
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-3">
                    Seja um Vendedor
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Venda seus produtos na nossa plataforma
                  </p>
                </div>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/20 hover:bg-muted/50 transition-colors">
                  <ShoppingBag className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-base font-medium">
                    Plataforma completa de e-commerce
                  </span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/20 hover:bg-muted/50 transition-colors">
                  <Package className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-base font-medium">
                    Gerencie seus produtos facilmente
                  </span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/20 hover:bg-muted/50 transition-colors">
                  <Star className="h-6 w-6 text-secondary fill-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-base font-medium">
                    Sistema de avaliações e reviews
                  </span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/20 hover:bg-muted/50 transition-colors">
                  <TrendingUp className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-base font-medium">
                    Alcance milhares de clientes
                  </span>
                </li>
              </ul>

              <Button
                onClick={handleBecomeSeller}
                disabled={isUpdatingRole}
                size="lg"
                className="w-full cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/90 group/btn shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Zap className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                Começar a Vender
                <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-24">
        <Card className="border-2 bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:via-background dark:to-secondary/20 overflow-hidden relative shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <CardContent className="pt-20 pb-20 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 border border-primary/30 dark:border-primary/20 shadow-lg backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">
                  Cresça com a gente
                </span>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  Comece sua jornada hoje
                </h2>

                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  Explore nossa plataforma e descubra tudo que oferecemos para
                  cuidar do seu réptil
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link href="/produtos">
                  <Button
                    size="lg"
                    className="cursor-pointer group bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-6 text-base"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Explorar Produtos
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/veterinarios">
                  <Button
                    size="lg"
                    variant="outline"
                    className="cursor-pointer group hover:bg-accent/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 px-8 py-6 text-base"
                  >
                    <Stethoscope className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Encontrar Veterinários
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { userService } from "@/features/user/service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HomePage() {
  const { user, loading, refreshUser } = useUser();
  const router = useRouter();
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

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

  const stats = [
    {
      label: "Produtos Disponíveis",
      value: "+500",
      icon: ShoppingBag,
      color: "text-primary",
      bgColor:
        "from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10",
    },
    {
      label: "Veterinários Verificados",
      value: "+100",
      icon: Stethoscope,
      color: "text-secondary dark:text-secondary-foreground",
      bgColor:
        "from-secondary/20 to-secondary/10 dark:from-secondary/30 dark:to-secondary/10",
    },
    {
      label: "Artigos Publicados",
      value: "+200",
      icon: BookOpen,
      color: "text-primary",
      bgColor:
        "from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background dark:from-primary/20 dark:via-background dark:to-background py-20 md:py-32">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/20 dark:bg-primary/30 border border-primary/30 dark:border-primary/20 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Bem-vindo de volta!
              </span>
            </div>

            <h1 className="text-foreground text-5xl md:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Olá, <span className="text-primary">{user?.name || "Amigo"}</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Tudo o que você precisa para cuidar do seu réptil em um só lugar
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/produtos">
                <Button className="cursor-pointer group bg-primary text-primary-foreground hover:bg-primary/90">
                  <ShoppingBag className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Explorar Produtos
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/veterinarios">
                <Button
                  variant="outline"
                  className="cursor-pointer group border-1"
                >
                  <Stethoscope className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Encontrar Veterinários
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-1 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/80 backdrop-blur-sm"
            >
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-4xl font-bold mb-2">{stat.value}</p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor}`}
                  >
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Content Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Produtos */}
          <Link href="/produtos" className="group">
            <Card className="h-full border-1 hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-start gap-6 mb-6">
                  <div className="p-4 rounded-2xl bg-primary/20 dark:bg-primary/30 group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-10 w-10 text-secondary dark:text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                      Produtos em Destaque
                    </h3>
                    <p className="text-muted-foreground text-base mb-6">
                      Explore os melhores produtos para seu réptil
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Produtos Premium</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>
                      Qualidade garantida pelos melhores especialistas
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Mais de 500 produtos disponíveis</span>
                  </div>
                </div>

                <div className="flex items-center text-primary font-semibold group-hover:gap-3 gap-2 transition-all">
                  Ver Produtos
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Artigos */}
          <Link href="/artigos" className="group">
            <Card className="h-full border-1">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-start gap-6 mb-6">
                  <div className="p-4 rounded-2xl bg-secondary/20 dark:bg-secondary/30 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-10 w-10 text-secondary dark:text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-secondary dark:group-hover:text-secondary-foreground transition-colors">
                      Artigos Recentes
                    </h3>
                    <p className="text-muted-foreground text-base mb-6">
                      Aprenda com nossos guias especializados
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary dark:bg-secondary-foreground" />
                    <span>Guias de Cuidados</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary dark:bg-secondary-foreground" />
                    <span>Tudo que você precisa saber sobre répteis</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary dark:bg-secondary-foreground" />
                    <span>Mais de 200 artigos publicados</span>
                  </div>
                </div>

                <div className="flex items-center text-secondary dark:text-secondary-foreground font-semibold group-hover:gap-3 gap-2 transition-all">
                  Ler Artigos
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Professional Sections */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Faça Parte da Nossa Comunidade
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Junte-se a centenas de profissionais que confiam na nossa plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Veterinário */}
          <Card className="border-1 overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="p-10">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-primary/20 dark:bg-primary/50 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-10 w-10 text-secondary dark:text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">
                    Seja um Veterinário
                  </h3>
                  <p className="text-muted-foreground">
                    Junte-se à nossa comunidade de especialistas
                  </p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Conecte-se com proprietários de répteis
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Perfil profissional verificado
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Sistema de chat em tempo real
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Receba avaliações e feedback
                  </span>
                </li>
              </ul>

              <Button
                onClick={handleBecomeVeterinarian}
                disabled={isUpdatingRole}
                className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 group/btn"
              >
                <UserPlus className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                Seja um veterinário
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          {/* Vendedor */}
          <Card className="border-1 overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="p-10">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-secondary/20 dark:bg-secondary/50 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="h-10 w-10 text-secondary dark:text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">Seja um Vendedor</h3>
                  <p className="text-muted-foreground">
                    Venda seus produtos na nossa plataforma
                  </p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary dark:text-secondary-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Plataforma completa de e-commerce
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary dark:text-secondary-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Gerencie seus produtos facilmente
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary dark:text-secondary-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Sistema de avaliações e reviews
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary dark:text-secondary-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Alcance milhares de clientes
                  </span>
                </li>
              </ul>

              <Button
                onClick={handleBecomeSeller}
                disabled={isUpdatingRole}
                className="w-full cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/90 group/btn"
              >
                <Zap className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                Começar a Vender
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="border-1 bg-gradient-to-br from-muted/50 via-background to-muted/50 dark:from-muted/30 dark:via-background dark:to-muted/30 overflow-hidden relative">
          <CardContent className="pt-16 pb-16 text-center relative">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/20 dark:from-primary/30 dark:to-primary/30 border border-primary/30 dark:border-primary/20 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                  Cresça com a gente
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Comece sua jornada hoje
              </h2>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Explore nossa plataforma e descubra tudo que oferecemos para
                cuidar do seu réptil
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link href="/produtos">
                  <Button className="cursor-pointer group bg-primary text-primary-foreground hover:bg-primary/90">
                    <ShoppingBag className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Explorar Produtos
                  </Button>
                </Link>
                <Link href="/veterinarios">
                  <Button
                    variant="outline"
                    className="cursor-pointer group border-1"
                  >
                    <Stethoscope className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Encontrar Veterinários
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

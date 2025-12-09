import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Sparkles, Zap, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <Badge variant="secondary" className="w-fit hover-scale -mb-14">
              <Sparkles className="h-3 w-3 mr-2" />
              Plataforma Especializada em Répteis
            </Badge>

            <div className="space-y-4">
              <h1 className="text-8xl font-bold leading-tight text-primary">
                Kaiju
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                A plataforma completa conectando donos de répteis com
                veterinários especializados, produtos de qualidade e
                conhecimento especializado. Tudo em um só lugar.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Certificados</p>
                  <p className="text-muted-foreground text-xs">Veterinários</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Disponível 24/7</p>
                  <p className="text-muted-foreground text-xs">Suporte</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto cursor-pointer rounded-full text-base px-8 shadow-lg hover:shadow-xl transition-all group hover-scale"
                >
                  Começar Grátis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/produtos">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full cursor-pointer sm:w-auto rounded-full text-base px-8 hover-scale"
                >
                  Explorar Produtos
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="relative lg:block hidden animate-scale-in"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
                <Image
                  src="/assets/hero-reptile.jpg"
                  alt="Réptil exótico"
                  className="w-full h-[600px] object-cover"
                  width={1500}
                  height={1500}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Cuidado Especializado
                  </h3>
                  <p className="text-muted-foreground">
                    Conectando você aos melhores profissionais
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 fill-card"
          viewBox="0 0 1440 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,32L80,37.3C160,43,320,53,480,48C640,43,800,21,960,16C1120,11,1280,21,1360,26.7L1440,32L1440,48L1360,48C1280,48,1120,48,960,48C800,48,640,48,480,48C320,48,160,48,80,48L0,48Z" />
        </svg>
      </div>
    </section>
  );
}

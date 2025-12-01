"use client"

import { Package, Stethoscope, MapPin, BookOpen } from "lucide-react";
import FeaturesSection from "@/components/ui/features-section";
import CtaSection from "@/components/ui/cta-section";
import { HeroSection } from "@/components/ui/HeroSection";

export default function Home() {
  const features = [
    {
      icon: Package,
      title: "Loja Especializada",
      description: "Produtos de qualidade para todos os tipos de répteis",
    },
    {
      icon: Stethoscope,
      title: "Veterinários Especializados",
      description: "Conecte-se com os melhores profissionais da área",
    },
    {
      icon: MapPin,
      title: "Locais de Atendimento",
      description: "Encontre clínicas e hospitais próximos a você",
    },
    {
      icon: BookOpen,
      title: "Guias de Cuidados",
      description: "Artigos completos sobre cuidados com répteis",
    },
  ];

  return (
    <div className="flex flex-col justify-center gap-3">
      

      <HeroSection/>

      {/* Features Section */}
      <FeaturesSection featureItems={features} />

      {/* CTA Section */}
      <CtaSection />

      
    </div>
  );
}

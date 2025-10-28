"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { ArrowRight, Package, Stethoscope, MapPin, BookOpen, Star, Shield, Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const benefits = [
    { icon: Star, text: "Produtos selecionados por especialistas" },
    { icon: Shield, text: "Veterinários certificados" },
    { icon: Clock, text: "Atendimento de emergência 24h" },
  ];

  return (
    <div className="flex flex-col justify-center gap-3">
      <Navbar />

      <HeroSection/>

      {/* Features Section */}
      <FeaturesSection featureItems={features} />

      {/* CTA Section */}
      <CtaSection />

      <Footer />
    </div>
  );
}

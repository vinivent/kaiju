import { LucideIcon } from 'lucide-react';
import React from 'react'
import { Card } from './card';
import { Badge } from './badge';

interface FeatureItem {
    icon: LucideIcon;
    title: string,
    description: string
}

interface FeatureProps {
    featureItems: FeatureItem[]
}

const FeaturesSection: React.FC<FeatureProps> = ({ featureItems }) => {
    return (
        <section className="py-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-16 animate-fade-in">
                    <Badge variant="outline" className="mb-4">Recursos</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Tudo que você precisa
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Uma plataforma completa para cuidar do seu réptil com excelência
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featureItems.map((feature, index) => (
                        <Card
                            key={index}
                            className="group p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm animate-scale-in hover-scale"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
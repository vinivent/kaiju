import React from 'react'
import { Card } from './card'
import { Badge } from './badge'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from './button'

const CtaSection = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 relative">
                <Card className="relative overflow-hidden border-border/50 shadow-2xl animate-scale-in">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
                    <div className="relative p-12 md:p-16 text-center">
                        <Badge variant="secondary" className="mb-4 hover-scale">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Comece Agora
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            Pronto para começar?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            Junte-se a milhares de tutores que já cuidam melhor de seus répteis com nossa plataforma
                        </p>
                        <Link href="/register" className="hover-scale inline-block">
                            <Button size="lg" className="rounded-full cursor-pointer text-base px-8 shadow-lg hover:shadow-xl transition-all">
                                Criar Conta Gratuita
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </section>
    )
}

export default CtaSection
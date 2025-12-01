import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Mail, Globe, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { HealthcareLocation } from '@/features/healthcare-locations/model';
import { LocationType } from '@/app/types/common';

interface LocationCardProps {
    location: HealthcareLocation;
    typeLabels: Record<LocationType | 'ALL', string>;
}

export function LocationCard({ location, typeLabels }: LocationCardProps) {
    const typeLabel = typeLabels[location.type] || location.type;

    return (
        <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-border/50 hover:border-primary/20 flex flex-col">
            <CardHeader className="p-0">
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-muted to-muted/50 rounded-t-xl">
                    {location.imageUrl ? (
                        <Image
                            src={location.imageUrl}
                            alt={location.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="h-20 w-20 text-muted-foreground opacity-50" />
                        </div>
                    )}
                    <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary" className="backdrop-blur-sm bg-background/80 text-xs">
                            {typeLabel}
                        </Badge>
                    </div>
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                        {location.emergencyService && (
                            <Badge variant="destructive" className="gap-1.5 backdrop-blur-sm bg-background/90 text-xs">
                                <AlertCircle className="h-3 w-3" />
                                Emergência
                            </Badge>
                        )}
                        {location.hours24 && (
                            <Badge variant="secondary" className="gap-1.5 backdrop-blur-sm bg-background/90 text-xs">
                                <Clock className="h-3 w-3" />
                                24h
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 leading-tight">{location.name}</h3>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">{location.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            ({location.reviewCount} avaliações)
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {location.description}
                    </p>
                </div>

                <div className="space-y-3 pt-3 border-t">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2 leading-relaxed">
                            {location.address}, {location.city} - {location.state}
                        </span>
                    </div>
                    {location.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span>{location.phone}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                        {location.acceptsInsurance && (
                            <Badge variant="outline" className="text-xs gap-1.5 px-2 py-0.5">
                                <CheckCircle2 className="h-3 w-3" />
                                Aceita Convênio
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex gap-3">
                <Button
                    className="flex-1 cursor-pointer h-10 font-medium"
                    asChild
                >
                    <a href={`tel:${location.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Ligar
                    </a>
                </Button>
                {location.website && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer h-10 w-10"
                        asChild
                    >
                        <a href={location.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                        </a>
                    </Button>
                )}
                {location.email && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer h-10 w-10"
                        asChild
                    >
                        <a href={`mailto:${location.email}`}>
                            <Mail className="h-4 w-4" />
                        </a>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}


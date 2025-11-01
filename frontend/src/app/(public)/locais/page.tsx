"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Search,
    MapPin,
    Star,
    Phone,
    Mail,
    Globe,
    Filter,
    ArrowUpDown,
    Clock,
    Loader2,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import { HealthcareLocation } from '@/features/healthcare-locations/model';
import { healthcareLocationService } from '@/features/healthcare-locations/services';
import { LocationType, LocationStatus } from '@/app/types/common';

export default function LocationsPage() {
    const [locations, setLocations] = useState<HealthcareLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<LocationType | 'ALL'>('ALL');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const [emergencyOnly, setEmergencyOnly] = useState<boolean | undefined>(undefined);
    const [hours24, setHours24] = useState<boolean | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string>('rating');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const locationTypes: { value: LocationType | 'ALL'; label: string }[] = [
        { value: 'ALL', label: 'Todos os Tipos' },
        { value: LocationType.VETERINARY_CLINIC, label: 'Clínica Veterinária' },
        { value: LocationType.EMERGENCY_HOSPITAL, label: 'Hospital de Emergência' },
        { value: LocationType.SPECIALTY_CENTER, label: 'Centro Especializado' },
        { value: LocationType.PET_STORE, label: 'Pet Shop' },
        { value: LocationType.RESCUE_CENTER, label: 'Centro de Resgate' },
    ];

    const sortOptions = [
        { value: 'rating', label: 'Melhor Avaliação' },
        { value: 'name', label: 'Nome (A-Z)' },
        { value: 'reviews', label: 'Mais Avaliado' },
    ];

    useEffect(() => {
        loadLocations();
    }, [searchQuery, selectedType, selectedCity, selectedState, emergencyOnly, hours24, sortBy, currentPage]);

    const loadLocations = async () => {
        setLoading(true);
        try {
            const params = {
                query: searchQuery || undefined,
                type: selectedType !== 'ALL' ? selectedType : undefined,
                city: selectedCity || undefined,
                state: selectedState || undefined,
                emergencyService: emergencyOnly,
                hours24: hours24,
                status: LocationStatus.ACTIVE,
                page: currentPage,
                size: 12,
                sortBy,
                sortDirection: 'desc' as const,
            };

            const response = await healthcareLocationService.searchLocations(params);
            setLocations(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            console.error('Erro ao carregar locais:', error);
            setLocations([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/5 via-background to-background py-16 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <Badge variant="secondary" className="mb-2">
                            <MapPin className="h-3 w-3 mr-2" />
                            Encontre Locais Próximos
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            Locais de Atendimento
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Encontre clínicas, hospitais e centros especializados perto de você
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar locais..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Type Filter */}
                        <Select
                            value={selectedType}
                            onValueChange={(value) => setSelectedType(value as LocationType | 'ALL')}
                        >
                            <SelectTrigger className="w-full md:w-[220px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {locationTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* City */}
                        <Input
                            placeholder="Cidade"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full md:w-[150px]"
                        />

                        {/* State */}
                        <Input
                            placeholder="Estado (UF)"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full md:w-[120px]"
                            maxLength={2}
                        />

                        {/* Emergency Only */}
                        <Select
                            value={emergencyOnly === undefined ? 'all' : emergencyOnly ? 'yes' : 'no'}
                            onValueChange={(value) => {
                                if (value === 'all') setEmergencyOnly(undefined);
                                else setEmergencyOnly(value === 'yes');
                            }}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Emergência</SelectItem>
                                <SelectItem value="yes">Apenas Emergência</SelectItem>
                                <SelectItem value="no">Sem Filtro</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* 24h */}
                        <Select
                            value={hours24 === undefined ? 'all' : hours24 ? 'yes' : 'no'}
                            onValueChange={(value) => {
                                if (value === 'all') setHours24(undefined);
                                else setHours24(value === 'yes');
                            }}
                        >
                            <SelectTrigger className="w-full md:w-[150px]">
                                <Clock className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Horário</SelectItem>
                                <SelectItem value="yes">24 Horas</SelectItem>
                                <SelectItem value="no">Horário Normal</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            {/* Locations Grid */}
            <section className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : locations.length === 0 ? (
                        <div className="text-center py-16">
                            <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Nenhum local encontrado</h3>
                            <p className="text-muted-foreground">
                                Tente ajustar seus filtros ou busca
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {locations.map((location) => (
                                    <Card key={location.id} className="group hover:shadow-xl transition-all duration-300">
                                        <CardHeader className="p-0">
                                            <div className="relative h-48 overflow-hidden bg-muted rounded-t-xl">
                                                {location.imageUrl ? (
                                                    <img
                                                        src={location.imageUrl}
                                                        alt={location.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <MapPin className="h-16 w-16 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    {location.emergencyService && (
                                                        <Badge variant="destructive" className="gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Emergência
                                                        </Badge>
                                                    )}
                                                    {location.hours24 && (
                                                        <Badge variant="secondary" className="gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            24h
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="p-6 space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">{location.name}</h3>
                                                <Badge variant="outline" className="text-xs">
                                                    {locationTypes.find(t => t.value === location.type)?.label || location.type}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">{location.rating.toFixed(1)}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({location.reviewCount} avaliações)
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {location.description}
                                            </p>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-start gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">
                                                        {location.address}, {location.city} - {location.state}
                                                    </span>
                                                </div>
                                                {location.phone && (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Phone className="h-4 w-4 flex-shrink-0" />
                                                        <span>{location.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {location.acceptsInsurance && (
                                                    <Badge variant="outline" className="text-xs gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Aceita Convênio
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="p-6 pt-0 flex gap-2">
                                            <Button
                                                className="flex-1 cursor-pointer"
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
                                                    className="cursor-pointer"
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
                                                    className="cursor-pointer"
                                                    asChild
                                                >
                                                    <a href={`mailto:${location.email}`}>
                                                        <Mail className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-12">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        disabled={currentPage === 0}
                                    >
                                        Anterior
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const page = currentPage < 3 ? i : currentPage - 2 + i;
                                            if (page >= totalPages) return null;
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? 'default' : 'outline'}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page + 1}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                        disabled={currentPage === totalPages - 1}
                                    >
                                        Próximo
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}


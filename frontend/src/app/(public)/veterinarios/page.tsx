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
    Stethoscope,
    Star,
    MapPin,
    Phone,
    Mail,
    Filter,
    ArrowUpDown,
    Video,
    Loader2,
    User,
} from 'lucide-react';
import { Veterinarian } from '@/features/veterinarians/models';
import { veterinarianService } from '@/features/veterinarians/services';
import { ReptileSpecialty, VetStatus } from '@/app/types/common';
import Link from 'next/link';

export default function VeterinariansPage() {
    const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState<ReptileSpecialty | 'ALL'>('ALL');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const [onlineConsultation, setOnlineConsultation] = useState<boolean | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string>('rating');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const specialties: { value: ReptileSpecialty | 'ALL'; label: string }[] = [
        { value: 'ALL', label: 'Todas Especialidades' },
        { value: ReptileSpecialty.SNAKES, label: 'Serpentes' },
        { value: ReptileSpecialty.LIZARDS, label: 'Lagartos' },
        { value: ReptileSpecialty.TURTLES, label: 'Tartarugas' },
        { value: ReptileSpecialty.CROCODILIANS, label: 'Crocodilianos' },
        { value: ReptileSpecialty.AMPHIBIANS, label: 'Anfíbios' },
        { value: ReptileSpecialty.GENERAL, label: 'Geral' },
    ];

    const sortOptions = [
        { value: 'rating', label: 'Melhor Avaliação' },
        { value: 'experience', label: 'Mais Experiência' },
        { value: 'name', label: 'Nome (A-Z)' },
        { value: 'fee', label: 'Menor Taxa' },
    ];

    useEffect(() => {
        loadVeterinarians();
    }, [searchQuery, selectedSpecialty, selectedCity, selectedState, onlineConsultation, sortBy, currentPage]);

    const loadVeterinarians = async () => {
        setLoading(true);
        try {
            const params = {
                query: searchQuery || undefined,
                specialty: selectedSpecialty !== 'ALL' ? selectedSpecialty : undefined,
                city: selectedCity || undefined,
                state: selectedState || undefined,
                onlineConsultation: onlineConsultation,
                status: VetStatus.ACTIVE,
                page: currentPage,
                size: 12,
                sortBy,
                sortDirection: (sortBy === 'fee' ? 'asc' : 'desc') as 'asc' | 'desc',
            };

            const response = await veterinarianService.searchVeterinarians(params);
            setVeterinarians(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            console.error('Erro ao carregar veterinários:', error);
            setVeterinarians([]);
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
                            <Stethoscope className="h-3 w-3 mr-2" />
                            Profissionais Especializados
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            Veterinários Especializados
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Encontre os melhores profissionais para cuidar do seu réptil
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
                                placeholder="Buscar veterinários..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Specialty Filter */}
                        <Select
                            value={selectedSpecialty}
                            onValueChange={(value) => setSelectedSpecialty(value as ReptileSpecialty | 'ALL')}
                        >
                            <SelectTrigger className="w-full md:w-[200px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {specialties.map((spec) => (
                                    <SelectItem key={spec.value} value={spec.value}>
                                        {spec.label}
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

                        {/* Online Consultation */}
                        <Select
                            value={onlineConsultation === undefined ? 'all' : onlineConsultation ? 'yes' : 'no'}
                            onValueChange={(value) => {
                                if (value === 'all') setOnlineConsultation(undefined);
                                else setOnlineConsultation(value === 'yes');
                            }}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <Video className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Consultas Online</SelectItem>
                                <SelectItem value="yes">Apenas Online</SelectItem>
                                <SelectItem value="no">Apenas Presencial</SelectItem>
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

            {/* Veterinarians Grid */}
            <section className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : veterinarians.length === 0 ? (
                        <div className="text-center py-16">
                            <Stethoscope className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Nenhum veterinário encontrado</h3>
                            <p className="text-muted-foreground">
                                Tente ajustar seus filtros ou busca
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {veterinarians.map((vet) => (
                                    <Card key={vet.id} className="group hover:shadow-xl transition-all duration-300">
                                        <CardHeader className="p-0">
                                            <div className="relative h-48 overflow-hidden bg-muted rounded-t-xl">
                                                {vet.imageUrl ? (
                                                    <img
                                                        src={vet.imageUrl}
                                                        alt={vet.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="h-16 w-16 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="p-6 space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">{vet.fullName}</h3>
                                                <p className="text-sm text-muted-foreground">{vet.clinicName}</p>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">{vet.rating.toFixed(1)}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({vet.reviewCount} avaliações)
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {vet.bio}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {vet.specialties.slice(0, 2).map((spec, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {specialties.find(s => s.value === spec)?.label || spec}
                                                    </Badge>
                                                ))}
                                                {vet.specialties.length > 2 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{vet.specialties.length - 2}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{vet.city}, {vet.state}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Stethoscope className="h-4 w-4" />
                                                    <span>{vet.yearsOfExperience} anos de experiência</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t">
                                                <div>
                                                    <p className="text-lg font-bold text-primary">
                                                        R$ {vet.consultationFee.toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">por consulta</p>
                                                </div>
                                                {vet.availableForOnlineConsultation && (
                                                    <Badge variant="outline" className="gap-1">
                                                        <Video className="h-3 w-3" />
                                                        Online
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="p-6 pt-0 flex gap-2">
                                            <Button
                                                className="flex-1 cursor-pointer"
                                                asChild
                                            >
                                                <Link href={`/veterinarios/${vet.id}`}>
                                                    Ver Perfil
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="cursor-pointer"
                                            >
                                                <Phone className="h-4 w-4" />
                                            </Button>
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


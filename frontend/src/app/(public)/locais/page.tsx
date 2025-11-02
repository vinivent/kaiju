"use client"

import { useState, useEffect } from 'react';
import { MapPin, Filter, ArrowUpDown, AlertCircle, Clock } from 'lucide-react';
import { HealthcareLocation } from '@/features/healthcare-locations/model';
import { healthcareLocationService } from '@/features/healthcare-locations/services';
import { LocationType, LocationStatus } from '@/app/types/common';
import { PageHeader } from '@/components/listings/PageHeader';
import { FilterBar, FilterSelect, FilterInput } from '@/components/listings/FilterBar';
import { LocationCard } from '@/components/listings/LocationCard';
import { LoadingState } from '@/components/listings/LoadingState';
import { EmptyState } from '@/components/listings/EmptyState';
import { Pagination } from '@/components/listings/Pagination';

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

    const typeLabels: Record<LocationType | 'ALL', string> = {
        ALL: 'Todos os Tipos',
        [LocationType.VETERINARY_CLINIC]: 'Clínica Veterinária',
        [LocationType.EMERGENCY_HOSPITAL]: 'Hospital de Emergência',
        [LocationType.SPECIALTY_CENTER]: 'Centro Especializado',
        [LocationType.PET_STORE]: 'Pet Shop',
        [LocationType.RESCUE_CENTER]: 'Centro de Resgate',
    };

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

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedType('ALL');
        setSelectedCity('');
        setSelectedState('');
        setEmergencyOnly(undefined);
        setHours24(undefined);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <PageHeader
                icon={MapPin}
                badge="Encontre Locais Próximos"
                title="Locais de Atendimento"
                description="Encontre clínicas, hospitais e centros especializados perto de você"
            />

            <FilterBar
                searchPlaceholder="Buscar locais..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onClearFilters={handleClearFilters}
                hasActiveFilters={
                    searchQuery !== '' ||
                    selectedType !== 'ALL' ||
                    selectedCity !== '' ||
                    selectedState !== '' ||
                    emergencyOnly !== undefined ||
                    hours24 !== undefined
                }
            >
                <FilterSelect
                    value={selectedType}
                    onValueChange={(value) => setSelectedType(value as LocationType | 'ALL')}
                    options={locationTypes}
                    icon={Filter}
                    placeholder="Tipo de local"
                    width="w-full sm:w-[200px]"
                />
                <FilterInput
                    placeholder="Cidade"
                    value={selectedCity}
                    onChange={setSelectedCity}
                    width="w-full sm:w-[160px]"
                />
                <FilterInput
                    placeholder="Estado (UF)"
                    value={selectedState}
                    onChange={(value) => setSelectedState(value.toUpperCase())}
                    width="w-full sm:w-[120px]"
                    maxLength={2}
                />
                <FilterSelect
                    value={emergencyOnly === undefined ? 'all' : emergencyOnly ? 'yes' : 'no'}
                    onValueChange={(value) => {
                        if (value === 'all') setEmergencyOnly(undefined);
                        else setEmergencyOnly(value === 'yes');
                    }}
                    options={[
                        { value: 'all', label: 'Emergência' },
                        { value: 'yes', label: 'Apenas Emergência' },
                        { value: 'no', label: 'Sem Filtro' },
                    ]}
                    icon={AlertCircle}
                    placeholder="Serviço de emergência"
                    width="w-full sm:w-[180px]"
                />
                <FilterSelect
                    value={hours24 === undefined ? 'all' : hours24 ? 'yes' : 'no'}
                    onValueChange={(value) => {
                        if (value === 'all') setHours24(undefined);
                        else setHours24(value === 'yes');
                    }}
                    options={[
                        { value: 'all', label: 'Horário' },
                        { value: 'yes', label: '24 Horas' },
                        { value: 'no', label: 'Horário Normal' },
                    ]}
                    icon={Clock}
                    placeholder="Funcionamento"
                    width="w-full sm:w-[160px]"
                />
                <FilterSelect
                    value={sortBy}
                    onValueChange={setSortBy}
                    options={sortOptions}
                    icon={ArrowUpDown}
                    placeholder="Ordenar por"
                    width="w-full sm:w-[180px]"
                />
            </FilterBar>

            <section className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <LoadingState message="Carregando locais..." />
                    ) : locations.length === 0 ? (
                        <EmptyState
                            icon={MapPin}
                            title="Nenhum local encontrado"
                            description="Tente ajustar seus filtros ou busca para encontrar o que precisa"
                            onClearFilters={handleClearFilters}
                        />
                    ) : (
                        <>
                            <div className="mb-6">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {locations.length} locais
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {locations.map((location) => (
                                    <LocationCard
                                        key={location.id}
                                        location={location}
                                        typeLabels={typeLabels}
                                    />
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

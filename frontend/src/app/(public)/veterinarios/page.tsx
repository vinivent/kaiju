"use client"

import { useState, useEffect } from 'react';
import { Stethoscope, Filter, ArrowUpDown, Video } from 'lucide-react';
import { Veterinarian } from '@/features/veterinarians/models';
import { veterinarianService } from '@/features/veterinarians/services';
import { ReptileSpecialty, VetStatus } from '@/app/types/common';
import { PageHeader } from '@/components/listings/PageHeader';
import { FilterBar, FilterSelect, FilterInput } from '@/components/listings/FilterBar';
import { VeterinarianCard } from '@/components/listings/VeterinarianCard';
import { LoadingState } from '@/components/listings/LoadingState';
import { EmptyState } from '@/components/listings/EmptyState';
import { Pagination } from '@/components/listings/Pagination';

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

    const specialtyLabels: Record<ReptileSpecialty | 'ALL', string> = {
        ALL: 'Todas Especialidades',
        [ReptileSpecialty.SNAKES]: 'Serpentes',
        [ReptileSpecialty.LIZARDS]: 'Lagartos',
        [ReptileSpecialty.TURTLES]: 'Tartarugas',
        [ReptileSpecialty.CROCODILIANS]: 'Crocodilianos',
        [ReptileSpecialty.AMPHIBIANS]: 'Anfíbios',
        [ReptileSpecialty.GENERAL]: 'Geral',
    };

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

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedSpecialty('ALL');
        setSelectedCity('');
        setSelectedState('');
        setOnlineConsultation(undefined);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <PageHeader
                icon={Stethoscope}
                badge="Profissionais Especializados"
                title="Veterinários Especializados"
                description="Encontre os melhores profissionais para cuidar do seu réptil"
            />

            <FilterBar
                searchPlaceholder="Buscar veterinários..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onClearFilters={handleClearFilters}
                hasActiveFilters={
                    searchQuery !== '' ||
                    selectedSpecialty !== 'ALL' ||
                    selectedCity !== '' ||
                    selectedState !== '' ||
                    onlineConsultation !== undefined
                }
            >
                <FilterSelect
                    value={selectedSpecialty}
                    onValueChange={(value) => setSelectedSpecialty(value as ReptileSpecialty | 'ALL')}
                    options={specialties}
                    icon={Filter}
                    placeholder="Especialidade"
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
                    value={onlineConsultation === undefined ? 'all' : onlineConsultation ? 'yes' : 'no'}
                    onValueChange={(value) => {
                        if (value === 'all') setOnlineConsultation(undefined);
                        else setOnlineConsultation(value === 'yes');
                    }}
                    options={[
                        { value: 'all', label: 'Consultas Online' },
                        { value: 'yes', label: 'Apenas Online' },
                        { value: 'no', label: 'Apenas Presencial' },
                    ]}
                    icon={Video}
                    placeholder="Tipo de consulta"
                    width="w-full sm:w-[180px]"
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
                        <LoadingState message="Carregando veterinários..." />
                    ) : veterinarians.length === 0 ? (
                        <EmptyState
                            icon={Stethoscope}
                            title="Nenhum veterinário encontrado"
                            description="Tente ajustar seus filtros ou busca para encontrar o que precisa"
                            onClearFilters={handleClearFilters}
                        />
                    ) : (
                        <>
                            <div className="mb-6">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {veterinarians.length} veterinários
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {veterinarians.map((vet) => (
                                    <VeterinarianCard
                                        key={vet.id}
                                        veterinarian={vet}
                                        specialtyLabels={specialtyLabels}
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

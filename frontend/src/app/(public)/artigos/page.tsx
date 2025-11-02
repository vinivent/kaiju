"use client"

import { useState, useEffect } from 'react';
import { BookOpen, Filter, ArrowUpDown } from 'lucide-react';
import { Article } from '@/features/articles/model';
import { articleService } from '@/features/articles/services';
import { ArticleCategory, ArticleStatus } from '@/app/types/common';
import { PageHeader } from '@/components/listings/PageHeader';
import { FilterBar, FilterSelect } from '@/components/listings/FilterBar';
import { ArticleCard } from '@/components/listings/ArticleCard';
import { LoadingState } from '@/components/listings/LoadingState';
import { EmptyState } from '@/components/listings/EmptyState';
import { Pagination } from '@/components/listings/Pagination';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<string>('publishedAt');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const categories: { value: ArticleCategory | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'Todas Categorias' },
    { value: ArticleCategory.CARE_GUIDE, label: 'Guias de Cuidados' },
    { value: ArticleCategory.HEALTH, label: 'Saúde' },
    { value: ArticleCategory.NUTRITION, label: 'Nutrição' },
    { value: ArticleCategory.HABITAT_SETUP, label: 'Montagem de Habitat' },
    { value: ArticleCategory.BREEDING, label: 'Reprodução' },
    { value: ArticleCategory.BEHAVIOR, label: 'Comportamento' },
    { value: ArticleCategory.SPECIES_PROFILE, label: 'Perfil de Espécies' },
    { value: ArticleCategory.NEWS, label: 'Notícias' },
  ];

  const sortOptions = [
    { value: 'publishedAt', label: 'Mais Recentes' },
    { value: 'viewCount', label: 'Mais Visualizados' },
    { value: 'likeCount', label: 'Mais Curtidos' },
    { value: 'title', label: 'Título (A-Z)' },
  ];

  const categoryLabels: Record<ArticleCategory | 'ALL', string> = {
    ALL: 'Todas Categorias',
    [ArticleCategory.CARE_GUIDE]: 'Guias de Cuidados',
    [ArticleCategory.HEALTH]: 'Saúde',
    [ArticleCategory.NUTRITION]: 'Nutrição',
    [ArticleCategory.HABITAT_SETUP]: 'Montagem de Habitat',
    [ArticleCategory.BREEDING]: 'Reprodução',
    [ArticleCategory.BEHAVIOR]: 'Comportamento',
    [ArticleCategory.SPECIES_PROFILE]: 'Perfil de Espécies',
    [ArticleCategory.NEWS]: 'Notícias',
  };

  useEffect(() => {
    loadArticles();
  }, [searchQuery, selectedCategory, sortBy, currentPage]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const params = {
        query: searchQuery || undefined,
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        status: ArticleStatus.PUBLISHED,
        page: currentPage,
        size: 12,
        sortBy,
        sortDirection: (sortBy === 'title' ? 'asc' : 'desc') as 'asc' | 'desc',
      };

      const response = await articleService.searchArticles(params);
      setArticles(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
      setArticles([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        icon={BookOpen}
        badge="Conhecimento Especializado"
        title="Artigos e Guias"
        description="Aprenda tudo sobre cuidados, saúde e bem-estar dos répteis"
      />

      <FilterBar
        searchPlaceholder="Buscar artigos..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onClearFilters={handleClearFilters}
        hasActiveFilters={searchQuery !== '' || selectedCategory !== 'ALL'}
      >
        <FilterSelect
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as ArticleCategory | 'ALL')}
          options={categories}
          icon={Filter}
          placeholder="Categoria"
          width="w-full sm:w-[200px]"
        />
        <FilterSelect
          value={sortBy}
          onValueChange={setSortBy}
          options={sortOptions}
          icon={ArrowUpDown}
          placeholder="Ordenar por"
          width="w-full sm:w-[200px]"
        />
      </FilterBar>

      <section className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <LoadingState message="Carregando artigos..." />
          ) : articles.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Nenhum artigo encontrado"
              description="Tente ajustar seus filtros ou busca para encontrar o que precisa"
              onClearFilters={handleClearFilters}
            />
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Mostrando {articles.length} artigos
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    categoryLabels={categoryLabels}
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

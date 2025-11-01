"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  User,
  Filter,
  ArrowUpDown,
  Loader2,
  Calendar,
  Tag,
} from 'lucide-react';
import { Article } from '@/features/articles/model';
import { articleService } from '@/features/articles/services';
import { ArticleCategory, ArticleStatus } from '@/app/types/common';
import Link from 'next/link';

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-background py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge variant="secondary" className="mb-2">
              <BookOpen className="h-3 w-3 mr-2" />
              Conhecimento Especializado
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Artigos e Guias
            </h1>
            <p className="text-lg text-muted-foreground">
              Aprenda tudo sobre cuidados, saúde e bem-estar dos répteis
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
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as ArticleCategory | 'ALL')}
            >
              <SelectTrigger className="w-full md:w-[220px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
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

      {/* Articles Grid */}
      <section className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum artigo encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar seus filtros ou busca
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardHeader className="p-0">
                      <Link href={`/artigos/${article.id}`}>
                        <div className="relative h-48 overflow-hidden bg-muted">
                          {article.imageUrl ? (
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="h-16 w-16 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="text-xs">
                              {categories.find(c => c.value === article.category)?.label || article.category}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    </CardHeader>

                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Link href={`/artigos/${article.id}`}>
                          <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                            {article.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {article.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{article.authorName}</span>
                        </div>
                        {article.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                        )}
                      </div>

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs gap-1">
                              <Tag className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{article.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.viewCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{article.likeCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{article.commentCount}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
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

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Eye, Heart, MessageCircle, User, Calendar, Tag, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Article } from '@/features/articles/model';
import { ArticleCategory } from '@/app/types/common';

interface ArticleCardProps {
    article: Article;
    categoryLabels: Record<ArticleCategory | 'ALL', string>;
}

export function ArticleCard({ article, categoryLabels }: ArticleCardProps) {
    const categoryLabel = categoryLabels[article.category] || article.category;
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-border/50 hover:border-primary/20 flex flex-col">
            <CardHeader className="p-0">
                <Link href={`/artigos/${article.id}`}>
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-muted to-muted/50 cursor-pointer">
                        {article.imageUrl ? (
                            <>
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="h-20 w-20 text-muted-foreground opacity-50" />
                            </div>
                        )}
                        <div className="absolute top-4 left-4 z-10">
                            <Badge variant="secondary" className="backdrop-blur-sm bg-background/80 text-xs">
                                {categoryLabel}
                            </Badge>
                        </div>
                    </div>
                </Link>
            </CardHeader>

            <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex-1">
                    <Link href={`/artigos/${article.id}`}>
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer leading-tight">
                            {article.title}
                        </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {article.summary}
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span className="font-medium">{article.authorName}</span>
                        </div>
                        {article.publishedAt && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{formatDate(article.publishedAt)}</span>
                            </div>
                        )}
                    </div>

                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {article.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs gap-1.5 px-2 py-0.5">
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                </Badge>
                            ))}
                            {article.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                    +{article.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-6 pt-3 border-t text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            <span className="font-medium">{article.viewCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Heart className="h-4 w-4" />
                            <span className="font-medium">{article.likeCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MessageCircle className="h-4 w-4" />
                            <span className="font-medium">{article.commentCount}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


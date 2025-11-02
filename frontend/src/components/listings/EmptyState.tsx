import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onClearFilters?: () => void;
    clearFiltersLabel?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    onClearFilters,
    clearFiltersLabel = "Limpar Filtros"
}: EmptyStateProps) {
    return (
        <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Icon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6">{description}</p>
            {onClearFilters && (
                <Button variant="outline" className='cursor-pointer hover:bg-accent hover:text-accent-foreground' onClick={onClearFilters}>
                    {clearFiltersLabel}
                </Button>
            )}
        </div>
    );
}


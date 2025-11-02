import { Button } from '@/components/ui/button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-3 mt-16">
            <Button
                variant="outline"
                onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="h-10"
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
                            onClick={() => onPageChange(page)}
                            className="h-10 w-10"
                        >
                            {page + 1}
                        </Button>
                    );
                })}
            </div>
            <Button
                variant="outline"
                onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="h-10"
            >
                Próximo
            </Button>
        </div>
    );
}


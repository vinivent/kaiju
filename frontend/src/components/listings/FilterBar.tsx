import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
    searchPlaceholder?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    children?: ReactNode;
    onClearFilters?: () => void;
    hasActiveFilters?: boolean;
}

export function FilterBar({
    searchPlaceholder = "Buscar...",
    searchValue,
    onSearchChange,
    children,
    onClearFilters,
    hasActiveFilters = false
}: FilterBarProps) {
    return (
        <div className="sticky top-16 z-40 bg-background border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-5 space-y-4">
                    {/* Search Bar */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-10 w-full"
                        />
                        {searchValue && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                            >
                                <X className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                        )}
                    </div>

                    {/* Filters Row */}
                    {children && (
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="flex flex-wrap gap-3 flex-1 w-full">
                                {children}
                            </div>
                            {hasActiveFilters && onClearFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClearFilters}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5 mr-1.5" />
                                    Limpar
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface FilterSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    icon?: LucideIcon;
    width?: string;
}

export function FilterSelect({
    value,
    onValueChange,
    options,
    placeholder = "Selecione...",
    icon: Icon,
    width = "w-full sm:w-[180px]"
}: FilterSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={width}>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {Icon && (
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <SelectValue placeholder={placeholder} />
                </div>
            </SelectTrigger>
            <SelectContent>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

interface FilterInputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    width?: string;
    maxLength?: number;
    icon?: LucideIcon;
}

export function FilterInput({
    placeholder,
    value,
    onChange,
    width = "w-full sm:w-[150px]",
    maxLength,
    icon: Icon
}: FilterInputProps) {
    return (
        <div className={cn("relative", width)}>
            {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            )}
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={Icon && "pl-10"}
                maxLength={maxLength}
            />
        </div>
    );
}

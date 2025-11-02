import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
    searchPlaceholder?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    children?: ReactNode;
}

export function FilterBar({
    searchPlaceholder = "Buscar...",
    searchValue,
    onSearchChange,
    children
}: FilterBarProps) {
    return (
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row gap-3 items-stretch">
                    <div className="flex-1 w-full relative min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 h-[40px] text-sm"
                        />
                    </div>
                    {children && (
                        <div className="flex flex-wrap gap-3">
                            {children}
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
    width = "w-full md:w-[200px]"
}: FilterSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger
                className={cn(
                    width,
                    "h-[40px] text-sm px-3"
                )}
            >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
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
}

export function FilterInput({
    placeholder,
    value,
    onChange,
    width = "w-full md:w-[150px]",
    maxLength
}: FilterInputProps) {
    return (
        <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(width, "h-[40px] text-sm")}
            maxLength={maxLength}
        />
    );
}

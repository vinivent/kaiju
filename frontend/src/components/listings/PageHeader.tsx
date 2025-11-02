import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    icon: LucideIcon;
    badge: string;
    title: string;
    description: string;
}

export function PageHeader({ icon: Icon, badge, title, description }: PageHeaderProps) {
    return (
        <div className="border-b bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                        {badge}
                    </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}


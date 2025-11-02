import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
}

export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
    return (
        <div className="flex justify-center items-center min-h-[500px]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}


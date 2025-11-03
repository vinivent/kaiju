import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface ProfileDangerZoneProps {
    onDelete: () => Promise<void>;
    isDeleting: boolean;
}

export function ProfileDangerZone({ onDelete, isDeleting }: ProfileDangerZoneProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        await onDelete();
        setDeleteDialogOpen(false);
    };

    return (
        <Card className="mt-6 border-destructive/50 shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 flex-1">
                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold mb-1 text-destructive">Zona de Perigo</h3>
                            <p className="text-sm text-muted-foreground">
                                Ações irreversíveis relacionadas à sua conta
                            </p>
                        </div>
                    </div>

                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                disabled={isDeleting}
                                className="flex-shrink-0 cursor-pointer"
                            >
                                Excluir Conta
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Você tem certeza absoluta?</DialogTitle>
                                <DialogDescription>
                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                                    e removerá todos os seus dados dos nossos servidores.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 rounded-lg bg-muted/50 p-4">
                                <p className="text-sm font-medium mb-3">Isso incluirá:</p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-destructive mt-0.5">•</span>
                                        <span>Seu perfil e informações pessoais</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-destructive mt-0.5">•</span>
                                        <span>Seus produtos (se você for vendedor)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-destructive mt-0.5">•</span>
                                        <span>Seus artigos (se você for autor)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-destructive mt-0.5">•</span>
                                        <span>Suas conversas e mensagens</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-destructive mt-0.5">•</span>
                                        <span>Suas avaliações e comentários</span>
                                    </li>
                                </ul>
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteDialogOpen(false)}
                                    disabled={isDeleting}
                                    className="cursor-pointer"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="cursor-pointer"
                                >
                                    {isDeleting ? 'Excluindo...' : 'Sim, excluir minha conta'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}

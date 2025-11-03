import { useState } from 'react';
import { UserUpdateRequest } from '@/features/user/model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfileEditFormProps {
    initialData: UserUpdateRequest;
    onSubmit: (data: UserUpdateRequest, password: string) => Promise<void>;
    onCancel: () => void;
    isUpdating: boolean;
}

export function ProfileEditForm({
    initialData,
    onSubmit,
    onCancel,
    isUpdating
}: ProfileEditFormProps) {
    const [formData, setFormData] = useState<UserUpdateRequest>(initialData);
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData, password);
    };

    return (
        <div className="px-6 py-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Editar Perfil</h2>
                <p className="text-sm text-muted-foreground">
                    Atualize suas informações pessoais e de perfil
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-foreground">
                            Nome <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            required
                            className="transition-all"
                            placeholder="Seu nome completo"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-foreground">
                            Usuário <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="username"
                            type="text"
                            value={formData.username || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            required
                            className="transition-all"
                            placeholder="@seuusuario"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="avatar" className="block text-sm font-medium text-foreground">
                            Avatar URL
                        </label>
                        <Input
                            id="avatar"
                            type="url"
                            value={formData.avatar || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, avatar: e.target.value })
                            }
                            placeholder="https://exemplo.com/avatar.jpg"
                            className="transition-all"
                        />
                        <p className="text-xs text-muted-foreground">
                            Link para a imagem do seu avatar
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="header" className="block text-sm font-medium text-foreground">
                            Banner de Perfil URL
                        </label>
                        <Input
                            id="header"
                            type="url"
                            value={formData.header || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, header: e.target.value })
                            }
                            placeholder="https://exemplo.com/banner.jpg"
                            className="transition-all"
                        />
                        <p className="text-xs text-muted-foreground">
                            Link para a imagem do banner do perfil
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-foreground">
                        Descrição/Bio
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        value={formData.description || ''}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full rounded-md border border-input bg-input/30 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                        placeholder="Conte um pouco sobre você..."
                    />
                    <p className="text-xs text-muted-foreground">
                        Esta descrição será exibida no seu perfil público
                    </p>
                </div>

                <div className="border-t pt-6 space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-foreground">
                        Nova Senha
                    </label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="transition-all max-w-md"
                    />
                    <p className="text-xs text-muted-foreground">
                        Deixe em branco para manter a senha atual
                    </p>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isUpdating}
                        className="cursor-pointer min-w-[100px]"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className="cursor-pointer min-w-[140px]"
                    >
                        {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

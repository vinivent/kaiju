import { UserResponse } from '@/features/user/model';
import { UserSituation, UserRole } from '@/app/types/common';
import { Badge } from '@/components/ui/badge';
import { ProfileAvatar } from './ProfileAvatar';

interface ProfileInfoProps {
    user: UserResponse;
}

const getSituationBadgeVariant = (situation: UserSituation) => {
    switch (situation) {
        case UserSituation.VERIFIED:
            return 'default';
        case UserSituation.PENDING:
            return 'secondary';
        case UserSituation.BLOCKED:
            return 'destructive';
        case UserSituation.INACTIVE:
            return 'outline';
        default:
            return 'secondary';
    }
};

const getSituationLabel = (situation: UserSituation) => {
    switch (situation) {
        case UserSituation.VERIFIED:
            return 'Verificado';
        case UserSituation.PENDING:
            return 'Pendente';
        case UserSituation.BLOCKED:
            return 'Bloqueado';
        case UserSituation.INACTIVE:
            return 'Inativo';
        default:
            return situation;
    }
};

const getRoleBadgeVariant = (role: UserRole | string) => {
    const roleStr = String(role).toUpperCase();

    if (roleStr === 'ADMIN') return 'destructive';
    if (roleStr === 'VETERINARIAN') return 'default';
    if (roleStr === 'SELLER') return 'secondary';
    if (roleStr === 'AUTHOR') return 'outline';
    if (roleStr === 'USER') return 'secondary';

    return 'secondary';
};

const getRoleLabel = (role: UserRole | string | undefined | null) => {
    if (!role) return 'Membro';

    // Converter para string e normalizar
    let roleStr = String(role).toUpperCase().trim();

    // Remover espaços extras e caracteres especiais
    roleStr = roleStr.replace(/\s+/g, '');

    // Mapeamento de roles
    const roleMap: Record<string, string> = {
        'USER': 'Membro',
        'VETERINARIAN': 'Veterinário',
        'VETERINARIO': 'Veterinário', // Caso tenha acento
        'SELLER': 'Vendedor',
        'VENDE': 'Vendedor', // Caso seja abreviação
        'AUTHOR': 'Autor',
        'AUTOR': 'Autor', // Caso tenha tradução
        'ADMIN': 'Administrador',
        'ADMINISTRATOR': 'Administrador'
    };

    return roleMap[roleStr] || roleStr || 'Membro';
};

export function ProfileInfo({ user }: ProfileInfoProps) {
    // Garantir que role existe, caso contrário usar 'USER' como padrão
    const userRole = user.role || 'USER';

    return (
        <div className="px-6 pt-6 pb-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <ProfileAvatar name={user.name} avatar={user.avatar || ""} />

                <div className="flex-1 space-y-3">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{user.name}</h1>
                        <p className="text-muted-foreground text-lg mt-1">@{user.username}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant={getRoleBadgeVariant(userRole)} className="shadow-sm">
                            {getRoleLabel(userRole)}
                        </Badge>
                        <Badge variant={getSituationBadgeVariant(user.situation)} className="shadow-sm">
                            {getSituationLabel(user.situation)}
                        </Badge>
                    </div>
                </div>
            </div>

            {user.description && (
                <div className="mt-6 pt-6 border-t">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                        {user.description}
                    </p>
                </div>
            )}
        </div>
    );
}

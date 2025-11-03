import { UserResponse } from '@/features/user/model';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
    user: UserResponse;
    isOwner: boolean;
    isEditing: boolean;
    onEdit: () => void;
}

export function ProfileHeader({ user, isOwner, isEditing, onEdit }: ProfileHeaderProps) {
    return (
        <div className="w-full relative">
            {user.header ? (
                <div className="w-full h-64 md:h-80 overflow-hidden">
                    <img
                        src={user.header}
                        alt={`Banner de ${user.name}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-full h-64 md:h-80 bg-gradient-to-br from-muted via-muted/80 to-muted/60" />
            )}

            {isOwner && !isEditing && (
                <div className="absolute top-4 right-4">
                    <Button
                        onClick={onEdit}
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer shadow-lg"
                    >
                        Editar Perfil
                    </Button>
                </div>
            )}
        </div>
    );
}

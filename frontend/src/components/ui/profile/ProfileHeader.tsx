import { UserResponse } from '@/features/user/model';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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
                <div className="w-full h-64 md:h-80 relative overflow-hidden">
                    <Image
                        src={user.header}
                        alt={`Banner de ${user.name}`}
                        fill
                        className="object-cover"
                        sizes="100vw"
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

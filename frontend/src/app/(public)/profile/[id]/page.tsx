'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { userService } from '@/features/user/service';
import { UserResponse, UserUpdateRequest } from '@/features/user/model';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ProfileHeader } from '@/components/ui/profile/ProfileHeader';
import { ProfileInfo } from '@/components/ui/profile/ProfileInfo';
import { ProfileDetails } from '@/components/ui/profile/ProfileDetails';
import { ProfileEditForm } from '@/components/ui/profile/ProfileEditForm';
import { ProfileDangerZone } from '@/components/ui/profile/ProfileDangerZone';
import Loader from '@/components/ui/Loader';

export default function ProfilePage() {
    const params = useParams();
    const userId = params.id as string;
    const { user: currentUser, refreshUser } = useUser();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userService.getUserById(userId);
                setUser(userData);
            } catch (error: any) {
                toast.error('Erro ao carregar perfil: ' + (error.message || 'Erro desconhecido'));
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleSubmit = async (data: UserUpdateRequest, password: string) => {
        if (!user) return;

        setUpdating(true);
        try {
            const updateData: UserUpdateRequest = {
                ...data,
            };

            if (password.trim()) {
                updateData.password = password;
            }

            await userService.updateUser(user.id, updateData);
            toast.success('Perfil atualizado com sucesso!');
            setEditing(false);

            // Refresh user data
            const updatedUser = await userService.getUserById(user.id);
            setUser(updatedUser);
            await refreshUser();
        } catch (error: any) {
            toast.error('Erro ao atualizar perfil: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!user) return;

        setDeleting(true);
        try {
            await userService.deleteUser(user.id);
            toast.success('Conta excluída com sucesso');
            // Redirect to login after deletion
            window.location.href = '/login';
        } catch (error: any) {
            toast.error('Erro ao excluir conta: ' + (error.message || 'Erro desconhecido'));
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Loader/>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-destructive">Perfil não encontrado</div>
            </div>
        );
    }

    const isOwner = Boolean(currentUser && user && currentUser.id === user.id);

    return (
        <div className="min-h-screen bg-background">
            <ProfileHeader
                user={user}
                isOwner={isOwner}
                isEditing={editing}
                onEdit={handleEdit}
            />

            <div className="container mx-auto px-4 pb-8 max-w-4xl -mt-20 relative">
                <Card className="overflow-hidden shadow-xl">
                    <CardContent className="p-0">
                        {!editing ? (
                            <>
                                <ProfileInfo user={user} />
                                <ProfileDetails user={user} />
                            </>
                        ) : (
                            <ProfileEditForm
                                initialData={{
                                    username: user.username,
                                    name: user.name,
                                    description: user.description || '',
                                    avatar: user.avatar || '',
                                    header: user.header || '',
                                }}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isUpdating={updating}
                            />
                        )}
                    </CardContent>
                </Card>

                {isOwner && !editing && (
                    <ProfileDangerZone
                        onDelete={handleDelete}
                        isDeleting={deleting}
                    />
                )}
            </div>
        </div>
    );
}
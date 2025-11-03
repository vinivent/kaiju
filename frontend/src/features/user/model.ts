import { UserSituation, UserRole } from '@/app/types/common';

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    name: string;
    role: UserRole;
    situation: UserSituation;
    avatar: string | null;
    header: string | null;
    description: string | null;
    createdAt: string;
}

export interface UserUpdateRequest {
    username?: string;
    name?: string;
    description?: string;
    avatar?: string;
    header?: string;
    password?: string;
}


import api from '@/lib/http/api';
import { UserResponse, UserUpdateRequest } from './model';

const BASE_PATH = '/user';

export const userService = {
    /**
     * Get current authenticated user
     */
    async getCurrentUser(): Promise<UserResponse> {
        const response = await api.get<UserResponse>(`${BASE_PATH}/me`);
        return response.data;
    },

    /**
     * Get user by ID (public profile)
     */
    async getUserById(id: string): Promise<UserResponse> {
        const response = await api.get<UserResponse>(`${BASE_PATH}/${id}`);
        return response.data;
    },

    /**
     * Update user information
     */
    async updateUser(id: string, data: UserUpdateRequest): Promise<string> {
        const response = await api.put<string>(`${BASE_PATH}/${id}`, data);
        return response.data;
    },

    /**
     * Delete user account
     */
    async deleteUser(id: string): Promise<string> {
        const response = await api.delete<string>(`${BASE_PATH}/${id}`);
        return response.data;
    },

    /**
     * Become a veterinarian (change role to VETERINARIAN)
     */
    async becomeVeterinarian(): Promise<string> {
        const response = await api.post<string>(`${BASE_PATH}/become-veterinarian`);
        return response.data;
    },

    /**
     * Become a seller (change role to SELLER)
     */
    async becomeSeller(): Promise<string> {
        const response = await api.post<string>(`${BASE_PATH}/become-seller`);
        return response.data;
    },
};


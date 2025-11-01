import api from "@/lib/http/api";
import { ApiResponse, User } from "@/app/types/common";
import { RegisterRequest, LoginRequest, ResetPasswordRequest } from "./model";

export const authService = {
  async register(request: RegisterRequest): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/register", request);
      return { data: response.data };
    } catch (error: any) {
      throw new Error("Erro ao fazer cadastro: " + error.response?.data || error.message);
    }
  },

  async login(request: LoginRequest): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/login", request);
      return { data: response.data };
    } catch (error: any) {
      throw new Error("Erro ao fazer login: " + error.response?.data || error.message);
    }
  },

  async logout(): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/logout");
      return { data: response.data };
    } catch (error: any) {
      throw new Error("Erro ao fazer logout: " + error.response?.data || error.message);
    }
  },

  async resendVerificationEmail(email: string): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/resend-verification", { email });
      return { data: response.data };
    } catch (error: any) {
      throw new Error("Erro ao reenviar email de verificação: " + error.response?.data || error.message);
    }
  },

  async forgotPassword(email: string): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return { data: response.data };
    } catch (error: any) {
      throw new Error("Erro ao enviar email de recuperação de senha: " + error.response?.data || error.message)
    }
  },

  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/reset-password", request);
      return { data: response.data };
    } catch (error: any) {
      throw new Error("Erro ao redefinir senha: " + error.response?.data || error.message)
    }
  },

  async verify(token: string): Promise<ApiResponse<string>> {
    try {
      const response = await api.get(`/auth/verify/${token}`);
      return { data: response.data };
    } catch (error: any) {
      throw new Error("Erro ao verificar usuário: " + error.response?.data || error.message)
    }
  },

  async validateResetPassword(token: string): Promise<ApiResponse<string>> {
    try {
      const response = await api.get(`/auth/reset-password/validate`, { params: { token } });
      return { data: response.data };
    } catch (error: any) {
      throw new Error("Erro ao validar token : " + error.response?.data || error.message)
    }
  },

  async getUser(): Promise<User> {
    try {
      const response = await api.get(`/user/me`);
      return response.data;
    } catch (error: any) {
      throw new Error("Erro ao buscar usuário atual: " + error.response?.data || error.message)
    }
  }
};

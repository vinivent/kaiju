import api from "@/lib/http/api";
import { ApiResponse } from "@/app/types/common";
import { RegisterRequest, LoginRequest, ResetPasswordRequest } from "./model";
import { AxiosError } from "axios";

// Helper function to extract error message from axios errors
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError) {
    return error.response?.data || error.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

const TOKEN_COOKIE_NAME = "token";
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

const isSecure = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

export const setAuthCookie = (token: string) => {
  if (typeof document !== "undefined") {
    const secureFlag = isSecure() ? "; Secure; SameSite=None" : "";
    document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=${TOKEN_MAX_AGE}${secureFlag}`;
  }
};

export const clearAuthCookie = () => {
  if (typeof document !== "undefined") {
    const secureFlag = isSecure() ? "; Secure; SameSite=None" : "";
    document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0${secureFlag}`;
  }
};

export const authService = {
  async register(request: RegisterRequest): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/register", request);
      return { data: response.data };
    } catch (error: unknown) {
      throw new Error(
        "Erro ao fazer cadastro: " + getErrorMessage(error, "Erro desconhecido")
      );
    }
  },

  async login(
    request: LoginRequest
  ): Promise<ApiResponse<{ token: string; message: string }>> {
    try {
      const response = await api.post<{ token: string; message: string }>(
        "/auth/login",
        request
      );
      if (response.data?.token) {
        setAuthCookie(response.data.token);
      }
      return { data: response.data };
    } catch (error: unknown) {
      throw new Error(
        "Erro ao fazer login: " + getErrorMessage(error, "Erro desconhecido")
      );
    }
  },

  async logout(): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/logout");
      clearAuthCookie();
      return { data: response.data };
    } catch (error: unknown) {
      clearAuthCookie();
      throw new Error(
        "Erro ao fazer logout: " + getErrorMessage(error, "Erro desconhecido")
      );
    }
  },

  async resendVerificationEmail(email: string): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/resend-verification", { email });
      return { data: response.data };
    } catch (error: unknown) {
      throw new Error(
        "Erro ao reenviar email de verificação: " +
          getErrorMessage(error, "Erro desconhecido")
      );
    }
  },

  async forgotPassword(email: string): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return { data: response.data };
    } catch (error: unknown) {
      throw new Error(
        "Erro ao enviar email de recuperação de senha: " +
          getErrorMessage(error, "Erro desconhecido")
      );
    }
  },

  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ApiResponse<string>> {
    try {
      const response = await api.post("/auth/reset-password", request);
      return { data: response.data };
    } catch (error: unknown) {
      throw new Error(
        "Erro ao redefinir senha: " +
          getErrorMessage(error, "Erro desconhecido")
      );
    }
  },

  async verify(token: string): Promise<ApiResponse<string>> {
    try {
      const response = await api.get(`/auth/verify/${token}`);
      return { data: response.data };
    } catch (error: unknown) {
      throw new Error(
        "Erro ao verificar usuário: " +
          getErrorMessage(error, "Erro desconhecido")
      );
    }
  },

  async validateResetPassword(token: string): Promise<ApiResponse<string>> {
    try {
      const response = await api.get(`/auth/reset-password/validate`, {
        params: { token },
      });
      return { data: response.data };
    } catch (error: unknown) {
      throw new Error(
        "Erro ao validar token : " + getErrorMessage(error, "Erro desconhecido")
      );
    }
  },
};

export interface RegisterRequest {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

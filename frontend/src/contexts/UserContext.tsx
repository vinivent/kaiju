"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { userService } from "@/features/user/service";
import { UserResponse } from "@/features/user/model";
import { clearAuthCookie } from "@/features/auth/service";

interface UserContextType {
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await userService.getCurrentUser();
      console.log("[UserContext] User loaded:", userData);
      setUser(userData);
    } catch (err: unknown) {
      console.error("[UserContext] Error fetching user:", err);
      const message =
        err instanceof Error ? err.message : "Erro ao carregar usuário";
      setError(message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
    clearAuthCookie();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, error, refreshUser: fetchUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

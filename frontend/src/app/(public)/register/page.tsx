"use client";

import { authService } from "@/features/auth/service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React from "react";

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary  focus-within:bg-primary-foreground/30">
    {children}
  </div>
);

const Register = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const heroImageSrc =
    "https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80";
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setIsLoading(false);
      toast.error("As senhas devem coincidir.");
      return;
    }

    if (!name || !email || !username || !password || !confirmPassword) {
      toast.error("Preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    try {
      const message = authService.register({ name, username, password, email });
      toast.success((await message).data);
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Erro ao fazer cadastro";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]">
      {/* Coluna esquerda: formulário */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
              <span className="font-light text-foreground tracking-tighter">
                Crie sua conta
              </span>
            </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">
              Comece sua jornada com a gente em poucos passos.
            </p>

            <form className="space-y-5" onSubmit={handleRegister}>
              {/* Username */}
              <div className="animate-element animate-delay-250">
                <label className="text-sm font-medium text-muted-foreground">
                  Nome de usuário
                </label>
                <GlassInputWrapper>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="Seu Nome de Usuário"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    required
                  />
                </GlassInputWrapper>
              </div>

              {/* Name */}
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-muted-foreground">
                  Nome
                </label>
                <GlassInputWrapper>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Seu Nome"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    required
                  />
                </GlassInputWrapper>
              </div>

              {/* Email */}
              <div className="animate-element animate-delay-350">
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <GlassInputWrapper>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              {/* Password */}
              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-muted-foreground">
                  Senha
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha"
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-3 flex items-center"
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              {/* Confirm Password */}
              <div className="animate-element animate-delay-450">
                <label className="text-sm font-medium text-muted-foreground">
                  Confirmar senha
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repita a senha"
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute inset-y-0 right-3 flex items-center"
                      aria-label={
                        showConfirm
                          ? "Ocultar confirmação"
                          : "Mostrar confirmação"
                      }
                    >
                      {showConfirm ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="animate-element cursor-pointer animate-delay-550 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors min-h-[56px] flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="animate-spin" />
                    Cadastrando...
                  </span>
                ) : (
                  "Cadastrar"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="animate-element animate-delay-800 text-center text-sm text-muted-foreground">
              Já possui uma conta?{" "}
              <Link
                href="/signin"
                className="text-primary hover:underline transition-colors"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </section>

      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          />
        </section>
      )}
    </div>
  );
};

export default Register;

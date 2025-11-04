"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { authService } from "@/features/auth/service";
import { useRouter } from "next/navigation";

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary focus-within:bg-primary-foreground/30">
    {children}
  </div>
);

// --- PAGE ---

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const title = (
    <span className="font-light text-foreground tracking-tighter">
      Bem-vindo
    </span>
  );
  const description = "Acesse sua conta e continue sua jornada com a gente";
  const heroImageSrc =
    "https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ username: username, password });
      toast.success(response.data?.message || 'Login realizado com sucesso');
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push("/home");
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro ao fazer login';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  function onResetPassword() {
    console.log("Reset password clicado");
    // abra modal/navegue para /forgot-password
  }

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]">
      {/* Coluna esquerda: formulário */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
              {title}
            </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">
              {description}
            </p>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <GlassInputWrapper>
                  <input
                    name="username"
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu email"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    required
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-muted-foreground">
                  Senha
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="custom-checkbox"
                  />
                  <span className="text-foreground/90">Manter conectado</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onResetPassword();
                  }}
                  className="hover:underline text-primary transition-colors"
                >
                  Esqueci a senha
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="animate-element cursor-pointer animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-[#fff8e1] hover:bg-primary/90 transition-colors min-h-[56px] flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="animate-spin h-5 w-5" />
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
              Novo por aqui?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline transition-colors"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Coluna direita: apenas imagem (sem testimonials) */}
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

export default Login;

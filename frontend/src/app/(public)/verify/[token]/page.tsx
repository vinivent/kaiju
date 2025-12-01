"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authService } from "@/features/auth/service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function VerifyAccountPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (token) {
      verifyAccount();
    } else {
      setStatus("error");
      setMessage("Token de verificação inválido.");
    }
  }, [token]);

  const verifyAccount = async () => {
    try {
      const response = await authService.verify(token);
      setStatus("success");
      setMessage(response.data || "Conta verificada com sucesso!");
      toast.success("Conta verificada com sucesso!");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: unknown) {
      setStatus("error");
      let errorMessage = "Erro ao verificar conta. Tente novamente.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check for specific error messages
        if (error.message.includes("inválido") || error.message.includes("expirado")) {
          errorMessage = "O link de verificação expirou ou é inválido. Solicite um novo link.";
        }
      }
      
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {status === "loading" && (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-8 w-8 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verificando conta..."}
            {status === "success" && "Conta verificada!"}
            {status === "error" && "Erro na verificação"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">{message}</p>

          {status === "success" && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200 text-center">
                  Sua conta foi verificada com sucesso! Você será redirecionado para a página de login em alguns segundos.
                </p>
              </div>
              <Button
                onClick={() => router.push("/login")}
                className="w-full"
                size="lg"
              >
                Ir para Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive text-center">
                  {message.includes("expirado") || message.includes("inválido")
                    ? "O link de verificação expirou ou é inválido. Solicite um novo link."
                    : message}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="w-full"
                >
                  Ir para Login
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  className="w-full"
                >
                  Criar Nova Conta
                </Button>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Aguarde enquanto verificamos sua conta...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { CardFooter } from "@/components/ui/card";
import { toast } from "react-toastify";
import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/request-password-reset", {
        email: data.email,
      });

      if (response.status === 200) {
        setIsEmailSent(true);
        toast.success("Email di reset password inviata con successo!");
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      if (error.response?.status === 400) {
        toast.error("Email non valida. Controlla i dati inseriti.");
      } else if (error.response?.status === 403) {
        toast.error("Account sospeso. Contatta l'amministratore.");
      } else {
        toast.error("Si è verificato un errore. Riprova più tardi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-xl">
                <Mail className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl">Email Inviata</CardTitle>
            <CardDescription>Controlla la tua casella di posta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>Ti abbiamo inviato un'email con le istruzioni per reimpostare la tua password.</p>
                <p className="mt-2">Controlla anche la cartella spam se non trovi l'email.</p>
              </div>
              
              <Button asChild className="w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Torna al Login
                </Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Non hai ricevuto l'email?{" "}
              <button 
                onClick={() => setIsEmailSent(false)}
                className="text-blue-600 hover:underline"
              >
                Riprova
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl">
              T
            </div>
          </div>
          <CardTitle className="text-2xl">Password Dimenticata</CardTitle>
          <CardDescription>Inserisci la tua email per reimpostare la password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Inserisci la tua email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Invia Email di Reset
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Ricordi la tua password?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Accedi
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

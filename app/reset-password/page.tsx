"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/schemas/auth";
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
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { CardFooter } from "@/components/ui/card";
import { toast } from "react-toastify";
import api from "@/lib/axios";

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("Token di reset password non valido");
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword: data.newPassword,
      });

      if (response.data.status === "success") {
        toast.success("Password reimpostata con successo!");
        router.push("/login");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Si è verificato un errore durante il reset della password";
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <span className="text-2xl font-bold text-slate-800 mr-2">
              <span className="text-[#2150C2]">Follower</span>
              <span className="text-[#CD41B4]">Gratis</span>
            </span>
          </div>
          <CardTitle className="text-2xl">Reimposta Password</CardTitle>
          <CardDescription>Inserisci la tua nuova password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nuova Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Inserisci la nuova password"
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                  aria-label={
                    showNewPassword ? "Nascondi password" : "Mostra password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Conferma la nuova password"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                  aria-label={
                    showConfirmPassword
                      ? "Nascondi password"
                      : "Mostra password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reimposta Password
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

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <span className="text-2xl font-bold text-slate-800 mr-2">
              <span className="text-[#2150C2]">Follower</span>
              <span className="text-[#CD41B4]">Gratis</span>
            </span>
          </div>
          <CardTitle className="text-2xl">Reimposta Password</CardTitle>
          <CardDescription>Caricamento...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

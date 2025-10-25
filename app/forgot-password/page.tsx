"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
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
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { CardFooter } from "@/components/ui/card";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { useTranslation } from "@/lib/translations";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { t } = useTranslation('auth');

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
        toast.success(t('successMessage'));
      }
    } catch (error: any) {
      console.error("Password reset error:", error);

      if (error.response?.status === 400) {
        toast.error(t('forgotPassword.invalidEmailError'));
      } else if (error.response?.status === 403) {
        toast.error(t('forgotPassword.accountSuspendedError'));
      } else {
        toast.error(t('forgotPassword.generalError'));
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
            <CardTitle className="text-2xl">{t('forgotPassword.emailSentTitle')}</CardTitle>
            <CardDescription>{t('forgotPassword.emailSentDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  {t('forgotPassword.emailSentMessage')}
                </p>
                <p className="mt-2">
                  {t('forgotPassword.emailSentSpamMessage')}
                </p>
              </div>

              <Button asChild className="w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('forgotPassword.backToLogin')}
                </Link>
              </Button>

              <div className="flex justify-center pt-4">
                <p className="text-sm text-muted-foreground">
                  {t('forgotPassword.didNotReceiveEmail')}{" "}
                  <button
                    onClick={() => setIsEmailSent(false)}
                    className="text-blue-600 hover:underline"
                  >
                    {t('forgotPassword.tryAgain')}
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CardTitle className="text-2xl">{t('forgotPassword.title')}</CardTitle>
          <CardDescription>
            {t('forgotPassword.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('forgotPassword.emailPlaceholder')}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('forgotPassword.sendButton')}
            </Button>
            <div className="flex justify-center pt-4">
              <p className="text-sm text-muted-foreground">
                {t('forgotPassword.backToLogin')}{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  {t('login.loginButton')}
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterFormData } from "@/schemas/auth";
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
import { Loader2, Eye, EyeOff, Check, Palette, Globe, Zap } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function AdminRegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const response = await api.post("/auth/admin/register", {
                name: data.name,
                email: data.email,
                password: data.password,
            });

            if (response.data.status === "success") {
                toast.success("Admin account created successfully! Please login to continue.");
                router.push("/auth/admin/login");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left Column - Benefits */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl font-bold">
                                <span className="text-[#2150C2]">Follower</span>
                                <span className="text-[#CD41B4]">Gratis</span>
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Launch Your Own SMM Panel
                        </h1>
                        <p className="text-lg text-slate-300">
                            Create your branded social media marketing panel in minutes. No technical knowledge required.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Custom Domain & Subdomain</h3>
                                <p className="text-sm text-slate-400">
                                    Get your own subdomain (yourname.yoursaas.com) or connect your custom domain
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Palette className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Full Theme Customization</h3>
                                <p className="text-sm text-slate-400">
                                    Customize colors, fonts, logo, and branding to match your identity
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Instant Deployment</h3>
                                <p className="text-sm text-slate-400">
                                    Your panel goes live immediately after payment - no waiting
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Check className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">One-Time Payment</h3>
                                <p className="text-sm text-slate-400">
                                    Just $5 USD - no monthly fees, no hidden costs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Registration Form */}
                <Card className="w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Create Admin Account</CardTitle>
                        <CardDescription>Start your SMM panel journey today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your full name"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        className="pr-10"
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Admin Account
                            </Button>

                            <div className="flex flex-col items-center space-y-2 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Already have an admin account?{" "}
                                    <Link href="/auth/admin/login" className="text-blue-600 hover:underline">
                                        Login here
                                    </Link>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Looking for client registration?{" "}
                                    <Link href="/register" className="text-blue-600 hover:underline">
                                        Client Register
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

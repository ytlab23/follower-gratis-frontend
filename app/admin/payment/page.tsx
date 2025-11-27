"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, Shield, Zap } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/lib/axios";

export default function AdminPaymentPage() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect if already paid
    if (user?.hasPaid) {
        router.push("/admin");
        return null;
    }

    const handleSkip = async () => {
        setIsProcessing(true);
        try {
            await api.post("/admin/payment", { skip: true });
            toast.success("Payment skipped! Welcome to the admin panel.");
            await refreshUser();
            router.push("/admin");
        } catch (error: any) {
            console.error("Skip error:", error);
            toast.error(error.response?.data?.message || "Skip failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-3xl">Complete Your Admin Setup</CardTitle>
                    <CardDescription className="text-lg">
                        One-time payment to unlock all admin features
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Pricing */}
                    <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center text-white">
                        <p className="text-sm uppercase tracking-wide opacity-90">One-Time Fee</p>
                        <p className="mt-2 text-6xl font-bold">$5.00</p>
                        <p className="mt-2 text-sm opacity-90">No recurring charges. Pay once, use forever.</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">What You Get:</h3>
                        <div className="space-y-2">
                            {[
                                { icon: Zap, text: "Full access to all SMM services" },
                                { icon: Shield, text: "Secure admin dashboard" },
                                { icon: CheckCircle, text: "Unlimited service management" },
                                { icon: CheckCircle, text: "Order tracking and analytics" },
                                { icon: CheckCircle, text: "24/7 platform availability" },
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                        <feature.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span>{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Button */}
                    <div className="pt-4">
                        <Button
                            disabled={isProcessing}
                            className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Pay $5.00 Now
                                </>
                            )}
                        </Button>
                        <p className="mt-3 text-center text-sm text-muted-foreground">
                            Secure payment processing. Your data is protected.
                        </p>
                    </div>

                    {/* Skip for testing (remove in production) */}
                    {process.env.NODE_ENV === 'development' && (
                        <Button
                            onClick={handleSkip}
                            variant="ghost"
                            className="w-full"
                        >
                            Skip
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

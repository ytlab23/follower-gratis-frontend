"use client";

import { useState } from "react";
import { X, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export default function AdminPaymentBanner() {
    const { user } = useAuth();
    const [isDismissed, setIsDismissed] = useState(false);

    // Only show banner for admin users who haven't paid
    if (!user || user.role !== "admin" || user.hasPaid || isDismissed) {
        return null;
    }

    const handlePayNow = () => {
        // TODO: Redirect to payment page or open payment modal
        window.location.href = "/admin/payment";
    };

    return (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-sm sm:text-base">
                                Payment Required to Access Services
                            </p>
                            <p className="text-xs sm:text-sm opacity-90">
                                Complete your $5.00 one-time payment to start using all admin features
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handlePayNow}
                            className="bg-white text-orange-600 hover:bg-gray-100 font-semibold whitespace-nowrap"
                            size="sm"
                        >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay Now
                        </Button>
                        <Button
                            onClick={() => setIsDismissed(true)}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

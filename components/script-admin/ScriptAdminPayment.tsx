'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useScriptAdminProfile, useProcessPayment } from '../../hooks/use-script-admin';
import { PaymentData } from '../../types/script-admin';

interface ScriptAdminPaymentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ScriptAdminPayment({ onSuccess, onCancel }: ScriptAdminPaymentProps) {
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: profileResponse } = useScriptAdminProfile();
  const processPaymentMutation = useProcessPayment();

  const profile = profileResponse?.data;
  const isPaid = profile?.scriptAdminProfile?.isPaid || false;
  const isActive = profile?.isActive || false;

  const handlePayment = async () => {
    if (isPaid && isActive) {
      onSuccess?.();
      return;
    }

    try {
      setError('');
      setIsProcessing(true);

      const paymentData: PaymentData = {
        successUrl: `${window.location.origin}/script-admin/payment/success`,
        cancelUrl: `${window.location.origin}/script-admin/payment/cancel`,
        customerEmail: profile?.email,
      };

      const response = await processPaymentMutation.mutateAsync(paymentData);

      if (response.success && response.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        setError(response.message || 'Failed to initiate payment');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!profile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Launch Your Panel
          {isPaid && isActive && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Active
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isPaid && isActive
            ? 'Your panel is already active and ready to use'
            : 'Pay a one-time fee of $5 to launch your script admin panel'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Payment Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Payment Status:</span>
            <Badge variant={isPaid ? "default" : "secondary"} className={
              isPaid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }>
              {isPaid ? 'Paid' : 'Pending'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Panel Status:</span>
            <Badge variant={isActive ? "default" : "secondary"} className={
              isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Pricing Information */}
        {!isPaid && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">$5</div>
              <div className="text-sm text-gray-500">One-time launch fee</div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Full access to script admin panel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Custom branding and themes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Subdomain or custom domain support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Lifetime access with no recurring fees</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isPaid && isActive ? (
            <Button
              onClick={onSuccess}
              className="w-full"
            >
              Continue to Dashboard
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePayment}
                disabled={isProcessing || processPaymentMutation.isPending}
                className="w-full"
              >
                {isProcessing || processPaymentMutation.isPending
                  ? 'Processing...'
                  : `Pay $5 and Launch Panel`
                }
              </Button>

              <Button
                variant="outline"
                onClick={onCancel}
                className="w-full"
              >
                Cancel
              </Button>
            </>
          )}
        </div>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center">
          <p>
            🔒 Secure payment powered by Stripe.
            Your payment information is encrypted and secure.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

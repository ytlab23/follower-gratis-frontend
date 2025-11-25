'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { useAdminProfile, useProcessPayment } from '../../hooks/use-admin';
import { PaymentData } from '../../types/admin';

interface AdminPaymentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AdminPayment({ onSuccess, onCancel }: AdminPaymentProps) {
  const [error, setError] = useState<string>('');
  const [successUrl] = useState(() =>
    typeof window !== 'undefined'
      ? `${window.location.origin}/admin/dashboard?success=true`
      : '/admin/dashboard?success=true'
  );
  const [cancelUrl] = useState(() =>
    typeof window !== 'undefined'
      ? `${window.location.origin}/admin/dashboard?cancelled=true`
      : '/admin/dashboard?cancelled=true'
  );

  const { data: profileResponse } = useAdminProfile();
  const processPaymentMutation = useProcessPayment();

  const profile = profileResponse?.data;
  const isAlreadyPaid = profile?.adminProfile?.isPaid;

  const handlePayment = async () => {
    try {
      setError('');

      if (isAlreadyPaid) {
        setError('Your account is already paid and active');
        return;
      }

      const paymentData: PaymentData = {
        successUrl,
        cancelUrl,
      };

      const response = await processPaymentMutation.mutateAsync(paymentData);

      if (response.success && response.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        setError(response.message || 'Failed to process payment');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to process payment');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Admin Setup</CardTitle>
        <CardDescription>
          Pay $5 to activate your admin panel and start managing your followers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant={isAlreadyPaid ? "default" : "destructive"}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isAlreadyPaid ? (
          <>
            {/* Payment Details */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$5</div>
                <div className="text-sm text-gray-600">One-time activation fee</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Admin Panel Access:</span>
                  <Badge variant="default">✓</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Custom Branding:</span>
                  <Badge variant="default">✓</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Custom Domain Support:</span>
                  <Badge variant="default">✓</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Unlimited Orders:</span>
                  <Badge variant="default">✓</Badge>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={processPaymentMutation.isPending}
              className="w-full"
              size="lg"
            >
              {processPaymentMutation.isPending
                ? 'Processing...'
                : 'Pay $5 to Activate'
              }
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-600">
              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium">Your Account is Active!</h3>
            <p className="text-sm text-gray-600">
              You have successfully paid for your admin panel. Enjoy full access to manage your followers.
            </p>

            <Button onClick={onSuccess} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        )}

        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

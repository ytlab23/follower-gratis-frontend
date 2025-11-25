'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAdminAuth, useAdminPanelUrl } from '../../hooks/use-admin';
import { AdminCustomization } from './admin-customization';
import { AdminPayment } from './admin-payment';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { profile, isAuthenticated, isActive, isPaid } = useAdminAuth();
  const { data: panelUrlResponse } = useAdminPanelUrl();

  if (!isAuthenticated || !profile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Please log in to access your dashboard</div>
        </CardContent>
      </Card>
    );
  }

  const panelUrl = panelUrlResponse?.data?.panelUrl;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Welcome back, {profile.name}!
                <Badge variant={isActive ? "default" : "secondary"} className={
                  isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customization">Customize</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Type:</span>
                  <Badge variant="outline">{profile.role}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={isActive ? "default" : "secondary"} className={
                    isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }>
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment:</span>
                  <Badge variant={isPaid ? "default" : "secondary"} className={
                    isPaid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }>
                    {isPaid ? 'Paid' : 'Pending'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member Since:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Panel Information */}
            <Card>
              <CardHeader>
                <CardTitle>Panel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.adminProfile?.subdomain && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Subdomain:</span>
                    <Badge variant="outline">
                      {profile.adminProfile.subdomain}.yoursaasdomain.com
                    </Badge>
                  </div>
                )}

                {profile.adminProfile?.customDomain && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Custom Domain:</span>
                    <Badge variant="outline">{profile.adminProfile.customDomain}</Badge>
                  </div>
                )}

                {profile.adminProfile?.font && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Font:</span>
                    <Badge variant="outline" style={{ fontFamily: profile.adminProfile.font }}>
                      {profile.adminProfile.font}
                    </Badge>
                  </div>
                )}

                {panelUrl && (
                  <div className="pt-4">
                    <Button
                      className="w-full"
                      onClick={() => window.open(panelUrl, '_blank')}
                    >
                      Open Your Panel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Current Customization Preview */}
          {profile.adminProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Current Customization</CardTitle>
                <CardDescription>Your panel's current appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.adminProfile.logo && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Logo</h4>
                      <img
                        src={profile.adminProfile.logo}
                        alt="Logo"
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                  )}

                  {profile.adminProfile.themeColors && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Theme Colors</h4>
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded-full border"
                          style={{ backgroundColor: profile.adminProfile.themeColors.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-8 h-8 rounded-full border"
                          style={{ backgroundColor: profile.adminProfile.themeColors.secondary }}
                          title="Secondary"
                        />
                        <div
                          className="w-8 h-8 rounded-full border"
                          style={{ backgroundColor: profile.adminProfile.themeColors.accent }}
                          title="Accent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Customization Tab */}
        <TabsContent value="customization">
          <AdminCustomization
            onSuccess={() => setActiveTab('overview')}
          />
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <AdminPayment
            onSuccess={() => setActiveTab('overview')}
            onCancel={() => setActiveTab('overview')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

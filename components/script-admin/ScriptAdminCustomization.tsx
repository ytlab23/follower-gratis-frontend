'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useScriptAdminProfile, useUpdateScriptAdminCustomization, useCheckSubdomain } from '../../hooks/use-script-admin';
import { ScriptAdminCustomization as CustomizationData, FONT_OPTIONS, THEME_PRESETS } from '../../types/script-admin';

const customizationSchema = z.object({
  logo: z.string().url().optional().or(z.literal('')),
  themeColors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }),
  font: z.string(),
  subdomain: z.string().min(3, 'Subdomain must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
  customDomain: z.string().optional().or(z.literal('')),
});

interface ScriptAdminCustomizationProps {
  onSuccess?: () => void;
}

export function ScriptAdminCustomization({ onSuccess }: ScriptAdminCustomizationProps) {
  const [error, setError] = useState<string>('');
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('');

  const { data: profileResponse } = useScriptAdminProfile();
  const updateCustomizationMutation = useUpdateScriptAdminCustomization();
  const checkSubdomainMutation = useCheckSubdomain();

  const profile = profileResponse?.data;
  const currentCustomization = profile?.scriptAdminProfile;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CustomizationData>({
    resolver: zodResolver(customizationSchema),
    defaultValues: {
      logo: currentCustomization?.logo || '',
      themeColors: currentCustomization?.themeColors || {
        primary: '#3B82F6',
        secondary: '#64748B',
        accent: '#10B981',
      },
      font: currentCustomization?.font || 'Inter',
      subdomain: currentCustomization?.subdomain || '',
      customDomain: currentCustomization?.customDomain || '',
    },
  });

  const watchedSubdomain = watch('subdomain');
  const watchedThemeColors = watch('themeColors');

  // Check subdomain availability when it changes
  useEffect(() => {
    if (watchedSubdomain && watchedSubdomain.length >= 3) {
      const timeoutId = setTimeout(async () => {
        try {
          const response = await checkSubdomainMutation.mutateAsync(watchedSubdomain);
          setSubdomainAvailable(response.data?.available || false);
        } catch (error) {
          setSubdomainAvailable(null);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSubdomainAvailable(null);
    }
  }, [watchedSubdomain, checkSubdomainMutation]);

  // Apply theme preset
  const applyThemePreset = (presetName: string) => {
    const preset = THEME_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setValue('themeColors', preset.colors);
      setSelectedTheme(presetName);
    }
  };

  // Reset to current values when profile loads
  useEffect(() => {
    if (currentCustomization) {
      reset({
        logo: currentCustomization.logo || '',
        themeColors: currentCustomization.themeColors || {
          primary: '#3B82F6',
          secondary: '#64748B',
          accent: '#10B981',
        },
        font: currentCustomization.font || 'Inter',
        subdomain: currentCustomization.subdomain || '',
        customDomain: currentCustomization.customDomain || '',
      });

      // Find current theme preset
      const currentTheme = THEME_PRESETS.find(preset =>
        preset.colors.primary === currentCustomization.themeColors?.primary &&
        preset.colors.secondary === currentCustomization.themeColors?.secondary &&
        preset.colors.accent === currentCustomization.themeColors?.accent
      );
      if (currentTheme) {
        setSelectedTheme(currentTheme.name);
      }
    }
  }, [currentCustomization, reset]);

  const onSubmit = async (data: CustomizationData) => {
    try {
      setError('');

      // Check subdomain availability before submitting
      if (data.subdomain && data.subdomain !== currentCustomization?.subdomain) {
        const response = await checkSubdomainMutation.mutateAsync(data.subdomain);
        if (!response.data?.available) {
          setError('Subdomain is not available');
          return;
        }
      }

      const response = await updateCustomizationMutation.mutateAsync(data);

      if (response.success) {
        onSuccess?.();
      } else {
        setError(response.message || 'Failed to update customization');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update customization');
    }
  };

  if (!profile) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading customization...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Panel Customization</CardTitle>
        <CardDescription>
          Customize the appearance of your script admin panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Logo Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Logo</h3>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                type="url"
                placeholder="https://example.com/logo.png"
                {...register('logo')}
              />
              {errors.logo && (
                <p className="text-sm text-red-600">{errors.logo.message}</p>
              )}
              {watch('logo') && (
                <div className="mt-2">
                  <img
                    src={watch('logo')}
                    alt="Logo preview"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Theme Colors Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Theme Colors</h3>

            {/* Theme Presets */}
            <div className="space-y-2">
              <Label>Theme Presets</Label>
              <div className="flex flex-wrap gap-2">
                {THEME_PRESETS.map((preset) => (
                  <Button
                    key={preset.name}
                    type="button"
                    variant={selectedTheme === preset.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyThemePreset(preset.name)}
                    className="text-xs"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    className="w-16 h-10 p-1"
                    {...register('themeColors.primary')}
                  />
                  <Input
                    type="text"
                    placeholder="#3B82F6"
                    {...register('themeColors.primary')}
                    className="flex-1"
                  />
                </div>
                {errors.themeColors?.primary && (
                  <p className="text-sm text-red-600">{errors.themeColors.primary.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    className="w-16 h-10 p-1"
                    {...register('themeColors.secondary')}
                  />
                  <Input
                    type="text"
                    placeholder="#64748B"
                    {...register('themeColors.secondary')}
                    className="flex-1"
                  />
                </div>
                {errors.themeColors?.secondary && (
                  <p className="text-sm text-red-600">{errors.themeColors.secondary.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    className="w-16 h-10 p-1"
                    {...register('themeColors.accent')}
                  />
                  <Input
                    type="text"
                    placeholder="#10B981"
                    {...register('themeColors.accent')}
                    className="flex-1"
                  />
                </div>
                {errors.themeColors?.accent && (
                  <p className="text-sm text-red-600">{errors.themeColors.accent.message}</p>
                )}
              </div>
            </div>

            {/* Color Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: watchedThemeColors?.secondary || '#64748B',
                  color: 'white',
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: watchedThemeColors?.primary || '#3B82F6' }}
                  />
                  <span style={{ color: watchedThemeColors?.accent || '#10B981' }}>
                    Your Panel Preview
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Font Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Typography</h3>
            <div className="space-y-2">
              <Label htmlFor="font">Font Family</Label>
              <Select
                value={watch('font')}
                onValueChange={(value) => setValue('font', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.font && (
                <p className="text-sm text-red-600">{errors.font.message}</p>
              )}
            </div>

            {/* Font Preview */}
            <div className="space-y-2">
              <Label>Font Preview</Label>
              <div
                className="p-4 border rounded-lg"
                style={{ fontFamily: watch('font') || 'Inter' }}
              >
                <p className="text-lg font-bold">Heading Text</p>
                <p className="text-sm">This is how your text will appear with the selected font.</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Domain Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Domain Settings</h3>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="flex gap-2">
                <Input
                  id="subdomain"
                  placeholder="yourpanel"
                  {...register('subdomain')}
                  className="flex-1"
                />
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">.yoursaasdomain.com</span>
                </div>
              </div>
              {errors.subdomain && (
                <p className="text-sm text-red-600">{errors.subdomain.message}</p>
              )}

              {watchedSubdomain && (
                <div className="flex items-center gap-2">
                  {checkSubdomainMutation.isPending ? (
                    <Badge variant="secondary">Checking...</Badge>
                  ) : subdomainAvailable === true ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>
                  ) : subdomainAvailable === false ? (
                    <Badge variant="destructive">Not Available</Badge>
                  ) : null}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
              <Input
                id="customDomain"
                type="url"
                placeholder="https://yourdomain.com"
                {...register('customDomain')}
              />
              {errors.customDomain && (
                <p className="text-sm text-red-600">{errors.customDomain.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Leave empty to use the subdomain. Custom domain requires DNS configuration.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || updateCustomizationMutation.isPending}
              className="flex-1"
            >
              {isSubmitting || updateCustomizationMutation.isPending
                ? 'Saving...'
                : 'Save Customization'
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

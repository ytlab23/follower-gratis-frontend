/**
 * Tenant configuration and utilities
 */

export interface TenantConfig {
    subdomain: string;
    logo?: string;
    themeColors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    font: string;
    brandName: string;
    customDomain?: string;
    favicon?: string;
}

/**
 * Fetch tenant configuration by subdomain or custom domain
 */
export async function getTenantConfig(
    identifier: string,
    isCustomDomain: boolean = false
): Promise<TenantConfig | null> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const endpoint = isCustomDomain
            ? `${apiUrl}/api/tenant/config/domain/${identifier}`
            : `${apiUrl}/api/tenant/config/${identifier}`;

        const response = await fetch(endpoint, {
            cache: 'no-store', // Always fetch fresh data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch tenant config: ${response.status}`);
            return null;
        }

        const result = await response.json();

        if (!result.success || !result.data) {
            return null;
        }

        return result.data;
    } catch (error) {
        console.error('Error fetching tenant config:', error);
        return null;
    }
}

/**
 * Get default tenant configuration
 */
export function getDefaultTenantConfig(): TenantConfig {
    return {
        subdomain: '',
        logo: '',
        themeColors: {
            primary: '#3B82F6',
            secondary: '#64748B',
            accent: '#10B981',
        },
        font: 'Inter',
        brandName: 'SMM Panel',
    };
}

/**
 * Generate CSS variables from theme colors
 */
export function generateThemeCSS(themeColors: TenantConfig['themeColors']): string {
    return `
    :root {
      --color-primary: ${themeColors.primary};
      --color-secondary: ${themeColors.secondary};
      --color-accent: ${themeColors.accent};
      
      /* HSL conversions for shadcn/ui compatibility */
      --primary: ${hexToHSL(themeColors.primary)};
      --secondary: ${hexToHSL(themeColors.secondary)};
      --accent: ${hexToHSL(themeColors.accent)};
    }
  `;
}

/**
 * Convert hex color to HSL for shadcn/ui
 */
function hexToHSL(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    const lPercent = Math.round(l * 100);

    return `${h} ${s}% ${lPercent}%`;
}

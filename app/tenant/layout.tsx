import { headers } from 'next/headers';
import { getTenantConfig, getDefaultTenantConfig, generateThemeCSS } from '@/lib/tenant';
import { TenantProvider } from '@/providers/TenantProvider';
import { Inter, Roboto, Poppins, Montserrat, Lato } from 'next/font/google';

// Font configurations
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-roboto' });
const poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], variable: '--font-poppins' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const lato = Lato({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-lato' });

const fontMap = {
    'Inter': inter,
    'Roboto': roboto,
    'Poppins': poppins,
    'Montserrat': montserrat,
    'Lato': lato,
};

export default async function TenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const subdomain = headersList.get('x-tenant-subdomain') || '';
    const customDomain = headersList.get('x-tenant-domain') || '';
    const isCustomDomain = headersList.get('x-is-custom-domain') === 'true';

    // Determine identifier
    const identifier = isCustomDomain ? customDomain : subdomain;

    // Fetch tenant configuration
    const tenantConfig = await getTenantConfig(identifier, isCustomDomain);

    if (!tenantConfig) {
        return (
            <html lang="en">
                <body className={inter.className}>
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Panel Not Found</h1>
                            <p className="text-gray-600 mb-8">
                                This panel doesn't exist or hasn't been activated yet.
                            </p>
                            <p className="text-sm text-gray-500">
                                {isCustomDomain ? `Domain: ${customDomain}` : `Subdomain: ${subdomain}`}
                            </p>
                        </div>
                    </div>
                </body>
            </html>
        );
    }

    // Get the selected font
    const selectedFont = fontMap[tenantConfig.font as keyof typeof fontMap] || inter;
    const themeCSS = generateThemeCSS(tenantConfig.themeColors);

    return (
        <html lang="en" className={selectedFont.variable}>
            <head>
                <title>{tenantConfig.brandName || 'SMM Panel'}</title>
                <link rel="icon" href={tenantConfig.favicon || tenantConfig.logo || '/favicon.ico'} />
                <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
            </head>
            <body className={selectedFont.className}>
                <TenantProvider config={tenantConfig}>
                    {children}
                </TenantProvider>
            </body>
        </html>
    );
}

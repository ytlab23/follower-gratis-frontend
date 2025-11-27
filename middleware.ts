import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for multi-tenant subdomain routing
 * Handles both subdomains (tenant1.yoursaas.com) and custom domains (customdomain.com)
 */
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Get the main domain from environment or default
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000';

  // Check if this is a custom domain (doesn't include main domain)
  const isCustomDomain = !hostname.includes(mainDomain.split(':')[0]);

  if (isCustomDomain && !hostname.includes('localhost')) {
    // This is a custom domain - route to tenant app
    url.pathname = `/tenant${url.pathname}`;

    const response = NextResponse.rewrite(url);
    response.headers.set('x-tenant-domain', hostname);
    response.headers.set('x-is-custom-domain', 'true');

    return response;
  }

  // Extract subdomain from hostname
  const subdomain = getSubdomain(hostname, mainDomain);

  // List of excluded subdomains (main app, admin, api, www)
  const excludedSubdomains = ['www', 'admin', 'api', ''];

  if (excludedSubdomains.includes(subdomain)) {
    // This is the main app or admin - let it through normally
    return NextResponse.next();
  }

  // This is a tenant subdomain - rewrite to tenant app
  url.pathname = `/tenant${url.pathname}`;

  const response = NextResponse.rewrite(url);
  response.headers.set('x-tenant-subdomain', subdomain);
  response.headers.set('x-is-custom-domain', 'false');

  return response;
}

/**
 * Extract subdomain from hostname
 */
function getSubdomain(hostname: string, mainDomain: string): string {
  // Remove port if present
  const host = hostname.split(':')[0];
  const mainHost = mainDomain.split(':')[0];

  // If host is exactly the main domain, return empty
  if (host === mainHost) {
    return '';
  }

  // Handle localhost subdomains specifically
  if (host.endsWith('.localhost')) {
    return host.replace('.localhost', '');
  }

  // For production domains
  const parts = host.split('.');
  const mainParts = mainHost.split('.');

  // If hostname has more parts than main domain, first part is subdomain
  if (parts.length > mainParts.length) {
    // Return all parts before the main domain parts
    // e.g. sub.domain.com -> sub
    // e.g. sub.sub.domain.com -> sub.sub
    const subdomainParts = parts.slice(0, parts.length - mainParts.length);
    return subdomainParts.join('.');
  }

  return '';
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};

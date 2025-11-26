'use client';

import { useTenant } from '@/providers/TenantProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TenantHomePage() {
    const { config } = useTenant();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {config.logo && (
                                <img
                                    src={config.logo}
                                    alt={config.brandName}
                                    className="h-10 w-auto object-contain"
                                />
                            )}
                            <h1 className="text-2xl font-bold" style={{ color: config.themeColors.primary }}>
                                {config.brandName}
                            </h1>
                        </div>
                        <nav className="flex gap-4">
                            <Link href="/tenant/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link href="/tenant/register">
                                <Button style={{ backgroundColor: config.themeColors.primary }}>
                                    Sign Up
                                </Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6" style={{ color: config.themeColors.primary }}>
                        Welcome to {config.brandName}
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Boost your social media presence with our premium SMM services.
                        Get real followers, likes, and engagement instantly.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/tenant/register">
                            <Button
                                size="lg"
                                className="text-lg px-8"
                                style={{ backgroundColor: config.themeColors.primary }}
                            >
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="/tenant/services">
                            <Button size="lg" variant="outline" className="text-lg px-8">
                                View Services
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: config.themeColors.primary }}>
                                ⚡ Instant Delivery
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Get your orders delivered instantly. No waiting, no delays.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: config.themeColors.primary }}>
                                💯 High Quality
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Premium quality services from real and active accounts.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: config.themeColors.primary }}>
                                🔒 Secure & Safe
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                100% secure payment and safe delivery. Your privacy matters.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Section */}
                <div
                    className="rounded-lg p-12 text-center text-white"
                    style={{ backgroundColor: config.themeColors.primary }}
                >
                    <h3 className="text-3xl font-bold mb-4">Ready to Grow Your Social Media?</h3>
                    <p className="text-lg mb-6 opacity-90">
                        Join thousands of satisfied customers and start growing today!
                    </p>
                    <Link href="/tenant/register">
                        <Button size="lg" variant="secondary" className="text-lg px-8">
                            Create Free Account
                        </Button>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-gray-600">
                        <p>&copy; {new Date().getFullYear()} {config.brandName}. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

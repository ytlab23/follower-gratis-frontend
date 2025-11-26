'use client';

import { createContext, useContext, ReactNode } from 'react';
import { TenantConfig } from '@/lib/tenant';

interface TenantContextType {
    config: TenantConfig;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({
    children,
    config,
}: {
    children: ReactNode;
    config: TenantConfig;
}) {
    return (
        <TenantContext.Provider value={{ config }}>
            {children}
        </TenantContext.Provider>
    );
}

export function useTenant() {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
}

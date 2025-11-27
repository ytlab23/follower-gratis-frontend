// Translation files - loaded as static data
import React from 'react'

// Load translation files
import enServices from '../../public/locales/en/services.json'
import itServices from '../../public/locales/it/services.json'
import enOrders from '../../public/locales/en/orders.json'
import itOrders from '../../public/locales/it/orders.json'
import enNewOrder from '../../public/locales/en/new-order.json'
import itNewOrder from '../../public/locales/it/new-order.json'
import enAuth from '../../public/locales/en/auth.json'
import itAuth from '../../public/locales/it/auth.json'
import enCommon from '../../public/locales/en/common.json'
import itCommon from '../../public/locales/it/common.json'
import enDashboard from '../../public/locales/en/dashboard.json'
import itDashboard from '../../public/locales/it/dashboard.json'
import enAdmin from '../../public/locales/en/admin.json'
import itAdmin from '../../public/locales/it/admin.json'



// Define translation types
export type Language = 'it' | 'en'

export interface Translations {
  common: typeof enCommon
  auth: typeof enAuth
  dashboard: typeof enDashboard
  services: typeof enServices
  orders: typeof enOrders
  newOrder: typeof enNewOrder
  admin: typeof enAdmin
}

// Combine translations
const translations: Record<Language, Translations> = {
  it: {
    common: itCommon,
    auth: itAuth,
    dashboard: itDashboard,
    services: itServices,
    orders: itOrders,
    newOrder: itNewOrder,
    admin: itAdmin,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    services: enServices,
    orders: enOrders,
    newOrder: enNewOrder,
    admin: enAdmin,
  },
}

// Language detection function
export const detectLanguage = (): Language => {
  if (typeof window === 'undefined') return 'it' // Default for SSR

  const stored = localStorage.getItem('language') as Language
  if (stored && Object.keys(translations).includes(stored)) {
    // Update HTML lang attribute when language is detected from storage
    document.documentElement.lang = stored
    return stored
  }

  const browserLang = navigator.language.split('-')[0] as Language
  const detectedLang = Object.keys(translations).includes(browserLang) ? browserLang : 'it'

  // Update HTML lang attribute for browser-detected language
  document.documentElement.lang = detectedLang
  return detectedLang
}

// Get nested translation value
export const getTranslation = (
  language: Language,
  namespace: keyof Translations,
  key: string
): string => {
  const keys = key.split('.')
  let value: any = translations[language][namespace]

  for (const k of keys) {
    value = value?.[k]
  }

  return typeof value === 'string' ? value : key
}

// Translation hook
export const useTranslation = (namespace: keyof Translations = 'common') => {
  const [language, setLanguage] = React.useState<Language>('it')

  React.useEffect(() => {
    const detectedLang = detectLanguage()
    setLanguage(detectedLang)
    // Ensure HTML lang attribute is set correctly on mount
    if (typeof document !== 'undefined') {
      document.documentElement.lang = detectedLang
    }
  }, [])

  const t = React.useCallback((key: string, params?: Record<string, string>) => {
    let text = getTranslation(language, namespace, key)

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), value)
      })
    }

    return text
  }, [language, namespace])

  const changeLanguage = React.useCallback((newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLanguage
    }
  }, [])

  return { t, language, changeLanguage }
}

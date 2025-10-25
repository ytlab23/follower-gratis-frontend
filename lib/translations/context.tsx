"use client"

import React, { createContext, useContext, useEffect } from 'react'
import { Language, Translations, useTranslation, detectLanguage } from './index'

// Create context type
interface TranslationContextType {
  t: (key: string, params?: Record<string, string>) => string
  language: Language
  changeLanguage: (language: Language) => void
}

// Create context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Context provider component
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const translation = useTranslation('common')

  // Ensure HTML lang attribute is set correctly on provider mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const detectedLang = detectLanguage()
      document.documentElement.lang = detectedLang
    }
  }, [])

  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  )
}

// Custom hook to use translations
export function useTranslationContext(namespace: keyof Translations = 'common') {
  const context = useContext(TranslationContext)

  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider')
  }

  return context
}

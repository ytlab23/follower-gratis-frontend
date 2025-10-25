"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useTranslationContext } from "@/lib/translations/context";
import { Language } from "@/lib/translations";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { t, language, changeLanguage } = useTranslationContext();

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none">
          <Button size="icon" variant="secondary">
            <Globe className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">{t('common.language')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => changeLanguage('it')}
            className={language === 'it' ? 'bg-accent' : ''}
          >
            🇮🇹 {t('common.languages.italian')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeLanguage('en')}
            className={language === 'en' ? 'bg-accent' : ''}
          >
            🇺🇸 {t('common.languages.english')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

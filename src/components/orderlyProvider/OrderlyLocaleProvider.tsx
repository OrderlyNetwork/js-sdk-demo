"use client";

import React, { FC, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  AsyncResources,
  getLocalePathFromPathname,
  i18n,
  importLocaleJsonModule,
  LocaleCode,
  LocaleEnum,
  LocaleProvider,
} from "@orderly.network/i18n";
import type { LocaleJsonModule } from "@orderly.network/i18n";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";
import extendEnLocale from "@/locales/en.json";

type LocaleJsonLoader = () => Promise<LocaleJsonModule>;

/**
 * Next.js cannot resolve dynamic `import(\`@orderly.network/i18n/locales/${lang}.json\`)`
 * through this package's `exports` field (resolves to unexported `./locales`). Use explicit
 * loaders so each locale file is a statically analyzable subpath.
 */
const baseLocaleLoaders: Record<LocaleEnum, LocaleJsonLoader> = {
  [LocaleEnum.de]: () => import("@orderly.network/i18n/locales/de.json"),
  [LocaleEnum.en]: () => import("@orderly.network/i18n/locales/en.json"),
  [LocaleEnum.es]: () => import("@orderly.network/i18n/locales/es.json"),
  [LocaleEnum.fr]: () => import("@orderly.network/i18n/locales/fr.json"),
  [LocaleEnum.id]: () => import("@orderly.network/i18n/locales/id.json"),
  [LocaleEnum.it]: () => import("@orderly.network/i18n/locales/it.json"),
  [LocaleEnum.ja]: () => import("@orderly.network/i18n/locales/ja.json"),
  [LocaleEnum.ko]: () => import("@orderly.network/i18n/locales/ko.json"),
  [LocaleEnum.nl]: () => import("@orderly.network/i18n/locales/nl.json"),
  [LocaleEnum.pl]: () => import("@orderly.network/i18n/locales/pl.json"),
  [LocaleEnum.pt]: () => import("@orderly.network/i18n/locales/pt.json"),
  [LocaleEnum.ru]: () => import("@orderly.network/i18n/locales/ru.json"),
  [LocaleEnum.tc]: () => import("@orderly.network/i18n/locales/tc.json"),
  [LocaleEnum.tr]: () => import("@orderly.network/i18n/locales/tr.json"),
  [LocaleEnum.uk]: () => import("@orderly.network/i18n/locales/uk.json"),
  [LocaleEnum.vi]: () => import("@orderly.network/i18n/locales/vi.json"),
  [LocaleEnum.zh]: () => import("@orderly.network/i18n/locales/zh.json"),
};

async function loadBase(lang: LocaleCode): Promise<Record<string, string>> {
  return importLocaleJsonModule(baseLocaleLoaders[lang as LocaleEnum]);
}

async function loadExtend(lang: LocaleCode): Promise<Record<string, string>> {
  return importLocaleJsonModule(() => import(`@/locales/${lang}.json`));
}

/**
 * Async locale bundles: en returns extend only (English base is built into the package).
 * Other locales merge SDK base JSON with app extend JSON.
 */
const resources: AsyncResources = async (lang: LocaleCode) => {
  if (lang === LocaleEnum.en) {
    return extendEnLocale as Record<string, string>;
  }
  const [base, extend] = await Promise.all([loadBase(lang), loadExtend(lang)]);
  return { ...base, ...extend };
};

export const OrderlyLocaleProvider: FC<React.PropsWithChildren> = ({
  children,
}) => {
  const path = usePathWithoutLang();
  const pathname = usePathname();

  const onLanguageChanged = useCallback(
    async (lang: LocaleCode) => {
      window.history.replaceState({}, "", `/${lang}${path}`);
    },
    [path],
  );

  useEffect(() => {
    const lang = getLocalePathFromPathname(pathname);
    // if url is include lang, and url lang is not the same as the i18n language, change the i18n language
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [pathname]);

  return (
    <LocaleProvider resources={resources} onLanguageChanged={onLanguageChanged}>
      {children}
    </LocaleProvider>
  );
};

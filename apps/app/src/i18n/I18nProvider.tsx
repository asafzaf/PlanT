import React, { useEffect, useMemo, useState } from "react";
import { getDictionary, getDir } from "./i18n";
import type { Lang } from "./i18n";
import { I18nContext } from "./I18nContext";

const STORAGE_KEY = "lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "he" || saved === "en" ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = getDir(lang);
  }, [lang]);

  const value = useMemo(() => {
    const t = getDictionary(lang);
    return {
      lang,
      setLang,
      toggleLang: () => setLang((prev) => (prev === "en" ? "he" : "en")),
      t,
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

import { createContext } from "react";
import type { Lang } from "./i18n";
import type { getDictionary } from "./i18n";

type Dictionary = ReturnType<typeof getDictionary>;

export type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: Dictionary;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

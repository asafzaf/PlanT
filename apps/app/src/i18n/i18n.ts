import en from "./en.json";
import he from "./he.json";

export type Lang = "en" | "he";

export const dictionaries = { en, he } as const;

export type Dictionary = typeof en; // ensure both jsons match en's shape

export const getDir = (lang: Lang) => (lang === "he" ? "rtl" : "ltr");
export const getDictionary = (lang: Lang): Dictionary => dictionaries[lang];

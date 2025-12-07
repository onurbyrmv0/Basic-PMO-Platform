import { createI18n } from "vue-i18n";
import az from "./az.json";
import en from "./en.json";

const savedLocale = localStorage.getItem("locale") || "az";

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: "en",
  messages: {
    az,
    en,
  },
});

export function setLocale(locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem("locale", locale);
  document.documentElement.setAttribute("lang", locale);
}

export function getLocale() {
  return i18n.global.locale.value;
}

export const availableLocales = [
  { code: "az", name: "Azərbaycan", flag: "🇦🇿" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

export default i18n;

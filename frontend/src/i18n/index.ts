import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import ruCommon from "./locales/ru/common.json"
import ruReview from "./locales/ru/review.json"
import ruProfile from "./locales/ru/profile.json"

import enCommon from "./locales/en/common.json"
import enReview from "./locales/en/review.json"
import enProfile from "./locales/en/profile.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { common: ruCommon, review: ruReview, profile: ruProfile},
      en: { common: enCommon, review: enReview, profile: enProfile },
    },
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

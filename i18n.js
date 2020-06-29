import i18n from "i18next";
import LanguageDetector from "i18next-react-native-language-detector";
import { initReactI18next } from "react-i18next";
import fr_translations from "./locales/fr/translations";
import en_translations from "./locales/en/translations";

i18n
  .use(LanguageDetector)
  //.use(Backend)
  .use(initReactI18next)
  .init({
    initImmediate: true,
    lng: "fr",
    fallbackLng: "en",
    resources: {
      fr: {
        translations: fr_translations,
      },
      en: {
        translations: en_translations,
      },
    },
    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ",",
    },
    react: {
      wait: true,
      bindI18n: "languageChanged loaded",
    },
  });

export default i18n;

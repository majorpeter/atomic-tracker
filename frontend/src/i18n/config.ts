import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./translations/en.json";
import hu from "./translations/hu.json";

import { AppLocalStorage } from "../util/local-storage";

i18next.use(initReactI18next).init({
  lng: AppLocalStorage.getLanguage(),
  debug: import.meta.env.DEV,
  resources: {
    en: { translation: en },
    hu: { translation: hu },
  },
});

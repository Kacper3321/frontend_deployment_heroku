import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../locales/en.json';
import translationPL from '../locales/pl.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      pl: { translation: translationPL }
    },
    lng: 'en', // Język domyślny
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;

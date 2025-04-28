import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importa os arquivos de tradução
import enTranslation from './locales/en/translation.json';
import ptTranslation from './locales/pt/translation.json';
import enArithmetic from './locales/en/arithmetic.json';
import ptArithmetic from './locales/pt/arithmetic.json';
import enFractions from './locales/en/fractions.json';
import ptFractions from './locales/pt/fractions.json';
import enTrigonometry from './locales/en/trigonometry.json';
import ptTrigonometry from './locales/pt/trigonometry.json';

export const resources = {
  en: {
    translation: enTranslation,
    arithmetic: enArithmetic,
    fractions: enFractions,
    trigonometry: enTrigonometry
  },
  pt: {
    translation: ptTranslation,
    arithmetic: ptArithmetic,
    fractions: ptFractions,
    trigonometry: ptTrigonometry
  }
};

i18n
  // Detecta o idioma do navegador
  .use(LanguageDetector)
  // Passa a instância do i18n para react-i18next
  .use(initReactI18next)
  // Inicializa o i18next
  .init({
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // não necessário para react, pois escapa por padrão
    },
    resources
  });

export default i18n; 
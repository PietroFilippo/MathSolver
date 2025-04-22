import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importa os arquivos de tradução
import enTranslation from './locales/en/translation.json';
import ptTranslation from './locales/pt/translation.json';

export const resources = {
  en: {
    translation: enTranslation
  },
  pt: {
    translation: ptTranslation
  }
};

i18n
  // Detecta o idioma do navegador
  .use(LanguageDetector)
  // Passa a instância do i18n para react-i18next
  .use(initReactI18next)
  // Inicializa o i18next
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // não necessário para react, pois escapa por padrão
    },
    resources
  });

export default i18n; 
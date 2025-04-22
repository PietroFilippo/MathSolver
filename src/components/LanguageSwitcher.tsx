import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button 
        className={`px-2 py-1 rounded text-sm ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button 
        className={`px-2 py-1 rounded text-sm ${i18n.language === 'pt' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
        onClick={() => changeLanguage('pt')}
      >
        PT
      </button>
    </div>
  );
};

export default LanguageSwitcher; 
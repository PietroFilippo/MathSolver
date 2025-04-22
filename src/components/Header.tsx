import { HiHome, HiInformationCircle, HiBookOpen, HiCalculator } from 'react-icons/hi';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { t } = useTranslation();
  // Verifica se estamos visualizando a seção Sobre dentro da página inicial
  const isSobreActive = currentPage === 'sobre' || 
    (currentPage === 'home' && window.location.hash === '#sobre');

  return (
    <header className="bg-primary-600 dark:bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center mb-4 md:mb-0 hover:opacity-80 transition-opacity duration-200"
          >
            <HiCalculator className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          </button>
          
          <div className="flex items-center">
            <nav className="mr-4">
              <ul className="flex space-x-6">
                <li>
                  <button 
                    onClick={() => {
                      onNavigate('home');
                      // Clear the hash when going to home
                      if (window.location.hash) {
                        window.history.pushState(null, '', window.location.pathname);
                      }
                    }}
                    className={`flex items-center ${currentPage === 'home' && !isSobreActive ? 'text-white font-bold' : 'text-indigo-200 dark:text-gray-300 hover:text-white'}`}
                  >
                    <HiHome className="h-5 w-5 mr-1" />
                    <span>{t('navigation.home')}</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('resolvedor')}
                    className={`flex items-center ${currentPage === 'resolvedor' ? 'text-white font-bold' : 'text-indigo-200 dark:text-gray-300 hover:text-white'}`}
                  >
                    <HiBookOpen className="h-5 w-5 mr-1" />
                    <span>{t('navigation.solvers')}</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('sobre')}
                    className={`flex items-center ${isSobreActive ? 'text-white font-bold' : 'text-indigo-200 dark:text-gray-300 hover:text-white'}`}
                  >
                    <HiInformationCircle className="h-5 w-5 mr-1" />
                    <span>{t('navigation.about')}</span>
                  </button>
                </li>
              </ul>
            </nav>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
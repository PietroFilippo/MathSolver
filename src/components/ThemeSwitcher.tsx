import React,{ useState, useRef, useEffect } from 'react';
import { HiSun, HiMoon, HiColorSwatch } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Opções de tema
  const themeOptions = [
    { value: 'light', label: t('theme.light'), icon: <HiSun className="w-5 h-5 text-yellow-500" /> },
    { value: 'dark', label: t('theme.dark'), icon: <HiMoon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> },
    { value: 'blue', label: t('theme.blue'), colorClass: 'bg-blue-500' },
    { value: 'purple', label: t('theme.purple'), colorClass: 'bg-purple-500' },
    { value: 'green', label: t('theme.green'), colorClass: 'bg-green-500' },
    { value: 'red', label: t('theme.red'), colorClass: 'bg-red-500' },
    { value: 'pink', label: t('theme.pink'), colorClass: 'bg-pink-500' },
    { value: 'yellow', label: t('theme.yellow'), colorClass: 'bg-yellow-500' },
    { value: 'brown', label: t('theme.brown'), colorClass: 'bg-amber-800' },
    { value: 'rgb', label: t('theme.rgb'), colorClass: 'rgb-gradient' },
  ];

  // Obter ícone do tema atual
  const getCurrentThemeIcon = () => {
    if (theme === 'light') return <HiSun className="h-5 w-5 mr-1" />;
    if (theme === 'dark') return <HiMoon className="h-5 w-5 mr-1" />;
    if (theme === 'rgb') return <HiColorSwatch className="h-5 w-5 mr-1 rgb-text" />;
    return <HiColorSwatch className="h-5 w-5 mr-1" />;
  };

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center hover:text-white transition-colors duration-200"
        aria-label={t('theme.change_theme')}
        title={t('theme.change_theme')}
      >
        {getCurrentThemeIcon()}
        <span>{t('theme.theme')}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setTheme(option.value as any);
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                theme === option.value ? 'bg-indigo-100 dark:bg-indigo-900/50 font-medium' : ''
              }`}
            >
              {option.icon ? (
                option.icon
              ) : (
                <span className={`w-5 h-5 rounded-full ${option.colorClass} shadow-sm`}></span>
              )}
              <span className="ml-3 text-gray-700 dark:text-gray-200 font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 
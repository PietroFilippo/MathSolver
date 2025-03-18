import { useState, useRef, useEffect } from 'react';
import { HiSun, HiMoon, HiColorSwatch } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
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
    { value: 'light', label: 'Claro', icon: <HiSun className="w-5 h-5 text-yellow-500" /> },
    { value: 'dark', label: 'Escuro', icon: <HiMoon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> },
    { value: 'blue', label: 'Azul', colorClass: 'bg-blue-500' },
    { value: 'purple', label: 'Roxo', colorClass: 'bg-purple-500' },
    { value: 'green', label: 'Verde', colorClass: 'bg-green-500' },
    { value: 'red', label: 'Vermelho', colorClass: 'bg-red-500' },
    { value: 'pink', label: 'Rosa', colorClass: 'bg-pink-500' },
  ];

  // Obter ícone do tema atual
  const getCurrentThemeIcon = () => {
    if (theme === 'light') return <HiSun className="w-5 h-5 text-yellow-300" />;
    if (theme === 'dark') return <HiMoon className="w-5 h-5 text-white" />;
    return <HiColorSwatch className="w-5 h-5 text-white" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/20 dark:bg-gray-800/50 text-white hover:bg-white/30 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center shadow-sm border border-white/20 dark:border-gray-700"
        aria-label="Mudar tema"
        title="Mudar tema"
      >
        {getCurrentThemeIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
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
              <span className="ml-3 text-gray-700 dark:text-gray-200">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 
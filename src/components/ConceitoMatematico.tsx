import React, { useState } from 'react';
import { HiChevronDown, HiChevronUp, HiInformationCircle } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

interface ConceitoMatematicoProps {
  title?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

const ConceitoMatematico: React.FC<ConceitoMatematicoProps> = ({
  title = "Conceito Matemático",
  children,
  isOpen: externalIsOpen,
  onToggle
}) => {
  const { t } = useTranslation(['translation']);
  // Estado local para controlar a visibilidade do conteúdo
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Determina se o componente é controlado externamente ou internamente
  const isControlled = externalIsOpen !== undefined && onToggle !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  
  const handleToggle = () => {
    if (isControlled) {
      onToggle!();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left bg-theme-container dark:bg-gray-800"
        onClick={handleToggle}
      >
        <div className="flex items-center">
          <HiInformationCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
        {isOpen ? (
          <HiChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <HiChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-theme-container dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

export default ConceitoMatematico; 
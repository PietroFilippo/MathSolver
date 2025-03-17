import React, { ReactNode } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

interface ConceitoMatematicoProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const ConceitoMatematico: React.FC<ConceitoMatematicoProps> = ({
  title,
  isOpen,
  onToggle,
  children
}) => {
  return (
    <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 overflow-hidden">
      <div className="px-4 py-3 bg-blue-100 border-b border-blue-200">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {title}
          </h4>
          <button 
            onClick={onToggle}
            className="text-blue-700 hover:text-blue-900 flex items-center text-sm font-medium"
          >
            {isOpen ? (
              <>
                <HiChevronUp className="h-5 w-5 mr-1" />
                Ocultar
              </>
            ) : (
              <>
                <HiChevronDown className="h-5 w-5 mr-1" />
                Mostrar
              </>
            )}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default ConceitoMatematico; 
import React from 'react';
import SmartProblemRecognition from './SmartProblemRecognition';

interface ResolvedorSmartRecognitionProps {
  onProblemRecognized: (problem: string) => void;
  placeholder?: string;
}

const ResolvedorSmartRecognition: React.FC<ResolvedorSmartRecognitionProps> = ({
  onProblemRecognized,
  placeholder
}) => {
  return (
    <div className="mb-6">
      <SmartProblemRecognition 
        onProblemRecognized={onProblemRecognized}
      />
      {placeholder && (
        <p className="text-sm text-gray-500 mt-2">
          Dica: Tire uma foto de {placeholder} para resolver automaticamente
        </p>
      )}
    </div>
  );
};

export default ResolvedorSmartRecognition;
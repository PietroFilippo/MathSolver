import React, { ReactNode } from 'react';
import RendererFactory from './stepRenderers';

interface StepByStepExplanationProps {
  steps: (string | ReactNode)[];
  customRenderStep?: (step: string | ReactNode, index: number) => ReactNode;
  stepType?: 'default' | 'trigonometric' | 'geometric' | 'linear' | 'calculus' | 'solution' | 'error' | 'matrices';
}


 // Componente que renderiza explicações passo a passo para processos matemáticos
 // Este componente é refatorado para usar renderizadores especializados com base no tipo de passo
const StepByStepExplanation: React.FC<StepByStepExplanationProps> = ({ 
  steps, 
  customRenderStep,
  stepType = 'default'
}) => {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => 
        customRenderStep ? 
          customRenderStep(step, index) : 
          <RendererFactory 
            key={index} 
            step={step} 
            index={index} 
            stepType={stepType} 
          />
      )}
    </div>
  );
};

export default StepByStepExplanation; 
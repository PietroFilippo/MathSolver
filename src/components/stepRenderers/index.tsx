import React, { ReactNode } from 'react';
import DefaultRenderer from './DefaultRenderer';
import LinearRenderer from './LinearRenderer';
import MatricesRenderer from './MatricesRenderer';
import TrigonometricRenderer from './TrigonometricRenderer';
import GeometricRenderer from './GeometricRenderer';
import CalculusRenderer from './CalculusRenderer';

type StepType = 'default' | 'linear' | 'trigonometric' | 'geometric' | 'calculus' | 'matrices' | 'solution' | 'error';

interface RendererFactoryProps {
  step: string | ReactNode;
  index: number;
  stepType: StepType;
}


// Função de fábrica que seleciona o renderizador apropriado com base no tipo de passo
const RendererFactory: React.FC<RendererFactoryProps> = ({ step, index, stepType }) => {
  switch (stepType) {
    case 'linear':
      return <LinearRenderer step={step} index={index} />;
    case 'trigonometric':
      return <TrigonometricRenderer step={step} index={index} />;
    case 'geometric':
      return <GeometricRenderer step={step} index={index} />;
    case 'calculus':
      return <CalculusRenderer step={step} index={index} />;
    case 'matrices':
      return <MatricesRenderer step={step} index={index} />;
    default:
      return <DefaultRenderer step={step} index={index} />;
  }
};

export default RendererFactory; 
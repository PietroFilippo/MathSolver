import { useState, useEffect } from 'react';
import { 
  HiChevronDown, 
  HiChevronUp, 
  HiCalculator, 
  HiChartPie, 
  HiCode, 
  HiTrendingUp, 
  HiViewGrid, 
  HiChartBar, 
  HiAcademicCap 
} from 'react-icons/hi';
import { solvers, educationalLevels } from '../data/resolvedores';

import ResolvedorPorcentagem from '../resolvedores/ResolvedorPorcentagem';
import ResolvedorMediaAritmetica from '../resolvedores/ResolvedorMediaAritmetica';
import ResolvedorProporcao from '../resolvedores/ResolvedorProporcao';
import ResolvedorAddSubFracao from '../resolvedores/ResolvedorAddSubFracao';
import ResolvedorMultDivFracao from '../resolvedores/ResolvedorMultDivFracao';
import ResolvedorEquacaoPrimeiroGrau from '../resolvedores/ResolvedorEquacaoPrimeiroGrau';
import ResolvedorEquacaoQuadratica from '../resolvedores/ResolvedorEquacaoQuadratica';
import ResolvedorSistemasLineares from '../resolvedores/ResolvedorSistemasLineares';
import ResolvedorTrigonometria from '../resolvedores/ResolvedorTrigonometria';
import ResolvedorLogaritmo from '../resolvedores/ResolvedorLogaritmo';

interface SolverPageProps {
  initialCategory?: string | null;
}

const SolverPage: React.FC<SolverPageProps> = ({ initialCategory }) => {
  const [selectedSolver, setSelectedSolver] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'arithmetic': false,
    'fractions': false,
    'algebra': false,
    'advanced': false,
    'geometry': false,
    'statistics': false
  });
  const [filterMode, setFilterMode] = useState<'subject' | 'level'>('subject');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Open the category specified by initialCategory on first render
  useEffect(() => {
    if (initialCategory) {
      // If initial category exists in our list, expand it
      if (Object.keys(expandedCategories).includes(initialCategory)) {
        setExpandedCategories(prev => ({
          ...prev,
          [initialCategory]: true
        }));
      }

      // If we're in level mode but there's a category specified, switch to subject mode
      if (filterMode === 'level') {
        setFilterMode('subject');
      }
    }
  }, [initialCategory]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <HiCalculator className="h-5 w-5" />;
      case 'PieChart': return <HiChartPie className="h-5 w-5" />;
      case 'Functions': return <HiCode className="h-5 w-5" />;
      case 'TrendingUp': return <HiTrendingUp className="h-5 w-5" />;
      case 'Square': return <HiViewGrid className="h-5 w-5" />;
      case 'BarChart': return <HiChartBar className="h-5 w-5" />;
      default: return <HiCalculator className="h-5 w-5" />;
    }
  };

  const renderSolver = () => {
    switch (selectedSolver) {
      case 'percentage':
        return <ResolvedorPorcentagem />;
      case 'fraction-add-sub':
        return <ResolvedorAddSubFracao />;
      case 'arithmetic-mean':
        return <ResolvedorMediaAritmetica />;
      case 'proportion':
        return <ResolvedorProporcao />;
      case 'fraction-mult-div':
        return <ResolvedorMultDivFracao />;
      case 'linear-equation':
        return <ResolvedorEquacaoPrimeiroGrau />;
      case 'quadratic-equation':
        return <ResolvedorEquacaoQuadratica />;
      case 'linear-system':
        return <ResolvedorSistemasLineares />;
      case 'trigonometric':
        return <ResolvedorTrigonometria />;
      case 'logarithm':
        return <ResolvedorLogaritmo />;
      default:
        return (
          <div className="text-center p-8">
            <h3 className="text-xl font-medium text-gray-700">Selecione um resolvedor na barra lateral para começar</h3>
            <p className="mt-4 text-gray-500">Escolha um problema matemático para obter uma solução detalhada e passo a passo.</p>
          </div>
        );
    }
  };

  // Função auxiliar para verificar se o resolvedor pertence ao nível selecionado
  const isSolverInLevel = (solverId: string, level: string) => {
    return educationalLevels[level as keyof typeof educationalLevels].includes(solverId);
  };

  const renderBySubject = () => (
    <>
      {Object.entries(solvers).map(([category, categoryData]) => {
        // Pula categorias vazias
        if (categoryData.solvers.length === 0) return null;
        
        return (
          <div key={category} className="mb-4">
            <button 
              className="w-full flex justify-between items-center py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center">
                <span className="mr-2">{getIconComponent(categoryData.icon)}</span>
                <span>{categoryData.name}</span>
              </div>
              {expandedCategories[category] ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
            </button>
            
            {expandedCategories[category] && (
              <ul className="mt-2 space-y-1 pl-2">
                {categoryData.solvers.map(solver => (
                  <li key={solver.id}>
                    <button 
                      className={`w-full text-left py-2 px-3 rounded-md ${
                        selectedSolver === solver.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedSolver(solver.id)}
                    >
                      {solver.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );

  const renderByLevel = () => (
    <>
      {Object.entries(educationalLevels).map(([level, _]) => {
        const levelName = level === 'elementary' ? 'Ensino Fundamental' : 'Ensino Médio';
        const isExpanded = selectedLevel === level;
        
        return (
          <div key={level} className="mb-4">
            <button 
              className={`w-full flex justify-between items-center py-2 px-3 rounded-md font-medium ${
                isExpanded ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedLevel(isExpanded ? null : level)}
            >
              <div className="flex items-center">
                <HiAcademicCap className="h-5 w-5 mr-2" />
                <span>{levelName}</span>
              </div>
              {isExpanded ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
            </button>
            
            {isExpanded && (
              <ul className="mt-2 space-y-1 pl-2">
                {Object.entries(solvers).map(([category, categoryData]) => {
                  // Filtra resolvedores pelo nível educacional
                  const levelSolvers = categoryData.solvers.filter(
                    solver => isSolverInLevel(solver.id, level)
                  );
                  
                  if (levelSolvers.length === 0) return null;
                  
                  return (
                    <li key={category} className="mt-2">
                      <div className="font-medium text-sm text-gray-500 ml-2 mb-1 flex items-center">
                        {getIconComponent(categoryData.icon)}
                        <span className="ml-1">{categoryData.name}</span>
                      </div>
                      <ul>
                        {levelSolvers.map(solver => (
                          <li key={solver.id}>
                            <button 
                              className={`w-full text-left py-2 px-3 rounded-md ${
                                selectedSolver === solver.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                              }`}
                              onClick={() => setSelectedSolver(solver.id)}
                            >
                              {solver.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/4 bg-white rounded-lg shadow-md p-4 h-fit">
        <h2 className="text-xl font-bold mb-4">Solucionadores Matemáticos</h2>

        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md ${
              filterMode === 'subject' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilterMode('subject')}
            data-filter="subject"
          >
            Por Assunto
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md ${
              filterMode === 'level' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilterMode('level')}
            data-filter="level"
          >
            Por Nível
          </button>
        </div>
        
        {filterMode === 'subject' ? renderBySubject() : renderByLevel()}
      </div>

      <div className="md:w-3/4 bg-white rounded-lg shadow-md p-6">
        {renderSolver()}
      </div>
    </div>
  );
};

export default SolverPage;
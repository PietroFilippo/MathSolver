import { useState } from 'react';
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

// Placeholders até que os resolvers sejam implementados
import ResolvedorPorcentagem from '../resolvedores/ResolvedorPorcentagem';
import ResolvedorMediaAritmetica from '../resolvedores/ResolvedorMediaAritmetica';
const FractionAddSubSolver = () => <div>Resolvedor de Adição e Subtração de Frações</div>;
import ResolvedorProporcao from '../resolvedores/ResolvedorProporcao';
const FractionMultDivSolver = () => <div>Resolvedor de Multiplicação e Divisão de Frações</div>;
const LinearEquationSolver = () => <div>Resolvedor de Equações Lineares</div>;
const QuadraticEquationSolver = () => <div>Resolvedor de Equações Quadráticas</div>;
const LinearSystemSolver = () => <div>Resolvedor de Sistemas Lineares</div>;
const TrigonometricSolver = () => <div>Resolvedor de Funções Trigonométricas</div>;
import ResolvedorLogaritmo from '../resolvedores/ResolvedorLogaritmo';

const SolverPage: React.FC = () => {
  const [selectedSolver, setSelectedSolver] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'arithmetic': true,
    'fractions': false,
    'algebra': false,
    'advanced': false,
    'geometry': false,
    'statistics': false
  });
  const [filterMode, setFilterMode] = useState<'subject' | 'level'>('subject');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

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
        return <FractionAddSubSolver />;
      case 'arithmetic-mean':
        return <ResolvedorMediaAritmetica />;
      case 'proportion':
        return <ResolvedorProporcao />;
      case 'fraction-mult-div':
        return <FractionMultDivSolver />;
      case 'linear-equation':
        return <LinearEquationSolver />;
      case 'quadratic-equation':
        return <QuadraticEquationSolver />;
      case 'linear-system':
        return <LinearSystemSolver />;
      case 'trigonometric':
        return <TrigonometricSolver />;
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
      {/* Sidebar */}
      <div className="md:w-1/4 bg-white rounded-lg shadow-md p-4 h-fit">
        <h2 className="text-xl font-bold mb-4">Resolvedores Matemáticos</h2>

        {/* View Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md ${
              filterMode === 'subject' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilterMode('subject')}
          >
            Por Assunto
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md ${
              filterMode === 'level' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilterMode('level')}
          >
            Por Nível
          </button>
        </div>
        
        {filterMode === 'subject' ? renderBySubject() : renderByLevel()}
      </div>
      
      {/* Main Content */}
      <div className="md:w-3/4 bg-white rounded-lg shadow-md p-6">
        {renderSolver()}
      </div>
    </div>
  );
};

export default SolverPage;
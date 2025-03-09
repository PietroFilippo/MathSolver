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
  HiAcademicCap,
  HiSearch,
  HiLightBulb
} from 'react-icons/hi';
import { solvers, educationalLevels } from '../data/resolvedores';

import ResolvedorPorcentagem from '../resolvedores/aritmetica/ResolvedorPorcentagem';
import ResolvedorMediaAritmetica from '../resolvedores/aritmetica/ResolvedorMediaAritmetica';
import ResolvedorProporcao from '../resolvedores/aritmetica/ResolvedorProporcao';
import ResolvedorAddSubFracao from '../resolvedores/fracoes/ResolvedorAddSubFracao';
import ResolvedorMultDivFracao from '../resolvedores/fracoes/ResolvedorMultDivFracao';
import ResolvedorEquacaoPrimeiroGrau from '../resolvedores/algebra/ResolvedorEquacaoPrimeiroGrau';
import ResolvedorEquacaoQuadratica from '../resolvedores/algebra/ResolvedorEquacaoQuadratica';
import ResolvedorSistemasLineares from '../resolvedores/algebra/ResolvedorSistemasLineares';
import ResolvedorTrigonometria from '../resolvedores/trigonometria/ResolvedorTrigonometria';
import ResolvedorLogaritmo from '../resolvedores/algebra/ResolvedorLogaritmo';
import ResolvedorMMCMDC from '../resolvedores/aritmetica/ResolvedorMMCMDC';
import ResolvedorFatorizacao from '../resolvedores/aritmetica/ResolvedorFatorizacao';
import ResolvedorExpressoesAlgebricas from '../resolvedores/algebra/ResolvedorExpressoesAlgebricas';
import ResolvedorInequacoes from '../resolvedores/algebra/ResolvedorInequacoes';
import ResolvedorSimplificacaoFracoes from '../resolvedores/fracoes/ResolvedorSimplificacaoFracoes';
import ResolvedorFracoesMistas from '../resolvedores/fracoes/ResolvedorFracoesMistas';

interface SolverPageProps {
  initialCategory?: string | null;
}

const SolverPage: React.FC<SolverPageProps> = ({ initialCategory }) => {
  const [selectedSolver, setSelectedSolver] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'arithmetic': false,
    'fractions': false,
    'algebra': false,
    'trigonometria': false,
    'geometria': false,
    'estatistica': false,
    'calculo': false
  });
  const [filterMode, setFilterMode] = useState<'subject' | 'level'>('subject');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{id: string; name: string; category: string}>>([]);

  // Abrir a categoria especificada por initialCategory na primeira renderização
  useEffect(() => {
    if (initialCategory) {
      // Se a categoria inicial existir na nossa lista, expanda-a
      if (Object.keys(expandedCategories).includes(initialCategory)) {
        setExpandedCategories(prev => ({
          ...prev,
          [initialCategory]: true
        }));
      }

      // Se estiver no modo de nível e houver uma categoria especificada, troque para o modo de assunto
      if (filterMode === 'level') {
        setFilterMode('subject');
      }
    }
  }, [initialCategory]);

  // Efeito para realizar a pesquisa quando o termo de busca muda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const results: Array<{id: string; name: string; category: string}> = [];

    Object.entries(solvers).forEach(([_, categoryData]) => {
      categoryData.solvers.forEach(solver => {
        const normalizedSolverName = solver.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (normalizedSolverName.includes(normalizedSearchTerm)) {
          results.push({
            id: solver.id,
            name: solver.name,
            category: categoryData.name
          });
        }
      });
    });

    setSearchResults(results);
  }, [searchTerm]);

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
      case 'ChartLine': return <HiTrendingUp className="h-5 w-5" />;
      default: return <HiCalculator className="h-5 w-5" />;
    }
  };

  const renderSolver = () => {
    if (!selectedSolver) return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <HiLightBulb className="h-16 w-16 mb-4 text-yellow-400" />
        <h2 className="text-2xl font-bold mb-2">Selecione um solucionador</h2>
        <p className="text-center max-w-md">
          Escolha um solucionador na barra lateral para começar a resolver problemas matemáticos passo a passo.
        </p>
      </div>
    );

    switch (selectedSolver) {
      case 'percentage':
        return <ResolvedorPorcentagem />;
      case 'arithmetic-mean':
        return <ResolvedorMediaAritmetica />;
      case 'proportion':
        return <ResolvedorProporcao />;
      case 'fraction-add-sub':
        return <ResolvedorAddSubFracao />;
      case 'fraction-mult-div':
        return <ResolvedorMultDivFracao />;
      case 'fraction-simplification':
        return <ResolvedorSimplificacaoFracoes />;
      case 'mixed-fractions':
        return <ResolvedorFracoesMistas />;
      case 'linear-equation':
        return <ResolvedorEquacaoPrimeiroGrau />;
      case 'linear-system':
        return <ResolvedorSistemasLineares />;
      case 'quadratic-equation':
        return <ResolvedorEquacaoQuadratica />;
      case 'trigonometric':
        return <ResolvedorTrigonometria />;
      case 'logarithm':
        return <ResolvedorLogaritmo />;
      case 'mmc-mdc':
        return <ResolvedorMMCMDC />;
      case 'fatorizacao':
        return <ResolvedorFatorizacao />;
      case 'algebraic-expressions':
        return <ResolvedorExpressoesAlgebricas />;
      case 'inequations':
        return <ResolvedorInequacoes />;
      default:
        return <div>Solucionador não encontrado.</div>;
    }
  };

  // Função auxiliar para verificar se o resolvedor pertence ao nível selecionado
  const isSolverInLevel = (solverId: string, level: string) => {
    return educationalLevels[level as keyof typeof educationalLevels].includes(solverId);
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div className="text-gray-500 p-3 italic text-center">
          Nenhum solucionador encontrado para "{searchTerm}"
        </div>
      );
    }

    return (
      <ul className="mt-2 space-y-1 pl-2">
        {searchResults.map(result => (
          <li key={result.id}>
            <button 
              className={`w-full text-left py-2 px-3 rounded-md ${
                selectedSolver === result.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                setSelectedSolver(result.id);
                setSearchTerm(''); // Limpar a busca após a seleção
              }}
            >
              <div>
                {result.name}
              </div>
              <div className="text-xs text-gray-500">
                {result.category}
              </div>
            </button>
          </li>
        ))}
      </ul>
    );
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

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Buscar solucionador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm ? (
          renderSearchResults()
        ) : (
          <>
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
          </>
        )}
      </div>

      <div className="md:w-3/4 bg-white rounded-lg shadow-md p-6">
        {renderSolver()}
      </div>
    </div>
  );
};

export default SolverPage;
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
  HiLightBulb,
  HiTable
} from 'react-icons/hi';
import { solvers, educationalLevels } from '../data/resolvedores';

import ResolvedorPorcentagem from '../resolvedores/aritmetica/ResolvedorPorcentagem';
import ResolvedorMediaModaMediana from '../resolvedores/estatistica/ResolvedorMediaModaMediana';
import ResolvedorProporcao from '../resolvedores/aritmetica/ResolvedorProporcao';
import ResolvedorAddSubFracao from '../resolvedores/fracoes/ResolvedorAddSubFracao';
import ResolvedorMultDivFracao from '../resolvedores/fracoes/ResolvedorMultDivFracao';
import ResolvedorEquacaoPrimeiroGrau from '../resolvedores/algebra/ResolvedorEquacaoPrimeiroGrau';
import ResolvedorEquacaoQuadratica from '../resolvedores/algebra/ResolvedorEquacaoQuadratica';
import ResolvedorSistemasLineares from '../resolvedores/algebra/ResolvedorSistemasLineares';
import ResolvedorLogaritmo from '../resolvedores/algebra/ResolvedorLogaritmo';
import ResolvedorMMCMDC from '../resolvedores/aritmetica/ResolvedorMMCMDC';
import ResolvedorFatorizacao from '../resolvedores/aritmetica/ResolvedorFatorizacao';
import ResolvedorSimplificacaoFracoes from '../resolvedores/fracoes/ResolvedorSimplificacaoFracoes';
import ResolvedorFracoesMistas from '../resolvedores/fracoes/ResolvedorFracoesMistas';
import ResolvedorMediaPonderada from '../resolvedores/estatistica/ResolvedorMediaPonderada';
import ResolvedorDispersoes from '../resolvedores/estatistica/ResolvedorDispersoes';
import ResolvedorVariacaoCoeficiente from '../resolvedores/estatistica/ResolvedorVariacaoCoeficiente';
import ResolvedorAreaFigurasPlanas from '../resolvedores/geometria/ResolvedorAreaFigurasPlanas';
import ResolvedorPerimetros from '../resolvedores/geometria/ResolvedorPerimetros';
import ResolvedorVolumeSolidos from '../resolvedores/geometria/ResolvedorVolumeSolidos';
import ResolvedorFuncoesTrigonometricas from '../resolvedores/trigonometria/ResolvedorFuncoesTrigonometricas';
import ResolvedorEquacoesTrigonometricas from '../resolvedores/trigonometria/ResolvedorEquacoesTrigonometricas';
import ResolvedorGraficosTrigonometricos from '../resolvedores/trigonometria/ResolvedorGraficosTrigonometricos';
import ResolvedorDerivadas from '../resolvedores/calculo/ResolvedorDerivadas';
import ResolvedorIntegrais from '../resolvedores/calculo/ResolvedorIntegrais';
import ResolvedorSuperficieSolidos from '../resolvedores/geometria/ResolvedorSuperficieSolidos';
import ResolvedorCoordenadasGeometria from '../resolvedores/geometria/ResolvedorCoordenadasGeometria';
import ResolvedorVetorGeometria from '../resolvedores/geometria/ResolvedorVetorGeometria';
import ResolvedorGeometriaAnalitica from '../resolvedores/geometria/ResolvedorGeometriaAnalitica';
import ResolvedorExponenciacao from '../resolvedores/algebra/ResolvedorExponenciacao';
import ResolvedorAddSubMatrizes from '../resolvedores/matrizes/ResolvedorAddSubMatrizes';
import ResolvedorMultiplicacaoMatrizes from '../resolvedores/matrizes/ResolvedorMultiplicacaoMatrizes';
import ResolvedorDeterminanteMatrizes from '../resolvedores/matrizes/ResolvedorDeterminanteMatrizes';

interface SolverPageProps {
  initialCategory?: string | null;
}

const SolverPage: React.FC<SolverPageProps> = ({ initialCategory }) => {
  const [selectedSolver, setSelectedSolver] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'arithmetic': false,
    'fractions': false,
    'algebra': false,
    'matrizes': false,
    'trigonometria': false,
    'geometria': false,
    'estatistica': false,
    'calculo': false
  });
  const [filterMode, setFilterMode] = useState<'subject' | 'level' | 'search'>('subject');
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

    Object.entries(solvers).forEach(([_categoryId, categoryData]) => {
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
      case 'Table': return <HiTable className="h-5 w-5" />;
      default: return <HiCalculator className="h-5 w-5" />;
    }
  };

  // Renderiza o solucionador selecionado
  const renderSolver = () => {
    if (!selectedSolver) return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <HiLightBulb className="h-16 w-16 mb-4 text-yellow-400" />
        <h2 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-200">Selecione um solucionador</h2>
        <p className="text-center max-w-md">
          Escolha um solucionador na barra lateral para começar a resolver problemas matemáticos passo a passo.
        </p>
      </div>
    );

    switch (selectedSolver) {
      case 'percentage':
        return <ResolvedorPorcentagem />;
      case 'mean-mode-median':
        return <ResolvedorMediaModaMediana />;
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
      case 'trigonometric-functions':
        return <ResolvedorFuncoesTrigonometricas />;
      case 'trigonometric-equations':
        return <ResolvedorEquacoesTrigonometricas />;
      case 'logarithm':
        return <ResolvedorLogaritmo />;
      case 'mmc-mdc':
        return <ResolvedorMMCMDC />;
      case 'fatorizacao':
        return <ResolvedorFatorizacao />;
      case 'weighted-mean':
        return <ResolvedorMediaPonderada />;
      case 'dispersions':
        return <ResolvedorDispersoes />;
      case 'variation-coefficient':
        return <ResolvedorVariacaoCoeficiente />;
      case 'plane-figures-area':
        return <ResolvedorAreaFigurasPlanas />;
      case 'perimeters':
        return <ResolvedorPerimetros />;
      case 'solid-volumes':
        return <ResolvedorVolumeSolidos />;
      case 'trigonometric-graphs':
        return <ResolvedorGraficosTrigonometricos />;
      case 'derivatives':
        return <ResolvedorDerivadas />;
      case 'integrals':
        return <ResolvedorIntegrais />;
      case 'surface-solids':
        return <ResolvedorSuperficieSolidos />;
      case 'coordinate-geometry':
        return <ResolvedorCoordenadasGeometria />;
      case 'vector-geometry':
        return <ResolvedorVetorGeometria />;
      case 'analytic-geometry':
        return <ResolvedorGeometriaAnalitica />;
      case 'exponential-equations':
        return <ResolvedorExponenciacao />;
      case 'matrix-add-sub':
        return <ResolvedorAddSubMatrizes />;
      case 'matrix-mult':
        return <ResolvedorMultiplicacaoMatrizes />;
      case 'matrix-determinant':
        return <ResolvedorDeterminanteMatrizes />;
      default:
        return <div className="p-4 text-gray-700 dark:text-gray-300">Em breve.</div>;
    }
  };

  // Fix para a função isSolverInLevel para lidar com o tipo de verificação corretamente
  const isSolverInLevel = (solverId: string, level: string): boolean => {
    if (level in educationalLevels) {
      return educationalLevels[level as keyof typeof educationalLevels].includes(solverId);
    }
    return false;
  };

  const renderSearchResults = () => {
    if (searchTerm.trim() === '') {
      return (
        <div className="mt-4 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
          Digite termos para buscar resolvedores...
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="mt-4 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
          Nenhum resultado encontrado para "{searchTerm}"
        </div>
      );
    }

    return (
      <div className="mt-2">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 px-4 py-2">Resultados da busca:</h3>
        <ul className="mt-2 space-y-1 pl-2">
          {searchResults.map(result => (
            <li key={result.id}>
              <button 
                className={`w-full text-left py-2 px-3 rounded-md ${
                  selectedSolver === result.id 
                    ? 'bg-primary-100 dark:bg-indigo-700 text-primary-700 dark:text-white font-medium shadow-sm' 
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => {
                  setSelectedSolver(result.id);
                  setSearchTerm(''); // Limpar a busca após a seleção
                }}
              >
                <div className="text-gray-800 dark:text-gray-200">
                  {result.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {result.category}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderBySubject = () => (
    <div>
      {Object.entries(solvers).map(([categoryId, category]) => (
        <div key={categoryId} className="mb-2">
          <button
            className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-left font-medium resolver-selector-button text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700`}
            onClick={() => toggleCategory(categoryId)}
          >
            <span className="flex items-center">
              {getIconComponent(category.icon)}
              <span className="ml-2">{category.name}</span>
            </span>
            {expandedCategories[categoryId] ? (
              <HiChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <HiChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          
          {expandedCategories[categoryId] && (
            <ul className="mt-1 space-y-1 pl-2">
              {category.solvers.map(solver => (
                <li key={solver.id}>
                  <button
                    className={`w-full text-left py-2 px-3 rounded-md ${
                      selectedSolver === solver.id 
                        ? 'bg-primary-100 dark:bg-indigo-700 text-primary-700 dark:text-white font-medium shadow-sm' 
                        : 'resolver-selector-button text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
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
      ))}
    </div>
  );

  // Fix para a função renderByLevel para lidar com o tipo de verificação corretamente
  const renderByLevel = () => (
    <div>
      {Object.entries(educationalLevels).map(([levelId, _levelData]) => (
        <div key={levelId} className="mb-2">
          <button
            className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-left font-medium resolver-selector-button text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700`}
            onClick={() => setSelectedLevel(selectedLevel === levelId ? null : levelId)}
          >
            <span className="flex items-center">
              <HiAcademicCap className="h-5 w-5" />
              <span className="ml-2">{
                levelId === 'elementary' ? 'Ensino Fundamental' : 
                levelId === 'high-school' ? 'Ensino Médio' : 
                levelId === 'college' ? 'Ensino Superior' : 
                'Outro'
              }</span>
            </span>
            {selectedLevel === levelId ? (
              <HiChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <HiChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          
          {selectedLevel === levelId && (
            <ul className="mt-1 space-y-1 pl-2">
              {Object.entries(solvers).flatMap(([_categoryId, category]) => 
                category.solvers.filter(solver => 
                  isSolverInLevel(solver.id, levelId)
                )
              ).map(solver => (
                <li key={solver.id}>
                  <button
                    className={`w-full text-left py-2 px-3 rounded-md ${
                      selectedSolver === solver.id 
                        ? 'bg-primary-100 dark:bg-indigo-700 text-primary-700 dark:text-white font-medium shadow-sm' 
                        : 'resolver-selector-button text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
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
      ))}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-80 md:min-h-[70vh] bg-theme-primary p-4 md:border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="flex bg-theme-secondary dark:bg-gray-800 rounded-lg p-1">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterMode === 'subject' 
                  ? 'bg-theme-container dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setFilterMode('subject')}
              data-filter="subject"
            >
              Por Assunto
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterMode === 'level' 
                  ? 'bg-theme-container dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setFilterMode('level')}
              data-filter="level"
            >
              Por Nível
            </button>
          </div>
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar resolvedor..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-theme-container dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.trim() !== '' && filterMode !== 'search') {
                setFilterMode('search');
              } else if (e.target.value.trim() === '' && filterMode === 'search') {
                setFilterMode('subject');
              }
            }}
          />
          <HiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="mt-4">
          {filterMode === 'subject' && renderBySubject()}
          {filterMode === 'level' && renderByLevel()}
          {filterMode === 'search' && renderSearchResults()}
        </div>
      </div>
        
      <div className="flex-1 p-4 bg-theme-primary dark:bg-gray-900">
        {renderSolver()}
      </div>
    </div>
  );
};

export default SolverPage;

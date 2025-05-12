import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import AdComponent from '../components/AdComponent';

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
import ResolvedorDeterminanteMatrizes from '../resolvedores/matrizes/ResolvedorMatrizesDeterminantes';
import ResolvedorTransposeMatrizes from '../resolvedores/matrizes/ResolvedorMatrizesTranspostas';
import ResolvedorInverseMatrizes from '../resolvedores/matrizes/ResolvedorMatrizesInversas';
import ResolvedorExpressoesAlgebricas from '../resolvedores/algebra/ResolvedorExpressoesAlgebricas';
import ResolvedorInequacoes from '../resolvedores/algebra/ResolvedorInequacoes';

interface SolverPageProps {
  initialCategory?: string | null;
}

const SolverPage: React.FC<SolverPageProps> = ({ initialCategory }) => {
  const { t } = useTranslation();
  const [selectedSolver, setSelectedSolver] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'arithmetic': false,
    'fractions': false,
    'algebra': false,
    'matrices': false,
    'trigonometry': false,
    'geometry': false,
    'statistics': false,
    'calculus': false
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

    Object.entries(solvers).forEach(([categoryId, categoryData]) => {
      categoryData.solvers.forEach(solver => {
        const normalizedSolverName = solver.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (normalizedSolverName.includes(normalizedSearchTerm)) {
          results.push({
            id: solver.id,
            name: solver.name,
            category: categoryId
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
        <h2 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-200">{t('solver_page.select_solver')}</h2>
        <p className="text-center max-w-md">
          {t('solver_page.select_solver_description')}
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
      case 'factorization':
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
      case 'matrix-transpose':
        return <ResolvedorTransposeMatrizes />;
      case 'matrix-inverse':
        return <ResolvedorInverseMatrizes />;
      case 'algebraic-expressions':
        return <ResolvedorExpressoesAlgebricas />;
      case 'inequalities':
        return <ResolvedorInequacoes />;
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
    if (!searchResults.length) {
      return (
        <div className="py-4 px-3 text-gray-500 dark:text-gray-400">
          {t('solver_page.search.no_results')}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {searchResults.map(result => (
          <div key={result.id} className="py-2">
            <button
              onClick={() => setSelectedSolver(result.id)}
              className={`w-full text-left py-2 px-3 rounded-md transition-colors duration-200
                ${selectedSolver === result.id ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-blue-100' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            >
              <span>{t(`solvers.${result.id.replace(/-/g, '_')}`)}</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('solver_page.search.in_category')} <span className="font-medium">{t(`categories.${result.category}`)}</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderBySubject = () => (
    <div className="space-y-4">
      {Object.entries(solvers).map(([categoryId, category]) => (
        <div key={categoryId} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleCategory(categoryId)}
            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              {getIconComponent(category.icon)}
              <span className="ml-2 font-medium text-gray-700 dark:text-gray-200">
                {t(`categories.${categoryId}`)}
              </span>
            </div>
            {expandedCategories[categoryId] ? <HiChevronUp className="h-5 w-5 text-gray-500" /> : <HiChevronDown className="h-5 w-5 text-gray-500" />}
          </button>
          
          {expandedCategories[categoryId] && (
            <div className="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
              {category.solvers.map(solver => (
                <button
                  key={solver.id}
                  onClick={() => setSelectedSolver(solver.id)}
                  className={`w-full text-left py-2 px-3 transition-colors
                    ${selectedSolver === solver.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-blue-100' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  {t(`solvers.${solver.id.replace(/-/g, '_')}`)}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderByLevel = () => (
    <div className="space-y-4">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setSelectedLevel('elementary')}
          className={`w-full flex items-center justify-between p-3 text-left transition-colors ${selectedLevel === 'elementary' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200'}`}
        >
          <div className="flex items-center">
            <HiAcademicCap className="h-5 w-5" />
            <span className="ml-2 font-medium">{t('solver_page.levels.elementary')}</span>
          </div>
        </button>
      </div>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setSelectedLevel('high-school')}
          className={`w-full flex items-center justify-between p-3 text-left transition-colors ${selectedLevel === 'high-school' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200'}`}
        >
          <div className="flex items-center">
            <HiAcademicCap className="h-5 w-5" />
            <span className="ml-2 font-medium">{t('solver_page.levels.high_school')}</span>
          </div>
        </button>
      </div>
      
      {selectedLevel && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mt-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 font-medium border-b border-gray-200 dark:border-gray-700">
            {selectedLevel === 'elementary' ? t('solver_page.levels.elementary') : t('solver_page.levels.high_school')}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {/* Listar os solvers disponíveis para o nível selecionado */}
            {Object.entries(solvers).flatMap(([categoryId, category]) => (
              category.solvers
                .filter(solver => isSolverInLevel(solver.id, selectedLevel))
                .map(solver => (
                  <button
                    key={solver.id}
                    onClick={() => setSelectedSolver(solver.id)}
                    className={`w-full text-left py-2 px-3 transition-colors
                      ${selectedSolver === solver.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-blue-100' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <div className="flex items-center">
                      <span>{t(`solvers.${solver.id.replace(/-/g, '_')}`)}</span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({t(`categories.${categoryId}`)})</span>
                    </div>
                  </button>
                ))
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="mb-4">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setFilterMode('subject')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  filterMode === 'subject'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {t('solver_page.filter_modes.by_subject')}
              </button>
              <button
                onClick={() => setFilterMode('level')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  filterMode === 'level'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {t('solver_page.filter_modes.by_level')}
              </button>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('solver_page.search.placeholder')}
                  className="w-full p-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value) {
                      setFilterMode('search');
                    } else if (filterMode === 'search') {
                      setFilterMode('subject');
                    }
                  }}
                />
                <HiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {filterMode === 'search' 
              ? renderSearchResults() 
              : filterMode === 'level' 
                ? renderByLevel() 
                : renderBySubject()}
          </div>
          
          <AdComponent adSlot="7894561230" />
        </div>
      </div>
      
      <div className="md:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {renderSolver()}
        </div>
        
        {selectedSolver && <AdComponent adSlot="3216549870" style={{ marginTop: '20px' }} />}
      </div>
    </div>
  );
};

export default SolverPage;

import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HiCalculator, 
  HiBookOpen, 
  HiTrendingUp, 
  HiAcademicCap, 
  HiChartPie, 
  HiCode, 
  HiChartBar,
  HiViewGrid,
  HiUserGroup,
  HiOutlineAdjustments,
  HiTable
} from 'react-icons/hi';
import AdComponent from '../components/AdComponent';

interface HomePageProps {
  onSelectSolver: (category?: string) => void;
  scrollToSobre?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectSolver, scrollToSobre }) => {
  const { t } = useTranslation();
  const sobreRef = useRef<HTMLDivElement>(null);

  // Scroll para a seção "Sobre" se o flag estiver definido
  React.useEffect(() => {
    if (scrollToSobre && sobreRef.current) {
      sobreRef.current.scrollIntoView({ behavior: 'smooth' });
      // Atualiza o hash da URL sem recarregar a página
      window.history.pushState(null, '', '#sobre');
    }
  }, [scrollToSobre]);

  return (
    <div className="space-y-12">
      <section className="text-center py-12 px-4 bg-gradient-to-r from-primary-500 to-secondary-600 dark:from-primary-600 dark:to-secondary-700 rounded-xl text-white shadow-lg border border-transparent dark:border-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-0 dark:opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">{t('homepage.hero.title')}</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            {t('homepage.hero.subtitle')}
          </p>
          <button 
            onClick={() => onSelectSolver()}
            className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
          >
            {t('buttons.start_solving')}
          </button>
        </div>
      </section>

      <AdComponent adSlot="1234567890" />

      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('homepage.why_use.title')}</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full mb-4">
              <HiCalculator className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('homepage.why_use.various_problems.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('homepage.why_use.various_problems.description')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full mb-4">
              <HiBookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('homepage.why_use.step_by_step.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('homepage.why_use.step_by_step.description')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full mb-4">
              <HiTrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('homepage.why_use.improve_skills.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('homepage.why_use.improve_skills.description')}
            </p>
          </div>
        </div>
      </section>

      <AdComponent adSlot="0987654321" />

      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">{t('homepage.categories.title')}</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiCalculator className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">{t('homepage.categories.arithmetic.title')}</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {(t('homepage.categories.arithmetic.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              onClick={() => onSelectSolver('arithmetic')}
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {t('homepage.categories.arithmetic.explore')}
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiChartPie className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">{t('homepage.categories.fractions.title')}</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {(t('homepage.categories.fractions.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              onClick={() => onSelectSolver('fractions')}
              className="bg-white text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {t('homepage.categories.fractions.explore')}
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiCode className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">{t('homepage.categories.algebra.title')}</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {(t('homepage.categories.algebra.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              onClick={() => onSelectSolver('algebra')}
              className="bg-white text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {t('homepage.categories.algebra.explore')}
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiTrendingUp className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">{t('homepage.categories.trigonometry.title')}</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {(t('homepage.categories.trigonometry.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              onClick={() => onSelectSolver('trigonometria')}
              className="bg-white text-yellow-600 hover:bg-yellow-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {t('homepage.categories.trigonometry.explore')}
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiChartBar className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">{t('homepage.categories.statistics.title')}</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {(t('homepage.categories.statistics.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              onClick={() => onSelectSolver('estatistica')}
              className="bg-white text-pink-600 hover:bg-pink-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {t('homepage.categories.statistics.explore')}
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiTrendingUp className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">{t('homepage.categories.calculus.title')}</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {(t('homepage.categories.calculus.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              onClick={() => onSelectSolver('calculo')}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {t('homepage.categories.calculus.explore')}
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiViewGrid className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">{t('homepage.categories.geometry.title')}</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {(t('homepage.categories.geometry.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              onClick={() => onSelectSolver('geometria')}
              className="bg-white text-teal-600 hover:bg-teal-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {t('homepage.categories.geometry.explore')}
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiTable className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">{t('homepage.categories.matrices.title')}</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {(t('homepage.categories.matrices.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              onClick={() => onSelectSolver('matrizes')}
              className="bg-white text-cyan-600 hover:bg-cyan-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {t('homepage.categories.matrices.explore')}
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiAcademicCap className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">{t('homepage.categories.by_level.title')}</h3>
            </div>
            <p className="mb-4">{t('homepage.categories.by_level.description')}</p>
            <button 
              onClick={() => {
                onSelectSolver();
                // Define o modo de filtro para nível na próxima renderização
                setTimeout(() => {
                  const levelButton = document.querySelector('[data-filter="level"]');
                  if (levelButton instanceof HTMLElement) {
                    levelButton.click();
                  }
                }, 100);
              }}
              className="bg-white text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {t('homepage.categories.by_level.explore')}
            </button>
          </div>
        </div>
      </section>
      
      {/* Sobre Section */}
      <section ref={sobreRef} className="py-12">
        <div className="text-center mb-12 bg-gradient-to-r from-primary-500 to-secondary-600 dark:from-primary-600 dark:to-secondary-700 py-10 px-4 rounded-xl text-white shadow-lg border border-transparent dark:border-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-0 dark:opacity-20"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-md">{t('homepage.about.title')}</h1>
            <p className="text-xl max-w-3xl mx-auto drop-shadow-md">
              {t('homepage.about.subtitle')}
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 border-t-4 border-primary-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-primary-700 dark:text-primary-300">
              <HiOutlineAdjustments className="h-7 w-7 mr-3 text-primary-600 dark:text-primary-400" />
              {t('homepage.about.main_objective.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {t('homepage.about.main_objective.description1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('homepage.about.main_objective.description2')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 border-t-4 border-secondary-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-secondary-700 dark:text-secondary-300">
              <HiBookOpen className="h-7 w-7 mr-3 text-secondary-600 dark:text-secondary-400" />
              {t('homepage.about.educational_philosophy.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {t('homepage.about.educational_philosophy.description1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {t('homepage.about.educational_philosophy.description2')}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 mb-8 border-l-4 border-tertiary-500">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-tertiary-700 dark:text-tertiary-300">
            <HiUserGroup className="h-7 w-7 mr-3 text-tertiary-600 dark:text-tertiary-400" />
            {t('homepage.about.target_audience.title')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {t('homepage.about.target_audience.description')}
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4 pl-2">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><span className="font-medium text-primary-800 dark:text-primary-200">{t('homepage.about.target_audience.elementary_students')}</span></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><span className="font-medium text-primary-800 dark:text-primary-200">{t('homepage.about.target_audience.high_school_students')}</span></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><span className="font-medium text-primary-800 dark:text-primary-200">{t('homepage.about.target_audience.parents')}</span></span>
                </li>
              </ul>
            </div>
            
            <div>
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4 pl-2 mt-10 md:mt-0">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><span className="font-medium text-primary-800 dark:text-primary-200">{t('homepage.about.target_audience.adults')}</span></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><span className="font-medium text-primary-800 dark:text-primary-200">{t('homepage.about.target_audience.anyone')}</span></span>
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                {t('homepage.about.target_audience.conclusion')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
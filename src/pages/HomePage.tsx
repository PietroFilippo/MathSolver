import React, { useRef } from 'react';
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

interface HomePageProps {
  onSelectSolver: (category?: string) => void;
  scrollToSobre?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectSolver, scrollToSobre }) => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Masterize Matemática com o MathSolver</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            Resolva problemas matemáticos de forma fácil e eficiente com o MathSolver
          </p>
          <button 
            onClick={() => onSelectSolver()}
            className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
          >
            Comece a resolver agora
          </button>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Por que usar o MathSolver?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full mb-4">
              <HiCalculator className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Vários Tipos de Problemas</h3>
            <p className="text-gray-600 dark:text-gray-300">
              De aritmética básica a álgebra avançada
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full mb-4">
              <HiBookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Soluções Passo a Passo</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Não ganhe apenas uma resposta - entenda como resolver você mesmo na próxima vez
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full mb-4">
              <HiTrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Melhore suas Habilidades</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Construa confiança e domínio sobre os conceitos matemáticos através da prática e compreensão
            </p>
          </div>
        </div>
      </section>
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Categorias de Problemas</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiCalculator className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Aritmética</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Porcentagem</li>
              <li>Proporções</li>
              <li>MMC e MDC</li>
              <li>Fatorização</li>
            </ul>
            <button 
              onClick={() => onSelectSolver('arithmetic')}
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Explorar Aritmética
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiChartPie className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Frações</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Adição e Subtração</li>
              <li>Multiplicação e Divisão</li>
              <li>Simplificação</li>
              <li>Frações Mistas</li>
            </ul>
            <button 
              onClick={() => onSelectSolver('fractions')}
              className="bg-white text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Explorar Frações
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiCode className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Álgebra</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Equações de Primeiro Grau</li>
              <li>Equações Quadráticas</li>
              <li>Sistemas Lineares</li>
              <li>Logaritmos</li>
            </ul>
            <button 
              onClick={() => onSelectSolver('algebra')}
              className="bg-white text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Explorar Álgebra
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiTrendingUp className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Trigonometria</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Funções Trigonométricas</li>
              <li>Equações Trigonométricas</li>
              <li>Gráficos Trigonométricos</li>
            </ul>
            <button 
              onClick={() => onSelectSolver('trigonometria')}
              className="bg-white text-yellow-600 hover:bg-yellow-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Explorar Trigonometria
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiChartBar className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Estatística</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Média, Moda e Mediana</li>
              <li>Média Ponderada</li>
              <li>Medidas de Dispersão</li>
              <li>Coeficiente de Variação</li>
            </ul>
            <button 
              onClick={() => onSelectSolver('estatistica')}
              className="bg-white text-pink-600 hover:bg-pink-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Explorar Estatística
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiTrendingUp className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Cálculo</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Derivadas</li>
              <li>Integrais</li>
              <li>Limites</li>
            </ul>
            <button 
              onClick={() => onSelectSolver('calculo')}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Explorar Cálculo
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiViewGrid className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Geometria</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Área de Figuras Planas</li>
              <li>Perímetros</li>
              <li>Volume de Sólidos</li>
            </ul>
            <button 
              onClick={() => onSelectSolver('geometria')}
              className="bg-white text-teal-600 hover:bg-teal-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Explorar Geometria
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiTable className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Matrizes</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Adição e Subtração</li>
              <li>Multiplicação</li>
              <li>Determinante</li>
              <li>Matriz Transposta</li>
            </ul>
            <button 
              onClick={() => onSelectSolver('matrizes')}
              className="bg-white text-cyan-600 hover:bg-cyan-50 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Explorar Matrizes
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiAcademicCap className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Por Nível Escolar</h3>
            </div>
            <p className="mb-4">Filtre problemas por nível escolar para encontrar exercícios apropriados para sua série.</p>
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
              Ver Níveis Escolares
            </button>
          </div>
        </div>
      </section>
      
      {/* Sobre Section */}
      <section ref={sobreRef} className="py-12">
        <div className="text-center mb-12 bg-gradient-to-r from-primary-500 to-secondary-600 dark:from-primary-600 dark:to-secondary-700 py-10 px-4 rounded-xl text-white shadow-lg border border-transparent dark:border-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-0 dark:opacity-20"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-md">Sobre o MathSolver</h1>
            <p className="text-xl max-w-3xl mx-auto drop-shadow-md">
              Tornar a matemática acessível e compreensível para todos
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 border-t-4 border-primary-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-primary-700 dark:text-primary-300">
              <HiOutlineAdjustments className="h-7 w-7 mr-3 text-primary-600 dark:text-primary-400" />
              Objetivo Principal
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              O MathSolver foi criado com uma missão simples: tornar a matemática acessível, 
              compreensível e menos intimidadora para pessoas de todas as idades.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              O principal objetivo não é apenas fornecer respostas, mas fomentar a verdadeira compreensão dos conceitos 
              matemáticos. Ao oferecer explicações passo a passo ao lado das soluções, os alunos aprendem a desenvolver 
              habilidades de resolução de problemas que os acompanharão durante sua jornada acadêmica.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 border-t-4 border-secondary-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-secondary-700 dark:text-secondary-300">
              <HiBookOpen className="h-7 w-7 mr-3 text-secondary-600 dark:text-secondary-400" />
              Filosofia Educacional
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              No MathSolver, entender o "porquê" por trás dos processos matemáticos é tão importante 
              quanto saber o "como". Essa abordagem enfatiza a compreensão conceitual juntamente com a fluência 
              procedimental.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              As explicações são projetadas para ser claras, concisas e acessíveis a pessoas de diferentes níveis 
              de proficiência matemática.
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 mb-8 border-l-4 border-tertiary-500">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-tertiary-700 dark:text-tertiary-300">
            <HiUserGroup className="h-7 w-7 mr-3 text-tertiary-600 dark:text-tertiary-400" />
            Para Quem É Destinado
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                O MathSolver é destinado a aqueles que estão interessados em aprender e dominar conceitos matemáticos:
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4 pl-2">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><span className="font-medium text-primary-800 dark:text-primary-200">Estudantes do ensino fundamental e médio</span> aprendendo conceitos matemáticos fundamentais</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><span className="font-medium text-primary-800 dark:text-primary-200">Estudantes do ensino médio</span> enfrentando tópicos mais avançados como álgebra, geometria e cálculo</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><span className="font-medium text-primary-800 dark:text-primary-200">Pais</span> ajudando seus filhos com deveres de casa</span>
                </li>
              </ul>
            </div>
            
            <div>
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4 pl-2 mt-10 md:mt-0">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><span className="font-medium text-primary-800 dark:text-primary-200">Adultos</span> revisando seus conhecimentos matemáticos</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><span className="font-medium text-primary-800 dark:text-primary-200">Qualquer pessoa</span> com interesse em melhorar suas habilidades matemáticas</span>
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Seja você alguém com dificuldades em um problema específico ou alguém que deseja fortalecer sua base 
                matemática geral.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
import React from 'react';
import { 
  HiCalculator, 
  HiBookOpen, 
  HiTrendingUp, 
  HiAcademicCap, 
  HiChartPie, 
  HiCode, 
  HiChartBar,
  HiViewGrid
} from 'react-icons/hi';

interface HomePageProps {
  onSelectSolver: (category?: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectSolver }) => {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Masterize Matemática com o MathSolver</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Resolva problemas matemáticos de forma fácil e eficiente com o MathSolver
        </p>
        <button 
          onClick={() => onSelectSolver()}
          className="bg-white text-indigo-600 hover:bg-indigo-100 font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
        >
          Comece a resolver agora
        </button>
      </section>

      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-12">Por que usar o MathSolver?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-full mb-4">
              <HiCalculator className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Vários Tipos de Problemas</h3>
            <p className="text-gray-600">
              De aritmética básica a álgebra avançada e cálculo - temos você coberto
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-full mb-4">
              <HiBookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Soluções Passo a Passo</h3>
            <p className="text-gray-600">
              Não ganhe apenas uma resposta - entenda como resolver você mesmo na próxima vez
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-full mb-4">
              <HiTrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Melhore suas Habilidades</h3>
            <p className="text-gray-600">
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
              <li>Média Aritmética</li>
              <li>Proporções</li>
              <li>MMC e MDC</li>
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
              <li>Expressões Algébricas</li>
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
              <li>Tipos de Médias</li>
              <li>Moda e Mediana</li>
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
        
        <div className="grid md:grid-cols-2 gap-6">
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
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center mb-4">
              <HiAcademicCap className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Por Nível Escolar</h3>
            </div>
            <p className="mb-4">Filtre problemas por nível escolar para encontrar exercícios apropriados para sua série.</p>
            <button 
              onClick={() => {
                onSelectSolver();
                // Set filter mode to level in the next render cycle
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
    </div>
  );
};

export default HomePage;
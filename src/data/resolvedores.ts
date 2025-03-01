// data/solvers.ts
export const solvers = {
    'arithmetic': {
      name: 'Aritmética',
      icon: 'Calculator',
      solvers: [
        { id: 'percentage', name: 'Porcentagem' },
        { id: 'arithmetic-mean', name: 'Média Aritmética' },
        { id: 'proportion', name: 'Proporções' }
      ]
    },
    'fractions': {
      name: 'Frações',
      icon: 'PieChart',
      solvers: [
        { id: 'fraction-add-sub', name: 'Adição e Subtração de Frações' },
        { id: 'fraction-mult-div', name: 'Multiplicação e Divisão de Frações' }
      ]
    },
    'algebra': {
      name: 'Álgebra',
      icon: 'Functions',
      solvers: [
        { id: 'linear-equation', name: 'Equações de Primeiro Grau' },
        { id: 'quadratic-equation', name: 'Equações Quadráticas' },
        { id: 'linear-system', name: 'Sistemas Lineares' }
      ]
    },
    'advanced': {
      name: 'Matemática Avançada',
      icon: 'TrendingUp',
      solvers: [
        { id: 'trigonometric', name: 'Funções Trigonométricas' },
        { id: 'logarithm', name: 'Logaritmos' }
      ]
    },
    // Categorias futuras já preparadas
    'geometry': {
      name: 'Geometria',
      icon: 'Square',
      solvers: [] // A ser preenchido futuramente
    },
    'statistics': {
      name: 'Estatística',
      icon: 'BarChart',
      solvers: [] // A ser preenchido futuramente
    }
  };
  
  // Mapeamento dos solvers para nível educacional (para filtros futuros)
  export const educationalLevels = {
    'elementary': ['percentage', 'arithmetic-mean', 'proportion', 'fraction-add-sub', 'fraction-mult-div'],
    'high-school': ['linear-equation', 'quadratic-equation', 'linear-system', 'trigonometric', 'logarithm']
  };
  
  // Interface para uso com TypeScript
  export interface Solver {
    id: string;
    name: string;
  }
  
  export interface SolverCategory {
    name: string;
    icon: string;
    solvers: Solver[];
  }
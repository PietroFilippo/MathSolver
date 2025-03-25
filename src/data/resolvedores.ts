// data/solvers.ts
export const solvers = {
    'arithmetic': {
      name: 'Aritmética',
      icon: 'Calculator',
      solvers: [
        { id: 'percentage', name: 'Porcentagem' },
        { id: 'proportion', name: 'Proporções' },
        { id: 'mmc-mdc', name: 'MMC e MDC' },
        { id: 'fatorizacao', name: 'Fatoração em Primos' }
      ]
    },
    'fractions': {
      name: 'Frações',
      icon: 'PieChart',
      solvers: [
        { id: 'fraction-add-sub', name: 'Adição e Subtração de Frações' },
        { id: 'fraction-mult-div', name: 'Multiplicação e Divisão de Frações' },
        { id: 'fraction-simplification', name: 'Simplificação de Frações' },
        { id: 'mixed-fractions', name: 'Frações Mistas' }
      ]
    },
    'algebra': {
      name: 'Álgebra',
      icon: 'Functions',
      solvers: [
        { id: 'linear-equation', name: 'Equações de Primeiro Grau' },
        { id: 'quadratic-equation', name: 'Equações Quadráticas' },
        { id: 'linear-system', name: 'Sistemas Lineares' },
        { id: 'logarithm', name: 'Logaritmos' },
        { id: 'algebraic-expressions', name: 'Expressões Algébricas' },
        { id: 'inequations', name: 'Inequações' },
        { id: 'exponential-equations', name: 'Equações Exponenciais' }
      ]
    },
    'matrizes': {
      name: 'Matrizes',
      icon: 'Table',
      solvers: [
        { id: 'matrix-add-sub', name: 'Adição e Subtração de Matrizes' },
        { id: 'matrix-mult', name: 'Multiplicação de Matrizes' },
        { id: 'matrix-determinant', name: 'Determinante de Matrizes' },
        { id: 'matrix-transpose', name: 'Matriz Transposta (Em breve)' },
        { id: 'matrix-inverse', name: 'Matriz Inversa (Em breve)' }
      ]
    },
    'trigonometria': {
      name: 'Trigonometria',
      icon: 'TrendingUp',
      solvers: [
        { id: 'trigonometric-functions', name: 'Funções Trigonométricas' },
        { id: 'trigonometric-equations', name: 'Equações Trigonométricas' },
        { id: 'trigonometric-graphs', name: 'Gráficos Trigonométricos' }
      ]
    },
    'geometria': {
      name: 'Geometria',
      icon: 'Square',
      solvers: [
        { id: 'plane-figures-area', name: 'Área de Figuras Planas' },
        { id: 'perimeters', name: 'Perímetros de Figuras Planas' },
        { id: 'solid-volumes', name: 'Volume de Sólidos' },
        { id: 'surface-solids', name: 'Superfície de Sólidos' },
        { id: 'coordinate-geometry', name: 'Geometria de Coordenadas' },
        { id: 'vector-geometry', name: 'Geometria Vetorial' },
        { id: 'analytic-geometry', name: 'Geometria Analítica' }
      ]
    },
    'estatistica': {
      name: 'Estatística',
      icon: 'BarChart',
      solvers: [
        { id: 'mean-mode-median', name: 'Média, Moda e Mediana' },
        { id: 'weighted-mean', name: 'Média Ponderada' },
        { id: 'dispersions', name: 'Dispersões' },
        { id: 'variation-coefficient', name: 'Coeficiente de Variação' }
      ]
    },
    'calculo': {
      name: 'Cálculo',
      icon: 'ChartLine',
      solvers: [
        { id: 'derivatives', name: 'Derivadas' },
        { id: 'integrals', name: 'Integrais' }
      ]
    }
  };
  
  // Mapeamento dos solvers para nível educacional (para filtros futuros)
  export const educationalLevels = {
    'elementary': [
      // Aritmética
      'percentage', 'arithmetic-mean', 'proportion', 'mmc-mdc', 'fatorizacao',
      // Frações
      'fraction-add-sub', 'fraction-mult-div', 'fraction-simplification', 'mixed-fractions',
      // Estatística básica
      'mean-mode-median',
      // Geometria básica
      'plane-figures-area', 'perimeters'
    ],
    'high-school': [
      // Álgebra
      'linear-equation', 'quadratic-equation', 'linear-system', 'logarithm', 
      'algebraic-expressions', 'inequations',
      // Matrizes
      'matrix-add-sub', 'matrix-mult', 'matrix-determinant', 'matrix-transpose', 'matrix-inverse',
      // Trigonometria
      'trigonometric-functions', 'trigonometric-equations', 'trigonometric-graphs',
      // Geometria avançada
      'solid-volumes', 'surface-solids', 'coordinate-geometry', 'vector-geometry',
      // Cálculo
      'derivatives', 'integrals', 'limits'
    ]
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
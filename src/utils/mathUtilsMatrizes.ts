// ===================================================
// ========== FUNÇÕES PARA MATRIZ =====================
// ===================================================
import { roundToDecimals } from './mathUtils';

// Verifica se uma matriz é válida (todas as linhas têm o mesmo número de colunas)
export const isValidMatrix = (matrix: number[][]): boolean => {
  if (matrix.length === 0) return false;
  
  const numCols = matrix[0].length;
  return matrix.every(row => row.length === numCols);
};

// Verifica se duas matrizes têm as mesmas dimensões
export const haveSameDimensions = (matrixA: number[][], matrixB: number[][]): boolean => {
  if (!isValidMatrix(matrixA) || !isValidMatrix(matrixB)) {
    return false;
  }
  
  return matrixA.length === matrixB.length && matrixA[0].length === matrixB[0].length;
};

// Formata uma matriz para exibição
export const formatMatrix = (matrix: number[][], decimals: number = 2): string => {
  if (!isValidMatrix(matrix)) {
    return 'Matriz inválida';
  }
  
  return matrix
    .map(row => 
      row.map(val => roundToDecimals(val, decimals).toString()).join(' ')
    )
    .join('\n');
};

// Formata uma matriz para exibição em HTML
export const formatMatrixHTML = (matrix: number[][], decimals: number = 2): string => {
  if (!isValidMatrix(matrix)) {
    return 'Matriz inválida';
  }
  
  return `<table class="matrix-table">
    <tbody>
      ${matrix.map(row => `
        <tr>
          ${row.map(val => `<td>${roundToDecimals(val, decimals)}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>`;
};

// Adiciona duas matrizes
export const addMatrices = (matrixA: number[][], matrixB: number[][]): number[][] | null => {
  if (!haveSameDimensions(matrixA, matrixB)) {
    return null;
  }
  
  const result: number[][] = [];
  
  for (let i = 0; i < matrixA.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < matrixA[0].length; j++) {
      row.push(matrixA[i][j] + matrixB[i][j]);
    }
    result.push(row);
  }
  
  return result;
};

// Subtrai duas matrizes (A - B)
export const subtractMatrices = (matrixA: number[][], matrixB: number[][]): number[][] | null => {
  if (!haveSameDimensions(matrixA, matrixB)) {
    return null;
  }
  
  const result: number[][] = [];
  
  for (let i = 0; i < matrixA.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < matrixA[0].length; j++) {
      row.push(matrixA[i][j] - matrixB[i][j]);
    }
    result.push(row);
  }
  
  return result;
};

// Converte uma string em uma matriz de números
export const parseMatrixFromString = (matrixStr: string): number[][] | null => {
  try {
    // Limpa espaços extras e divide por linhas (separados por ;)
    const rows = matrixStr.trim().split(';');
    
    if (rows.length === 0 || rows[0].trim() === '') {
      return null;
    }
    
    const matrix: number[][] = rows.map(row => {
      // Divide a linha em valores e converte para números
      const values = row.trim().split(/\s+/).map(val => parseFloat(val));
      
      // Verifica se todos os valores são números válidos
      if (values.some(isNaN)) {
        throw new Error('Matriz contém valores inválidos');
      }
      
      return values;
    });
    
    // Verifica se todas as linhas têm o mesmo número de colunas
    if (!isValidMatrix(matrix)) {
      throw new Error('As linhas da matriz não têm o mesmo número de colunas');
    }
    
    return matrix;
  } catch (error) {
    console.error('Erro ao analisar matriz:', error);
    return null;
  }
};

// Gera uma string de representação de matriz para o formato de entrada
export const matrixToInputString = (matrix: number[][]): string => {
  return matrix.map(row => row.join(' ')).join('; ');
};

// ===================================================
// ============ EXEMPLOS DE MATRIZES ================
// ===================================================

export interface MatrizExample {
  matrixA: number[][];
  matrixB: number[][];
  description: string;
}

export const getMatrixAddSubExamples = (): MatrizExample[] => {
  return [
    {
      matrixA: [
        [1, 2],
        [3, 4]
      ],
      matrixB: [
        [5, 6],
        [7, 8]
      ],
      description: '2×2 Inteiros'
    },
    {
      matrixA: [
        [1.5, 2.5, 3.5],
        [4.5, 5.5, 6.5]
      ],
      matrixB: [
        [0.5, 1.5, 2.5],
        [3.5, 4.5, 5.5]
      ],
      description: '2×3 Decimais'
    },
    {
      matrixA: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      matrixB: [
        [2, 3, 4],
        [5, 6, 7],
        [8, 9, 10]
      ],
      description: '3×3 com Identidade'
    },
    {
      matrixA: [
        [-1, -2],
        [-3, -4]
      ],
      matrixB: [
        [1, 2],
        [3, 4]
      ],
      description: '2×2 Negativos'
    },
    {
      matrixA: [
        [10, 20, 30, 40],
        [50, 60, 70, 80]
      ],
      matrixB: [
        [5, 10, 15, 20],
        [25, 30, 35, 40]
      ],
      description: '2×4 Grandes'
    }
  ];
};

// Multiplica duas matrizes (A × B)
export const multiplyMatrices = (matrixA: number[][], matrixB: number[][]): number[][] | null => {
  // Verifica se as dimensões são compatíveis para multiplicação
  if (matrixA[0].length !== matrixB.length) {
    return null;
  }
  
  const result: number[][] = [];
  const rowsA = matrixA.length;
  const colsB = matrixB[0].length;
  const common = matrixB.length; // Número de colunas de A / linhas de B
  
  for (let i = 0; i < rowsA; i++) {
    const row: number[] = [];
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < common; k++) {
        sum += matrixA[i][k] * matrixB[k][j];
      }
      row.push(sum);
    }
    result.push(row);
  }
  
  return result;
};

// Multiplica uma matriz por um escalar
export const multiplyMatrixByScalar = (matrix: number[][], scalar: number): number[][] => {
  const result: number[][] = [];
  
  for (let i = 0; i < matrix.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < matrix[0].length; j++) {
      row.push(matrix[i][j] * scalar);
    }
    result.push(row);
  }
  
  return result;
};

// Verifica se as dimensões são compatíveis para multiplicação de matrizes
export const isValidForMultiplication = (matrixA: number[][], matrixB: number[][]): boolean => {
  return matrixA[0].length === matrixB.length;
};

// Interface para exemplos de multiplicação de matrizes
export interface MatrizMultiplicationExample {
  matrixA: number[][];
  matrixB: number[][];
  description: string;
}

// Interface para exemplos de multiplicação por escalar
export interface ScalarMultiplicationExample {
  matrix: number[][];
  scalar: number;
  description: string;
}

// Retorna exemplos de multiplicação de matrizes
export const getMatrixMultiplicationExamples = (): MatrizMultiplicationExample[] => {
  return [
    {
      matrixA: [
        [1, 2],
        [3, 4]
      ],
      matrixB: [
        [2, 0],
        [1, 3]
      ],
      description: 'Matrizes 2×2'
    },
    {
      matrixA: [
        [1, 0, 2],
        [0, 3, -1]
      ],
      matrixB: [
        [3, 1],
        [2, 0],
        [1, 2]
      ],
      description: 'Matrizes 2×3 e 3×2'
    },
    {
      matrixA: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      matrixB: [
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12]
      ],
      description: 'Matriz identidade'
    },
    {
      matrixA: [
        [2, 3],
        [1, 4],
        [5, 6]
      ],
      matrixB: [
        [7, 8, 9],
        [10, 11, 12]
      ],
      description: 'Matrizes 3×2 e 2×3'
    }
  ];
};

// Retorna exemplos de multiplicação por escalar
export const getScalarMultiplicationExamples = (): ScalarMultiplicationExample[] => {
  return [
    {
      matrix: [
        [1, 2],
        [3, 4]
      ],
      scalar: 2,
      description: 'Matriz 2×2 por 2'
    },
    {
      matrix: [
        [1, -2, 3],
        [-4, 5, -6]
      ],
      scalar: -1,
      description: 'Matriz 2×3 por -1'
    },
    {
      matrix: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      scalar: 3,
      description: 'Matriz identidade por 3'
    },
    {
      matrix: [
        [2.5, 1.5],
        [3.5, 4.5]
      ],
      scalar: 2,
      description: 'Matriz com decimais'
    }
  ];
}; 
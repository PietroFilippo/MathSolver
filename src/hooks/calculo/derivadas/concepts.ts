import { DerivadaConceito } from './types';

// Conceito matemático das derivadas
export const derivativesMathematicalConcept: DerivadaConceito = {
  titulo: "Conceitos Fundamentais de Derivadas",
  descricao: "Uma derivada representa a taxa de variação instantânea de uma função. Geometricamente, representa a inclinação da reta tangente à curva da função em um determinado ponto.",
  categorias: [
    {
      nome: "Regras Básicas",
      regras: [
        {
          nome: "Derivada de Constante",
          formula: "d/dx(c) = 0",
          explicacao: "A derivada de qualquer constante é sempre zero, pois constantes não variam quando x varia.",
          exemplo: "d/dx(5) = 0",
          corDestaque: "blue"
        },
        {
          nome: "Derivada da Variável",
          formula: "d/dx(x) = 1",
          explicacao: "A derivada da variável em relação a ela mesma é sempre 1.",
          exemplo: "d/dx(x) = 1",
          corDestaque: "blue"
        },
        {
          nome: "Derivada da Potência",
          formula: "d/dx(x^n) = n·x^(n-1)",
          explicacao: "Para derivar uma potência, multiplicamos pelo expoente e reduzimos o expoente em 1.",
          exemplo: "d/dx(x³) = 3x²",
          corDestaque: "blue"
        },
        {
          nome: "Derivada da Multiplicação por Constante",
          formula: "d/dx(c·f(x)) = c·f'(x)",
          explicacao: "Constantes multiplicativas podem ser movidas para fora da derivada.",
          exemplo: "d/dx(5x²) = 5·d/dx(x²) = 5·2x = 10x",
          corDestaque: "blue"
        }
      ]
    },
    {
      nome: "Operações Algébricas",
      regras: [
        {
          nome: "Regra da Soma",
          formula: "d/dx[f(x) + g(x)] = f'(x) + g'(x)",
          explicacao: "A derivada de uma soma é igual à soma das derivadas.",
          exemplo: "d/dx(x² + sen(x)) = d/dx(x²) + d/dx(sen(x)) = 2x + cos(x)",
          corDestaque: "green"
        },
        {
          nome: "Regra da Diferença",
          formula: "d/dx[f(x) - g(x)] = f'(x) - g'(x)",
          explicacao: "A derivada de uma diferença é igual à diferença das derivadas.",
          exemplo: "d/dx(x³ - cos(x)) = d/dx(x³) - d/dx(cos(x)) = 3x² - (-sen(x)) = 3x² + sen(x)",
          corDestaque: "green"
        },
        {
          nome: "Regra do Produto",
          formula: "d/dx[f(x)·g(x)] = f'(x)·g(x) + f(x)·g'(x)",
          explicacao: "A derivada do produto é a derivada do primeiro multiplicada pelo segundo, mais o primeiro multiplicado pela derivada do segundo.",
          exemplo: "d/dx(x·sen(x)) = d/dx(x)·sen(x) + x·d/dx(sen(x)) = 1·sen(x) + x·cos(x) = sen(x) + x·cos(x)",
          corDestaque: "purple"
        },
        {
          nome: "Regra do Quociente",
          formula: "d/dx[f(x)/g(x)] = [f'(x)·g(x) - f(x)·g'(x)]/[g(x)]²",
          explicacao: "A derivada do quociente segue esta fórmula. Observe que o denominador é elevado ao quadrado.",
          exemplo: "d/dx(x²/cos(x)) = [d/dx(x²)·cos(x) - x²·d/dx(cos(x))]/[cos(x)]² = [2x·cos(x) - x²·(-sen(x))]/[cos(x)]² = [2x·cos(x) + x²·sen(x)]/[cos(x)]²",
          corDestaque: "purple"
        }
      ]
    },
    {
      nome: "Regra da Cadeia",
      regras: [
        {
          nome: "Regra da Cadeia (Função Composta)",
          formula: "d/dx[f(g(x))] = f'(g(x)) · g'(x)",
          explicacao: "A derivada de uma função composta é a derivada da função externa calculada no ponto da função interna, multiplicada pela derivada da função interna.",
          exemplo: "d/dx(sen(x²)) = cos(x²) · d/dx(x²) = cos(x²) · 2x = 2x·cos(x²)",
          corDestaque: "amber"
        }
      ]
    },
    {
      nome: "Funções Trigonométricas",
      regras: [
        {
          nome: "Derivada do Seno",
          formula: "d/dx[sen(x)] = cos(x)",
          explicacao: "A derivada do seno é o cosseno.",
          exemplo: "d/dx(sen(2x)) = cos(2x) · d/dx(2x) = cos(2x) · 2 = 2cos(2x)",
          corDestaque: "cyan"
        },
        {
          nome: "Derivada do Cosseno",
          formula: "d/dx[cos(x)] = -sen(x)",
          explicacao: "A derivada do cosseno é o negativo do seno.",
          exemplo: "d/dx(cos(x²)) = -sen(x²) · d/dx(x²) = -sen(x²) · 2x = -2x·sen(x²)",
          corDestaque: "cyan"
        },
        {
          nome: "Derivada da Tangente",
          formula: "d/dx[tan(x)] = sec²(x)",
          explicacao: "A derivada da tangente é a secante ao quadrado, que também pode ser escrita como 1/[cos²(x)].",
          exemplo: "d/dx(tan(3x)) = sec²(3x) · d/dx(3x) = sec²(3x) · 3 = 3·sec²(3x)",
          corDestaque: "cyan"
        }
      ]
    },
    {
      nome: "Funções Exponenciais e Logarítmicas",
      regras: [
        {
          nome: "Derivada do Logaritmo Natural",
          formula: "d/dx[ln(x)] = 1/x",
          explicacao: "A derivada do logaritmo natural é o recíproco do argumento.",
          exemplo: "d/dx(ln(x²)) = 1/(x²)·d/dx(x²) = 1/(x²)·2x = 2x/(x²) = 2/x",
          corDestaque: "red"
        },
        {
          nome: "Derivada do Logaritmo Base 10",
          formula: "d/dx[log₁₀(x)] = 1/(x·ln(10))",
          explicacao: "A derivada do logaritmo base 10 utiliza a mudança de base para o logaritmo natural.",
          exemplo: "d/dx(log₁₀(x)) = 1/(x·ln(10))",
          corDestaque: "red"
        },
        {
          nome: "Derivada da Exponencial",
          formula: "d/dx[e^x] = e^x",
          explicacao: "A função exponencial é igual à sua própria derivada, uma propriedade única.",
          exemplo: "d/dx(e^(2x)) = e^(2x)·d/dx(2x) = e^(2x)·2 = 2e^(2x)",
          corDestaque: "red"
        },
        {
          nome: "Derivada da Exponencial de Base a",
          formula: "d/dx[a^x] = a^x·ln(a)",
          explicacao: "A derivada da exponencial de base a multiplica pela função original e pelo logaritmo natural da base.",
          exemplo: "d/dx(2^x) = 2^x·ln(2)",
          corDestaque: "red"
        }
      ]
    }
  ]
}; 
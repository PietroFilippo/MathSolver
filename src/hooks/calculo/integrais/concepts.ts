import { IntegralConceito } from './types';

// Definição do conceito de integrais para explicação educacional
export const conceitoIntegrais: IntegralConceito = {
  titulo: "Integrais",
  descricao: "A integração é o processo inverso da diferenciação. Enquanto a derivada mede a taxa de variação de uma função, a integral acumula o valor total de uma função ao longo de um intervalo. Integrais são usadas para calcular áreas, volumes, trabalho, massa, e outras quantidades acumulativas.",
  categorias: [
    {
      nome: "Integrais Básicas",
      regras: [
        {
          nome: "Integração de Potências",
          formula: "∫ x^n dx = (x^(n+1))/(n+1) + C, para n ≠ -1",
          explicacao: "Para integrar uma potência de x, adicione 1 ao expoente e divida pelo novo expoente. Válido para qualquer expoente exceto -1.",
          exemplo: "∫ x^3 dx = x^4/4 + C",
          corDestaque: "blue"
        },
        {
          nome: "Integração de Constantes",
          formula: "∫ k dx = kx + C",
          explicacao: "A integral de uma constante é a constante multiplicada pela variável mais a constante de integração.",
          exemplo: "∫ 5 dx = 5x + C",
          corDestaque: "green"
        },
        {
          nome: "Integração de Raiz Quadrada",
          formula: "∫ √x dx = (2/3)x^(3/2) + C",
          explicacao: "A raiz quadrada de x pode ser escrita como x^(1/2). Aplicando a regra da potência, temos (x^(1/2+1))/(1/2+1) = (2/3)x^(3/2).",
          exemplo: "∫ √x dx = (2/3)x^(3/2) + C",
          corDestaque: "purple"
        },
        {
          nome: "Integração de 1/x",
          formula: "∫ 1/x dx = ln|x| + C",
          explicacao: "A integral de 1/x é o logaritmo natural do valor absoluto de x mais a constante de integração.",
          exemplo: "∫ 1/x dx = ln|x| + C",
          corDestaque: "purple"
        }
      ]
    },
    {
      nome: "Integrais Trigonométricas",
      regras: [
        {
          nome: "Integração de Sen(x)",
          formula: "∫ sen(x) dx = -cos(x) + C",
          explicacao: "A integral do seno é o negativo do cosseno mais a constante de integração.",
          exemplo: "∫ sen(x) dx = -cos(x) + C",
          corDestaque: "amber"
        },
        {
          nome: "Integração de Cos(x)",
          formula: "∫ cos(x) dx = sen(x) + C",
          explicacao: "A integral do cosseno é o seno mais a constante de integração.",
          exemplo: "∫ cos(x) dx = sen(x) + C",
          corDestaque: "cyan"
        },
        {
          nome: "Integração de Tan(x)",
          formula: "∫ tan(x) dx = -ln|cos(x)| + C = ln|sec(x)| + C",
          explicacao: "A integral da tangente é o logaritmo natural do valor absoluto da secante (ou o negativo do logaritmo do cosseno) mais a constante de integração.",
          exemplo: "∫ tan(x) dx = ln|sec(x)| + C",
          corDestaque: "red"
        }
      ]
    },
    {
      nome: "Regras de Integração",
      regras: [
        {
          nome: "Regra da Linearidade",
          formula: "∫ [f(x) + g(x)] dx = ∫ f(x) dx + ∫ g(x) dx",
          explicacao: "A integral de uma soma é igual à soma das integrais. A integração é um operador linear.",
          exemplo: "∫ (x^2 + sen(x)) dx = ∫ x^2 dx + ∫ sen(x) dx = x^3/3 - cos(x) + C",
          corDestaque: "blue"
        },
        {
          nome: "Regra da Constante Multiplicativa",
          formula: "∫ k·f(x) dx = k·∫ f(x) dx",
          explicacao: "Constantes podem ser movidas para fora da integral.",
          exemplo: "∫ 3x^2 dx = 3∫ x^2 dx = 3·(x^3/3) + C = x^3 + C",
          corDestaque: "green"
        },
        {
          nome: "Integração por Substituição",
          formula: "∫ f(g(x))·g'(x) dx = ∫ f(u) du, onde u = g(x)",
          explicacao: "Para integrais mais complexas, podemos substituir uma parte da expressão por uma nova variável para simplificar o cálculo.",
          exemplo: "∫ 2x·cos(x^2) dx = ∫ cos(u) du = sen(u) + C = sen(x^2) + C, onde u = x^2",
          corDestaque: "purple"
        }
      ]
    },
    {
      nome: "Integrais Especiais",
      regras: [
        {
          nome: "Funções Exponenciais",
          formula: "∫ e^x dx = e^x + C",
          explicacao: "A integral de e^x é ela própria mais a constante de integração.",
          exemplo: "∫ e^x dx = e^x + C",
          corDestaque: "amber"
        },
        {
          nome: "Funções Logarítmicas",
          formula: "∫ ln(x) dx = x·ln(x) - x + C",
          explicacao: "A integral do logaritmo natural exige uma abordagem de integração por partes.",
          exemplo: "∫ ln(x) dx = x·ln(x) - x + C",
          corDestaque: "cyan"
        }
      ]
    },
    {
      nome: "Integrais Definidas",
      regras: [
        {
          nome: "Definição",
          formula: "∫[a,b] f(x) dx = F(b) - F(a), onde F'(x) = f(x)",
          explicacao: "Uma integral definida representa a área sob a curva f(x) entre x=a e x=b. É calculada encontrando a primitiva F(x) e aplicando a fórmula F(b) - F(a).",
          exemplo: "∫[0,1] x^2 dx = [x^3/3]_0^1 = (1^3/3) - (0^3/3) = 1/3",
          corDestaque: "blue"
        },
        {
          nome: "Propriedades das Integrais Definidas",
          formula: "∫[a,b] f(x) dx = -∫[b,a] f(x) dx",
          explicacao: "Trocar os limites de integração inverte o sinal da integral. Também, para qualquer c entre a e b, ∫[a,b] f(x) dx = ∫[a,c] f(x) dx + ∫[c,b] f(x) dx.",
          exemplo: "∫[1,0] x^2 dx = -∫[0,1] x^2 dx = -1/3",
          corDestaque: "green"
        }
      ]
    }
  ]
}; 
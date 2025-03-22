// Exemplos para a calculadora de funções trigonométricas
export function getTrigonometricFunctionExamples() {
  return [
    {
      type: 'sin',
      inputValue: '30',
      inputUnit: 'degrees',
      outputUnit: 'degrees',
      description: 'sen(30°) - Ângulo notável'
    },
    {
      type: 'sin',
      inputValue: '45',
      inputUnit: 'degrees',
      outputUnit: 'radians',
      description: 'sen(45°) em radianos'
    },
    {
      type: 'cos',
      inputValue: '60',
      inputUnit: 'degrees',
      outputUnit: 'degrees',
      description: 'cos(60°) - Ângulo notável'
    },
    {
      type: 'cos',
      inputValue: 'π/3',
      inputUnit: 'radians',
      outputUnit: 'degrees', 
      description: 'cos(π/3) em graus'
    },
    {
      type: 'tan',
      inputValue: '45',
      inputUnit: 'degrees',
      outputUnit: 'degrees',
      description: 'tan(45°) = 1'
    },
    {
      type: 'asin',
      inputValue: '0.5',
      outputUnit: 'degrees',
      description: 'arcsen(0.5) = 30°'
    },
    {
      type: 'acos',
      inputValue: '0.5',
      outputUnit: 'radians',
      description: 'arccos(0.5) = π/3'
    },
    {
      type: 'atan',
      inputValue: '1',
      outputUnit: 'degrees',
      description: 'arctan(1) = 45°'
    },
    {
      type: 'sin',
      inputValue: 'π/6',
      inputUnit: 'radians',
      outputUnit: 'degrees',
      description: 'sen(π/6) = 0.5'
    },
    {
      type: 'cos',
      inputValue: '0',
      inputUnit: 'degrees',
      outputUnit: 'degrees',
      description: 'cos(0°) = 1'
    }
  ];
}

// Exemplos para a calculadora de equações trigonométricas
export function getTrigonometricEquationExamples() {
  return [
    {
      equation: 'sen(x) = 0',
      interval: '0,2π',
      description: 'Zeros do seno'
    },
    {
      equation: 'cos(x) = 0',
      interval: '0,2π',
      description: 'Zeros do cosseno'
    },
    {
      equation: 'tan(x) = 0',
      interval: '0,2π',
      description: 'Zeros da tangente'
    },
    {
      equation: 'sen(x) = 0.5',
      interval: '0,2π',
      description: 'sen(x) = 0.5'
    },
    {
      equation: 'cos(x) = 0.5',
      interval: '0,2π',
      description: 'cos(x) = 0.5'
    },
    {
      equation: 'sen(2x) = 0',
      interval: '0,2π',
      description: 'sen(2x) = 0'
    },
    {
      equation: 'cos(x/2) = 0',
      interval: '0,2π',
      description: 'cos(x/2) = 0'
    },
    {
      equation: '2sen(x) = 1',
      interval: '0,2π',
      description: '2sen(x) = 1'
    },
    {
      equation: 'sen^2(x) = 0.25',
      interval: '0,2π',
      description: 'sen²(x) = 0.25'
    },
    {
      equation: 'cos(x) + 1 = 0',
      interval: '0,2π',
      description: 'cos(x) + 1 = 0'
    }
  ];
}

// Exemplos para a calculadora de gráficos trigonométricos
export function getTrigonometricGraphExamples() {
  return [
    {
      type: 'seno',
      interval: [-Math.PI, Math.PI],
      amplitude: 1,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: 'Seno básico: f(x) = sen(x)'
    },
    {
      type: 'cosseno',
      interval: [-Math.PI, Math.PI],
      amplitude: 1,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: 'Cosseno básico: f(x) = cos(x)'
    },
    {
      type: 'tangente',
      interval: [-Math.PI, Math.PI],
      amplitude: 1,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: 'Tangente básica: f(x) = tan(x)'
    },
    {
      type: 'seno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 2,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: 'Seno com amplitude 2: f(x) = 2sen(x)'
    },
    {
      type: 'cosseno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 0.5,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: 'Cosseno com amplitude 0.5: f(x) = 0.5cos(x)'
    },
    {
      type: 'seno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 1,
      periodo: 2,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: 'Seno com período 4π: f(x) = sen(x/2)'
    },
    {
      type: 'cosseno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 1,
      periodo: 0.5,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: 'Cosseno com período π: f(x) = cos(2x)'
    },
    {
      type: 'seno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 1,
      periodo: 1,
      defasagem: Math.PI/2,
      deslocamentoVertical: 0,
      description: 'Seno com defasagem π/2: f(x) = sen(x-π/2)'
    },
    {
      type: 'seno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 1,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 2,
      description: 'Seno com deslocamento vertical: f(x) = sen(x) + 2'
    },
    {
      type: 'personalizado',
      interval: [-2*Math.PI, 2*Math.PI],
      funcaoPersonalizada: 'sen(x) * cos(x)',
      description: 'Personalizada: f(x) = sen(x)cos(x)'
    }
  ];
} 
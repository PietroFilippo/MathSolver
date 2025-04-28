// Exemplos para a calculadora de funções trigonométricas
import { TFunction } from 'i18next';

export function getTrigonometricFunctionExamples(t?: TFunction) {
  return [
    {
      type: 'sin',
      inputValue: '30',
      inputUnit: 'degrees',
      outputUnit: 'degrees',
      description: t ? t('trigonometry:trigonometric_functions.examples.sin_30') : 'sen(30°) - Ângulo notável'
    },
    {
      type: 'sin',
      inputValue: '45',
      inputUnit: 'degrees',
      outputUnit: 'radians',
      description: t ? t('trigonometry:trigonometric_functions.examples.sin_45_rad') : 'sen(45°) em radianos'
    },
    {
      type: 'cos',
      inputValue: '60',
      inputUnit: 'degrees',
      outputUnit: 'degrees',
      description: t ? t('trigonometry:trigonometric_functions.examples.cos_60') : 'cos(60°) - Ângulo notável'
    },
    {
      type: 'cos',
      inputValue: 'π/3',
      inputUnit: 'radians',
      outputUnit: 'degrees', 
      description: t ? t('trigonometry:trigonometric_functions.examples.cos_pi_3') : 'cos(π/3) em graus'
    },
    {
      type: 'tan',
      inputValue: '45',
      inputUnit: 'degrees',
      outputUnit: 'degrees',
      description: t ? t('trigonometry:trigonometric_functions.examples.tan_45') : 'tan(45°) = 1'
    },
    {
      type: 'asin',
      inputValue: '0.5',
      outputUnit: 'degrees',
      description: t ? t('trigonometry:trigonometric_functions.examples.arcsin_0_5') : 'arcsen(0.5) = 30°'
    },
    {
      type: 'acos',
      inputValue: '0.5',
      outputUnit: 'radians',
      description: t ? t('trigonometry:trigonometric_functions.examples.arccos_0_5') : 'arccos(0.5) = π/3'
    },
    {
      type: 'atan',
      inputValue: '1',
      outputUnit: 'degrees',
      description: t ? t('trigonometry:trigonometric_functions.examples.arctan_1') : 'arctan(1) = 45°'
    },
    {
      type: 'sin',
      inputValue: 'π/6',
      inputUnit: 'radians',
      outputUnit: 'degrees',
      description: t ? t('trigonometry:trigonometric_functions.examples.sin_pi_6') : 'sen(π/6) = 0.5'
    },
    {
      type: 'cos',
      inputValue: '0',
      inputUnit: 'degrees',
      outputUnit: 'degrees',
      description: t ? t('trigonometry:trigonometric_functions.examples.cos_0') : 'cos(0°) = 1'
    }
  ];
}

// Exemplos para a calculadora de equações trigonométricas
export function getTrigonometricEquationExamples(t?: TFunction) {
  return [
    {
      equation: 'sen(x) = 0',
      interval: '0,2π',
      description: t ? t('trigonometry:trigonometric_equations.examples.sin_zero') : 'Zeros do seno'
    },
    {
      equation: 'cos(x) = 0',
      interval: '0,2π',
      description: t ? t('trigonometry:trigonometric_equations.examples.cos_zero') : 'Zeros do cosseno'
    },
    {
      equation: 'tan(x) = 0',
      interval: '0,2π',
      description: t ? t('trigonometry:trigonometric_equations.examples.tan_zero') : 'Zeros da tangente'
    },
    {
      equation: 'sen(x) = 0.5',
      interval: '0,2π',
      description: t ? t('trigonometry:trigonometric_equations.examples.sin_half') : 'sen(x) = 0.5'
    },
    {
      equation: 'cos(x) = 0.5',
      interval: '0,2π',
      description: t ? t('trigonometry:trigonometric_equations.examples.cos_half') : 'cos(x) = 0.5'
    },
    {
      equation: 'sen(2x) = 0',
      interval: '0,2π',
      description: t ? t('trigonometry:trigonometric_equations.examples.sin_2x_zero') : 'sen(2x) = 0'
    },
    {
      equation: 'cos(x/2) = 0',
      interval: '0,2π',
      description: t ? t('trigonometry:trigonometric_equations.examples.cos_half_x_zero') : 'cos(x/2) = 0'
    },
    {
      equation: '2sen(x) = 1',
      interval: '0,2π',
      description: t ? t('trigonometry:trigonometric_equations.examples.two_sin_one') : '2sen(x) = 1'
    },
    {
      equation: 'sen^2(x) = 0.25',
      interval: '0,2π',
      description: t ? t('trigonometry:trigonometric_equations.examples.sin_squared_quarter') : 'sen²(x) = 0.25'
    },
    {
      equation: 'cos(x) + 1 = 0',
      interval: '0,2π',
      description: t ? t('trigonometry:trigonometric_equations.examples.cos_plus_one') : 'cos(x) + 1 = 0'
    }
  ];
}

// Exemplos para a calculadora de gráficos trigonométricos
export function getTrigonometricGraphExamples(t?: TFunction) {
  return [
    {
      type: 'seno',
      interval: [-Math.PI, Math.PI],
      amplitude: 1,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: t ? t('trigonometry:trigonometric_graphs.examples.basic_sine') : 'Seno básico: f(x) = sen(x)'
    },
    {
      type: 'cosseno',
      interval: [-Math.PI, Math.PI],
      amplitude: 1,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: t ? t('trigonometry:trigonometric_graphs.examples.basic_cosine') : 'Cosseno básico: f(x) = cos(x)'
    },
    {
      type: 'tangente',
      interval: [-Math.PI, Math.PI],
      amplitude: 1,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: t ? t('trigonometry:trigonometric_graphs.examples.basic_tangent') : 'Tangente básica: f(x) = tan(x)'
    },
    {
      type: 'seno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 2,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: t ? t('trigonometry:trigonometric_graphs.examples.sine_amplitude_2') : 'Seno com amplitude 2: f(x) = 2sen(x)'
    },
    {
      type: 'cosseno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 0.5,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: t ? t('trigonometry:trigonometric_graphs.examples.cosine_amplitude_half') : 'Cosseno com amplitude 0.5: f(x) = 0.5cos(x)'
    },
    {
      type: 'seno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 1,
      periodo: 2,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: t ? t('trigonometry:trigonometric_graphs.examples.sine_period_4pi') : 'Seno com período 4π: f(x) = sen(x/2)'
    },
    {
      type: 'cosseno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 1,
      periodo: 0.5,
      defasagem: 0,
      deslocamentoVertical: 0,
      description: t ? t('trigonometry:trigonometric_graphs.examples.cosine_period_pi') : 'Cosseno com período π: f(x) = cos(2x)'
    },
    {
      type: 'seno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 1,
      periodo: 1,
      defasagem: Math.PI/2,
      deslocamentoVertical: 0,
      description: t ? t('trigonometry:trigonometric_graphs.examples.sine_phase_pi_2') : 'Seno com defasagem π/2: f(x) = sen(x-π/2)'
    },
    {
      type: 'seno',
      interval: [-2*Math.PI, 2*Math.PI],
      amplitude: 1,
      periodo: 1,
      defasagem: 0,
      deslocamentoVertical: 2,
      description: t ? t('trigonometry:trigonometric_graphs.examples.sine_vertical_shift') : 'Seno com deslocamento vertical: f(x) = sen(x) + 2'
    },
    {
      type: 'personalizado',
      interval: [-2*Math.PI, 2*Math.PI],
      funcaoPersonalizada: 'sen(x) * cos(x)',
      description: t ? t('trigonometry:trigonometric_graphs.examples.custom_sine_cosine') : 'Personalizada: f(x) = sen(x)cos(x)'
    }
  ];
} 
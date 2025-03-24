// Exemplos para problemas de coordenadas geométricas
export function getCoordenadasExamples(problema: string) {
  switch (problema) {
    case 'distanciaEntrePontos':
      return [
        {
          description: 'Pontos alinhados no eixo X',
          pontos: {
            p1: { x: 0, y: 0, z: 0 },
            p2: { x: 5, y: 0, z: 0 }
          }
        },
        {
          description: 'Pontos alinhados no eixo Y',
          pontos: {
            p1: { x: 0, y: 0, z: 0 },
            p2: { x: 0, y: 7, z: 0 }
          }
        },
        {
          description: 'Pontos alinhados no eixo Z',
          pontos: {
            p1: { x: 0, y: 0, z: 0 },
            p2: { x: 0, y: 0, z: 3 }
          }
        },
        {
          description: 'Pontos em diagonal',
          pontos: {
            p1: { x: 1, y: 2, z: 3 },
            p2: { x: 4, y: 6, z: 8 }
          }
        }
      ];
    
    case 'verificarColinearidade':
      return [
        {
          description: 'Pontos colineares no eixo X',
          pontos: {
            p1: { x: 0, y: 0, z: 0 },
            p2: { x: 3, y: 0, z: 0 },
            p3: { x: 7, y: 0, z: 0 }
          }
        },
        {
          description: 'Pontos colineares no plano XY',
          pontos: {
            p1: { x: 1, y: 1, z: 0 },
            p2: { x: 3, y: 3, z: 0 },
            p3: { x: 5, y: 5, z: 0 }
          }
        },
        {
          description: 'Pontos não colineares',
          pontos: {
            p1: { x: 0, y: 0, z: 0 },
            p2: { x: 3, y: 0, z: 0 },
            p3: { x: 3, y: 3, z: 0 }
          }
        }
      ];
    
    case 'verificarCoplanaridade':
      return [
        {
          description: 'Pontos coplanares no plano XY',
          pontos: {
            p1: { x: 0, y: 0, z: 0 },
            p2: { x: 3, y: 0, z: 0 },
            p3: { x: 0, y: 3, z: 0 },
            p4: { x: 3, y: 3, z: 0 }
          }
        },
        {
          description: 'Pontos coplanares em plano diagonal',
          pontos: {
            p1: { x: 1, y: 0, z: 0 },
            p2: { x: 0, y: 1, z: 0 },
            p3: { x: 0, y: 0, z: 1 },
            p4: { x: 1, y: 1, z: 1 }
          }
        },
        {
          description: 'Pontos não coplanares',
          pontos: {
            p1: { x: 0, y: 0, z: 0 },
            p2: { x: 1, y: 0, z: 0 },
            p3: { x: 0, y: 1, z: 0 },
            p4: { x: 0, y: 0, z: 2 }
          }
        }
      ];
    
    default:
      return [];
  }
} 
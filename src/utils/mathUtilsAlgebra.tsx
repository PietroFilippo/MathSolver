import { aproximadamenteIguais } from './mathUtils';

// Resolve um sistema linear de duas equações com duas incógnitas
export const sistemaLinear = (
    a1: number, b1: number, c1: number,
    a2: number, b2: number, c2: number
): {x: number, y: number} | null => {
    const det = a1 * b2 - a2 * b1;
    
    if (aproximadamenteIguais(det, 0)) {
        // O sistema ou não tem solução ou tem soluções infinitas
        return null;
    }

    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    
    return { x, y };
};
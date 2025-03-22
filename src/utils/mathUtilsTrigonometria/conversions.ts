// Utilidades para conversões angulares entre graus e radianos

// Converte graus para radianos
export const degreesToRadians = (graus: number): number => {
    return graus * (Math.PI / 180);
};

// Converte radianos para graus 
export const radiansToDegrees = (radianos: number): number => {
    return radianos * (180 / Math.PI);
}; 
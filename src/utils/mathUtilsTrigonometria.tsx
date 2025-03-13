// Converte graus para radianos
export const grausParaRadianos = (graus: number): number => {
    return graus * (Math.PI / 180);
};

// Converte radianos para graus 
export const radianosParaGraus = (radianos: number): number => {
    return radianos * (180 / Math.PI);
};
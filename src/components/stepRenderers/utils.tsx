import React from 'react';


// Função para determinar se um passo de verificação indica sucesso
export const getVerificationStatus = (text: string): boolean => {
  return text.includes('✓') || 
    text.includes('(Correct!)') || 
    text.includes('true') || 
    text.includes('concluída com sucesso');
};


// Helper partilhado para limpar passos de verificação
export const cleanVerificationStep = (step: string): string => {
  // Limpa qualquer sintaxe de handlebars se presente
  let cleanedStep = step;
  
  // Handle condicional se presente
  if (step.includes('{{#if isCorrect}}')) {
    // Extrai partes antes da condicional
    const beforeConditional = step.split('{{#if isCorrect}}')[0].trim();
    return beforeConditional + ' ✓';
  }
  
  // Handle condicional padrão correto/incorreto
  if (step.includes('{{#if correct}}')) {
    const isCorrect = getVerificationStatus(step);
    // Extrai texto apropriado com base na correção
    const correctTextMatch = step.match(/{{#if correct}}(.*?){{else}}/);
    const incorrectTextMatch = step.match(/{{else}}(.*?){{\/if}}/);
    
    if (isCorrect && correctTextMatch) {
      cleanedStep = correctTextMatch[1];
    } else if (!isCorrect && incorrectTextMatch) {
      cleanedStep = incorrectTextMatch[1];
    }
    
    // Limpa qualquer sintaxe de handlebars restante
    cleanedStep = cleanedStep.replace(/{{.*?}}/g, '');
  }
  
  // Remove chave de tradução se presente
  if (cleanedStep.includes('verification.completed:')) {
    cleanedStep = cleanedStep.replace(/verification\.completed:\s+/, '');
  }
  
  // Handle para operação de texto que não é renderizado corretamente
  if (cleanedStep.includes('{{operation')) {
    cleanedStep = cleanedStep.replace(/{{operation.*?}}/, '').trim();
  }
  
  return cleanedStep;
}; 
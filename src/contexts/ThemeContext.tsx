import React, { createContext, useState, useContext, useEffect } from 'react';

// Define os temas disponíveis
type ThemeType = 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'red' | 'pink';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pega o tema do localStorage ou define como light por padrão
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'light';
  });

  // Atualiza localStorage e aplica a classe de tema ao documento quando o tema muda
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Remove todas as classes de tema possíveis
    document.documentElement.classList.remove(
      'theme-light', 'theme-dark', 'theme-blue', 'theme-purple', 'theme-green', 'theme-red', 'theme-pink'
    );
    
    // Adiciona a classe do tema atual
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Tratamento especial para o modo escuro
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Seta uma flag que ajuda a identificar o tema ativo para estilização de contêineres
    document.body.dataset.theme = theme;
    
    // Atualiza a classe do body para uma melhor integração de temas
    document.body.classList.remove(
      'theme-light', 'theme-dark', 'theme-blue', 'theme-purple', 'theme-green', 'theme-red', 'theme-pink'
    );
    document.body.classList.add(`theme-${theme}`);
    
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o contexto do tema
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
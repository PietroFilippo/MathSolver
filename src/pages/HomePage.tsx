import React from 'react';

const HomePage = ({ onSelectSolver }: { onSelectSolver: () => void }) => {
  return (
    <div>
      <h1>Home Page (placeholder)</h1>
      <button onClick={onSelectSolver}>Ir para o resolvedor</button>
    </div>
  );
};

export default HomePage;

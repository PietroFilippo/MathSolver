import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ResolvedorPage from './pages/ResolvedorPage';
import SobrePage from './pages/SobrePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onSelectSolver={() => setCurrentPage('resolvedor')} />;
      case 'resolvedor':
        return <ResolvedorPage />;
      case 'sobre':
        return <SobrePage />;
      default:
        return <HomePage onSelectSolver={() => setCurrentPage('resolvedor')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
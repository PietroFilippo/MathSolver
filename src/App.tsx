import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ResolvedorPage from './pages/ResolvedorPage';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [scrollToSobre, setScrollToSobre] = useState(false);

  const navigateToSolver = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setCurrentPage('resolvedor');
    setScrollToSobre(false);
  };

  const navigateToPage = (page: string) => {
    if (page === 'sobre') {
      setCurrentPage('home');
      setScrollToSobre(true);
      window.history.pushState(null, '', '#sobre');
    } else {
      setCurrentPage(page);
      setScrollToSobre(false);
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onSelectSolver={navigateToSolver} scrollToSobre={scrollToSobre} />;
      case 'resolvedor':
        return <ResolvedorPage initialCategory={selectedCategory} />;
      default:
        return <HomePage onSelectSolver={navigateToSolver} scrollToSobre={scrollToSobre} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-theme-primary text-gray-900 dark:text-gray-100">
        <Header 
          currentPage={currentPage}
          onNavigate={navigateToPage}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
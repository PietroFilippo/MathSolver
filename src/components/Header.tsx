import { HiHome, HiInformationCircle, HiBookOpen, HiCalculator } from 'react-icons/hi';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <HiCalculator className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">MathSolver</h1>
          </div>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className={`flex items-center ${currentPage === 'home' ? 'text-white font-bold' : 'text-indigo-200 hover:text-white'}`}
                >
                  <HiHome className="h-5 w-5 mr-1" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('resolvedor')}
                  className={`flex items-center ${currentPage === 'resolvedor' ? 'text-white font-bold' : 'text-indigo-200 hover:text-white'}`}
                >
                  <HiBookOpen className="h-5 w-5 mr-1" />
                  <span>Resolvedores</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('sobre')}
                  className={`flex items-center ${currentPage === 'sobre' ? 'text-white font-bold' : 'text-indigo-200 hover:text-white'}`}
                >
                  <HiInformationCircle className="h-5 w-5 mr-1" />
                  <span>Sobre</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
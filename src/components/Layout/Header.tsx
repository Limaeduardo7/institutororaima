import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { to: "/", label: "Início" },
    { to: "/quem-somos", label: "Quem Somos" },
    { to: "/eventos", label: "Eventos" },
    { to: "/doacoes", label: "Doações" },
    { to: "/transparencia", label: "Transparência" },
    { to: "/contato", label: "Contato" },
    { to: "/localizacao", label: "Localização" }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-lg fixed w-full top-0 z-50 border-b border-white/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="Instituto Estação" 
              className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary-700 leading-tight">
                Instituto Estação
              </span>
              <span className="text-xs text-primary-500 font-medium">
                Transformando vidas desde 1997
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-primary-700" />
            ) : (
              <Menu className="h-6 w-6 text-primary-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-primary-100">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-neutral-700 hover:text-primary-600 font-medium py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
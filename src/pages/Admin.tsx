import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Users, Calendar, FileText, MessageCircle, CreditCard, Settings } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin - Instituto Estação</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha de Administrador
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Ações Sociais', href: '/admin/social-actions', icon: Users },
    { name: 'Eventos', href: '/admin/events', icon: Calendar },
    { name: 'Documentos Financeiros', href: '/admin/financial-documents', icon: FileText },
    { name: 'Mensagens de Contato', href: '/admin/contact-messages', icon: MessageCircle },
    { name: 'Doações', href: '/admin/donations', icon: CreditCard },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ];

  if (location.pathname === '/admin') {
    return <Navigate to="/admin/social-actions" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <div className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 w-64 p-6">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="w-full text-left text-sm text-gray-600 hover:text-gray-900"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
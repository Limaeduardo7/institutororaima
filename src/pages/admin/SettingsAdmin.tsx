import { useState } from 'react';
import { Settings, Save, Eye, EyeOff } from 'lucide-react';

export default function SettingsAdmin() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPassword !== 'admin123') {
      alert('Senha atual incorreta');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('Confirmação de senha não confere');
      return;
    }
    
    // Aqui você poderia salvar no localStorage ou banco de dados
    // Por segurança, não vamos implementar mudança de senha real neste demo
    alert('Funcionalidade de mudança de senha seria implementada aqui');
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-3 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mudança de Senha */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Alterar Senha de Administrador</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Nova Senha
            </button>
          </form>
        </div>

        {/* Informações do Sistema */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Informações do Sistema</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Versão do Sistema</label>
              <p className="text-gray-900">v1.0.0</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Banco de Dados</label>
              <p className="text-gray-900">Supabase PostgreSQL</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Último Backup</label>
              <p className="text-gray-900">Automático via Supabase</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Ambiente</label>
              <p className="text-gray-900">Produção</p>
            </div>
          </div>
        </div>

        {/* Configurações do Site */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Configurações do Site</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Organização
              </label>
              <input
                type="text"
                defaultValue="Instituto Estação"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Altere este valor diretamente no código</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contato
              </label>
              <input
                type="email"
                defaultValue="contato@institutoestacao.org.br"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Altere este valor diretamente no código</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                defaultValue="(95) 3224-7890"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Altere este valor diretamente no código</p>
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-200">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Instruções Importantes</h2>
          <div className="space-y-3 text-blue-700">
            <p>• Para alterar informações do site, edite os arquivos de código diretamente</p>
            <p>• O banco de dados é gerenciado automaticamente pelo Supabase</p>
            <p>• Faça backups regulares dos dados importantes</p>
            <p>• Mantenha a senha de administrador segura</p>
            <p>• Execute o SQL schema sempre que houver atualizações de estrutura</p>
          </div>
        </div>
      </div>
    </div>
  );
}
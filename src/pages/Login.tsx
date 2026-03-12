import { useState } from 'react';
import { Leaf, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Usuario' as 'Usuario' | 'Administrador',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor complete todos los campos');
      return;
    }

    const success = login(formData.email, formData.password, formData.role);
    if (success) {
      if (formData.role === 'Administrador') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-3xl flex items-center justify-center shadow-2xl">
            <Leaf className="w-9 h-9 text-white" />
          </div>
          <span className="text-4xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] bg-clip-text text-transparent">
            EcoLand
          </span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar sesión</h1>
            <p className="text-gray-600">Bienvenido de nuevo a EcoLand</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#4CAF50] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#4CAF50] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de usuario
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Usuario' | 'Administrador' })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#4CAF50] focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Usuario">Usuario</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                <p className="text-sm text-red-600 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#4CAF50]/30 hover:scale-105 transition-all"
            >
              Iniciar sesión
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">o</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="text-[#2E7D32] font-semibold hover:text-[#4CAF50] transition-colors">
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <Link to="/" className="text-sm text-gray-500 hover:text-[#2E7D32] transition-colors">
                ← Volver al inicio
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

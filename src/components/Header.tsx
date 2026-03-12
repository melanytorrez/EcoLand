import { Leaf, LogIn, UserPlus, Shield, LogOut, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const location = useLocation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/reforestacion', label: 'Reforestación' },
    { path: '/campanas-reciclaje', label: 'Campañas de Reciclaje' },
    { path: '/reciclaje', label: 'Reciclaje' },
    { path: '/estadisticas', label: 'Estadísticas' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] bg-clip-text text-transparent">
              EcoLand
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-base font-medium transition-colors relative ${
                    isActive
                      ? 'text-[#2E7D32]'
                      : 'text-gray-600 hover:text-[#4CAF50]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Admin View Button */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:shadow-lg hover:shadow-purple-500/30 transition-all font-semibold"
                  >
                    <Shield className="w-4 h-4" />
                    Vista Administrador
                  </Link>
                )}
                
                {/* User Info */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-[#E8F5E9] rounded-2xl">
                  <User className="w-4 h-4 text-[#2E7D32]" />
                  <span className="text-sm font-medium text-[#2E7D32]">{user?.name}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 text-[#2E7D32] hover:bg-[#E8F5E9] rounded-2xl transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl hover:shadow-lg hover:shadow-[#4CAF50]/30 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
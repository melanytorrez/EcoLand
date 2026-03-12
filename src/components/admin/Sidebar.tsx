import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  TreeDeciduous,
  MapPin,
  Route,
  Users,
  BarChart3,
  Leaf,
  LogOut,
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/campaigns', label: 'Campañas', icon: TreeDeciduous },
  { path: '/admin/green-points', label: 'Puntos Verdes', icon: MapPin },
  { path: '/admin/routes', label: 'Rutas', icon: Route },
  { path: '/admin/users', label: 'Usuarios', icon: Users },
  { path: '/admin/statistics', label: 'Estadísticas', icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-72 bg-gradient-to-b from-[#2E7D32] to-[#1B5E20] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Leaf className="w-7 h-7 text-[#2E7D32]" />
          </div>
          <div>
            <h1 className="text-xl font-bold">EcoLand</h1>
            <p className="text-xs text-[#A5D6A7]">Panel Administrativo</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-white text-[#2E7D32] shadow-lg'
                  : 'text-[#A5D6A7] hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-[#A5D6A7] hover:bg-white/10 hover:text-white rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Vista Usuario</span>
        </Link>
      </div>
    </aside>
  );
}
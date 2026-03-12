import { useState } from 'react';
import { Route as RouteIcon, Plus, Search, Edit, Trash2, MapPin, Truck } from 'lucide-react';

export default function AdminRoutes() {
  const [searchTerm, setSearchTerm] = useState('');

  const routes = [
    { id: 1, name: 'Ruta Norte - Centro', zone: 'Norte', status: 'Activa', vehicle: 'RF-123', stops: 15 },
    { id: 2, name: 'Ruta Sur - Temporal', zone: 'Sur', status: 'Activa', vehicle: 'RF-456', stops: 12 },
    { id: 3, name: 'Ruta Este - Comercial', zone: 'Este', status: 'Inactiva', vehicle: '-', stops: 20 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Rutas</h1>
          <p className="text-gray-600 text-lg">Administra las rutas de recolección</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold hover:shadow-xl transition-all">
          <Plus className="w-5 h-5" />
          Nueva Ruta
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar ruta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#4CAF50]"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9]">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Zona</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Vehículo</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Paradas</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center">
                      <RouteIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">{route.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-semibold rounded-full">
                    {route.zone}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#4CAF50]" />
                    <span className="text-sm text-gray-900 font-medium">{route.vehicle}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#4CAF50]" />
                    <span className="text-sm text-gray-600">{route.stops}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${route.status === 'Activa' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {route.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-[#4CAF50] hover:bg-[#E8F5E9] rounded-xl transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

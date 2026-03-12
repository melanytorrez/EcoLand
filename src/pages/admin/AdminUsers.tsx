import { useState } from 'react';
import { Users, Plus, Search, Edit, Trash2, Award, Mail } from 'lucide-react';

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 1, name: 'María Rodríguez', email: 'maria.r@email.com', role: 'Usuario', recycled: '156 kg', level: 'Oro', status: 'Activo' },
    { id: 2, name: 'Carlos Pérez', email: 'carlos.p@email.com', role: 'Usuario', recycled: '98 kg', level: 'Plata', status: 'Activo' },
    { id: 3, name: 'Ana Gutiérrez', email: 'ana.g@email.com', role: 'Voluntario', recycled: '234 kg', level: 'Platino', status: 'Activo' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600 text-lg">Administra los usuarios de la plataforma</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold hover:shadow-xl transition-all">
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuario..."
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
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Usuario</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Rol</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Reciclado</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Nivel</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-[#2E7D32]">{user.recycled}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">{user.level}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1.5 bg-[#4CAF50] text-white text-sm font-semibold rounded-full">
                    {user.status}
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

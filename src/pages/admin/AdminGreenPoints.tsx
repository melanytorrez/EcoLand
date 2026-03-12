import { useState } from 'react';
import { MapPin, Plus, Search, Edit, Trash2, Clock } from 'lucide-react';

interface GreenPoint {
  id: number;
  name: string;
  address: string;
  zone: string;
  status: 'Activo' | 'Inactivo';
  schedule: string;
  capacity: string;
}

export default function AdminGreenPoints() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [points, setPoints] = useState<GreenPoint[]>([
    {
      id: 1,
      name: 'Punto Verde Plaza Colón',
      address: 'Av. Heroínas esq. Plaza Colón',
      zone: 'Centro',
      status: 'Activo',
      schedule: 'Lun-Vie 8:00-18:00',
      capacity: '85%',
    },
    {
      id: 2,
      name: 'Punto Verde La Cancha',
      address: 'Mercado La Cancha - Entrada Principal',
      zone: 'Sur',
      status: 'Activo',
      schedule: 'Lun-Sáb 7:00-20:00',
      capacity: '65%',
    },
    {
      id: 3,
      name: 'Punto Verde Parque Tunari',
      address: 'Av. Melchor Pérez esq. Parque Tunari',
      zone: 'Norte',
      status: 'Inactivo',
      schedule: 'Lun-Dom 6:00-22:00',
      capacity: '40%',
    },
  ]);

  const filteredPoints = points.filter(
    (point) =>
      point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este punto verde?')) {
      setPoints(points.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Puntos Verdes</h1>
          <p className="text-gray-600 text-lg">Administra los centros de reciclaje</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#4CAF50]/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Punto Verde
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o zona..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#4CAF50] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9]">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Nombre</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Dirección</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Zona</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Horario</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Capacidad</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPoints.map((point) => (
                <tr key={point.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">{point.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{point.address}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 bg-[#E8F5E9] text-[#2E7D32] text-sm font-semibold rounded-full">
                      {point.zone}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {point.schedule}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-24">
                        <div
                          className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] rounded-full"
                          style={{ width: point.capacity }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{point.capacity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
                        point.status === 'Activo'
                          ? 'bg-[#4CAF50] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {point.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#4CAF50] hover:bg-[#E8F5E9] rounded-xl transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(point.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuevo Punto Verde</h2>
            <p className="text-gray-600 mb-6">Funcionalidad de formulario próximamente</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

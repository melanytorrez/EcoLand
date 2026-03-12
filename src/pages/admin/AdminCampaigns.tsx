import { useState } from 'react';
import { TreeDeciduous, Plus, Search, Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react';

interface Campaign {
  id: number;
  title: string;
  date: string;
  location: string;
  spots: number;
  participants: number;
  status: 'Activa' | 'Programada' | 'Finalizada';
  organizer: string;
}

export default function AdminCampaigns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      title: 'Reforestación Parque Tunari',
      date: '24/02/2026',
      location: 'Parque Nacional Tunari',
      spots: 45,
      participants: 32,
      status: 'Activa',
      organizer: 'Alcaldía de Cochabamba',
    },
    {
      id: 2,
      title: 'Bosques Urbanos Centro',
      date: '28/02/2026',
      location: 'Plaza Colón',
      spots: 30,
      participants: 18,
      status: 'Activa',
      organizer: 'EcoLand',
    },
    {
      id: 3,
      title: 'Recuperación Zona Sur',
      date: '05/03/2026',
      location: 'Av. Blanco Galindo',
      spots: 60,
      participants: 42,
      status: 'Programada',
      organizer: 'ONG Verde Bolivia',
    },
  ]);

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar esta campaña?')) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activa':
        return 'bg-[#4CAF50] text-white';
      case 'Programada':
        return 'bg-blue-100 text-blue-700';
      case 'Finalizada':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Campañas</h1>
          <p className="text-gray-600 text-lg">Administra las campañas de reforestación</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#4CAF50]/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Campaña
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#4CAF50] transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9]">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Campaña</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Fecha</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Ubicación</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Participantes</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Organizador</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCampaigns.map((campaign) => {
                const percentage = (campaign.participants / campaign.spots) * 100;
                return (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-2xl flex items-center justify-center flex-shrink-0">
                          <TreeDeciduous className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">{campaign.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm">{campaign.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm">{campaign.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-[#4CAF50]" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {campaign.participants}/{campaign.spots}
                            </span>
                            <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden w-24">
                            <div
                              className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{campaign.organizer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-[#4CAF50] hover:bg-[#E8F5E9] rounded-xl transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nueva Campaña</h2>
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

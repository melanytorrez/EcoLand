import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export default function Reforestation() {
  const [searchTerm, setSearchTerm] = useState('');

  const campaigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Reforestación Parque Tunari',
      date: '24 de Febrero, 2026',
      location: 'Parque Nacional Tunari',
      spots: 45,
      participants: 32,
      organizer: 'Alcaldía de Cochabamba',
      status: 'Activa',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1729434170023-cad95b4e419f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlZm9yZXN0YXRpb24lMjBwYXJrJTIwbmF0dXJlfGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Bosques Urbanos Centro',
      date: '28 de Febrero, 2026',
      location: 'Plaza Colón',
      spots: 30,
      participants: 18,
      organizer: 'EcoLand',
      status: 'Activa',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Recuperación Zona Sur',
      date: '5 de Marzo, 2026',
      location: 'Av. Blanco Galindo',
      spots: 60,
      participants: 42,
      organizer: 'ONG Verde Bolivia',
      status: 'Activa',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1729434170023-cad95b4e419f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlZm9yZXN0YXRpb24lMjBwYXJrJTIwbmF0dXJlfGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Arborización Zona Norte',
      date: '10 de Marzo, 2026',
      location: 'Avenida Circunvalación',
      spots: 50,
      participants: 35,
      organizer: 'Alcaldía de Cochabamba',
      status: 'Activa',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Reforestación Laguna Alalay',
      date: '15 de Marzo, 2026',
      location: 'Laguna Alalay',
      spots: 80,
      participants: 56,
      organizer: 'EcoLand',
      status: 'Activa',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1729434170023-cad95b4e419f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlZm9yZXN0YXRpb24lMjBwYXJrJTIwbmF0dXJlfGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Bosque Urbano Este',
      date: '20 de Marzo, 2026',
      location: 'Zona Este - Sacaba',
      spots: 40,
      participants: 28,
      organizer: 'Municipio de Sacaba',
      status: 'Activa',
    },
  ];

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              🌳 Campañas de Reforestación
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Sé parte del cambio
            </h1>
            <p className="text-xl text-[#A5D6A7] mb-8">
              Únete a nuestras campañas de reforestación y ayuda a recuperar los espacios verdes de Cochabamba.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar campaña por nombre o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#4CAF50] transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl font-medium hover:border-[#4CAF50] transition-all">
              <Filter className="w-5 h-5" />
              Filtrar
            </button>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => {
              const availableSpots = campaign.spots - campaign.participants;
              const percentage = (campaign.participants / campaign.spots) * 100;

              return (
                <div
                  key={campaign.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#4CAF50] text-white rounded-full text-sm font-semibold">
                      {campaign.status}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-600">Progreso de inscripciones</span>
                          <span className="text-xs font-bold text-[#2E7D32]">{Math.round(percentage)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{campaign.title}</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm">{campaign.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm">{campaign.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Users className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm">
                          {availableSpots} cupos disponibles de {campaign.spots}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6 p-3 bg-[#E8F5E9] rounded-2xl">
                      <p className="text-xs text-gray-600 mb-1">Organizado por:</p>
                      <p className="text-sm font-semibold text-[#2E7D32]">{campaign.organizer}</p>
                    </div>

                    <Link
                      to={`/reforestacion/${campaign.id}`}
                      className="block w-full px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white text-center rounded-2xl font-semibold hover:shadow-lg hover:shadow-[#4CAF50]/30 transition-all"
                    >
                      Participar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

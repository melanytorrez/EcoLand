import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Calendar, MapPin, Target, Search, Filter, Recycle } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export default function RecyclingCampaigns() {
  const [searchTerm, setSearchTerm] = useState('');

  const campaigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1703223513358-12fde6b96580?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwcmVjeWNsaW5nJTIwY2FtcGFpZ24lMjBzb3J0aW5nfGVufDF8fHx8MTc3MTk1Nzk1MXww&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Junio sin Plástico',
      wasteType: 'Plástico',
      date: '1-30 de Junio, 2026',
      location: 'Toda la ciudad',
      goal: '5,000 kg',
      collected: 3240,
      goalAmount: 5000,
      status: 'Activa',
      participants: 456,
      typeColor: 'blue',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1654078054613-a56cfcabdb84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMGNhcmRib2FyZCUyMHJlY3ljbGluZyUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzcxOTU3OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Papel y Cartón Universitario',
      wasteType: 'Papel y Cartón',
      date: '15 Feb - 15 Mar, 2026',
      location: 'Universidades Cbba',
      goal: '3,000 kg',
      collected: 2100,
      goalAmount: 3000,
      status: 'Activa',
      participants: 289,
      typeColor: 'yellow',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1654718421032-8aee5603b51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGJvdHRsZSUyMHJlY3ljbGluZyUyMGdyZWVufGVufDF8fHx8MTc3MTk1Nzk1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Vidrio para el Futuro',
      wasteType: 'Vidrio',
      date: '10-25 de Marzo, 2026',
      location: 'Zona Sur',
      goal: '2,500 kg',
      collected: 1850,
      goalAmount: 2500,
      status: 'Activa',
      participants: 178,
      typeColor: 'green',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1703223513358-12fde6b96580?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwcmVjeWNsaW5nJTIwY2FtcGFpZ24lMjBzb3J0aW5nfGVufDF8fHx8MTc3MTk1Nzk1MXww&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Desafío Metal Limpio',
      wasteType: 'Metal',
      date: '5-20 de Abril, 2026',
      location: 'Zona Norte',
      goal: '1,800 kg',
      collected: 980,
      goalAmount: 1800,
      status: 'Programada',
      participants: 124,
      typeColor: 'gray',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1654078054613-a56cfcabdb84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMGNhcmRib2FyZCUyMHJlY3ljbGluZyUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzcxOTU3OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Campaña Escolar Verde',
      wasteType: 'Papel',
      date: '1-30 de Mayo, 2026',
      location: 'Colegios de Cbba',
      goal: '4,200 kg',
      collected: 3650,
      goalAmount: 4200,
      status: 'Activa',
      participants: 892,
      typeColor: 'yellow',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1654718421032-8aee5603b51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGJvdHRsZSUyMHJlY3ljbGluZyUyMGdyZWVufGVufDF8fHx8MTc3MTk1Nzk1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Reciclón Familiar',
      wasteType: 'Mixto',
      date: '15-16 de Junio, 2026',
      location: 'Plaza 14 de Septiembre',
      goal: '6,000 kg',
      collected: 4120,
      goalAmount: 6000,
      status: 'Activa',
      participants: 634,
      typeColor: 'purple',
    },
  ];

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      green: { bg: 'bg-green-100', text: 'text-green-700' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-700' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              ♻️ Campañas de Reciclaje
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Únete a nuestras campañas
            </h1>
            <p className="text-xl text-[#A5D6A7] mb-8">
              Participa en desafíos comunitarios de reciclaje y contribuye a alcanzar metas ambientales colectivas.
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
                placeholder="Buscar campaña por nombre o tipo de residuo..."
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
              const percentage = (campaign.collected / campaign.goalAmount) * 100;
              const typeColors = getTypeColorClasses(campaign.typeColor);

              return (
                <div
                  key={campaign.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={campaign.image}
                      alt={campaign.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <span className={`px-3 py-1.5 ${typeColors.bg} ${typeColors.text} rounded-full text-sm font-semibold backdrop-blur-sm`}>
                        {campaign.wasteType}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm ${
                        campaign.status === 'Activa' 
                          ? 'bg-[#4CAF50] text-white' 
                          : 'bg-white text-gray-700'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{campaign.name}</h3>

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
                        <Target className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm">Meta: {campaign.goal}</span>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-6 p-4 bg-[#E8F5E9] rounded-2xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-600">Progreso de recolección</span>
                        <span className="text-xs font-bold text-[#2E7D32]">{Math.round(percentage)}%</span>
                      </div>
                      <div className="h-2.5 bg-white rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-[#2E7D32]">
                          {campaign.collected.toLocaleString()} kg
                        </span>
                        <span className="text-xs text-gray-500">
                          de {campaign.goalAmount.toLocaleString()} kg
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Recycle className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm font-medium">{campaign.participants} participantes</span>
                      </div>
                    </div>

                    <Link
                      to={`/campanas-reciclaje/${campaign.id}`}
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

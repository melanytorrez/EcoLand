import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TreeDeciduous, Recycle, TrendingUp, Users, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router';

export default function Home() {
  const stats = [
    { icon: TreeDeciduous, label: 'Árboles Plantados', value: '15,432' },
    { icon: Recycle, label: 'Kg Reciclados', value: '328,567' },
    { icon: Users, label: 'Voluntarios Activos', value: '1,856' },
    { icon: TrendingUp, label: 'Campañas Activas', value: '24' },
  ];

  const campaigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Reforestación Parque Tunari',
      date: '24 de Febrero, 2026',
      location: 'Parque Nacional Tunari',
      spots: '45 cupos disponibles',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1729434170023-cad95b4e419f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlZm9yZXN0YXRpb24lMjBwYXJrJTIwbmF0dXJlfGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Bosques Urbanos Centro',
      date: '28 de Febrero, 2026',
      location: 'Plaza Colón',
      spots: '30 cupos disponibles',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Recuperación Zona Sur',
      date: '5 de Marzo, 2026',
      location: 'Av. Blanco Galindo',
      spots: '60 cupos disponibles',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1673656866903-7cbe7db8fb91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDb2NoYWJhbWJhJTIwQm9saXZpYSUyMGdyZWVuJTIwY2l0eSUyMGFlcmlhbHxlbnwxfHx8fDE3NzEyMTMzNDB8MA&ixlib=rb-4.1.0&q=80&w=1080')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E7D32]/90 to-[#1B5E20]/70" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl text-white">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              🌱 Cochabamba más verde
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Construyamos juntos un Cochabamba más verde
            </h1>
            <p className="text-xl md:text-2xl text-[#A5D6A7] mb-10 leading-relaxed">
              Participa en campañas de reforestación y mejora el reciclaje en tu ciudad.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/reforestacion"
                className="px-8 py-4 bg-white text-[#2E7D32] rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <TreeDeciduous className="w-5 h-5" />
                Ver campañas
              </Link>
              <Link
                to="/reciclaje"
                className="px-8 py-4 bg-[#4CAF50] text-white rounded-2xl font-semibold hover:bg-[#2E7D32] hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Recycle className="w-5 h-5" />
                Explorar reciclaje
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-4xl font-bold text-[#2E7D32] mb-2">{stat.value}</p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reforestation Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-sm font-semibold mb-4">
              🌳 Reforestación
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Campañas activas de reforestación
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Únete a nuestras campañas y ayuda a plantar árboles en Cochabamba
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
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
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-[#2E7D32]">
                    {campaign.spots.split(' ')[0]} cupos
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
                  </div>
                  <Link
                    to={`/reforestacion/${campaign.id}`}
                    className="block w-full px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white text-center rounded-2xl font-semibold hover:shadow-lg hover:shadow-[#4CAF50]/30 transition-all"
                  >
                    Participar
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/reforestacion"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#2E7D32] text-[#2E7D32] rounded-2xl font-semibold hover:bg-[#2E7D32] hover:text-white transition-all"
            >
              Ver todas las campañas
            </Link>
          </div>
        </div>
      </section>

      {/* Recycling Promo Section */}
      <section className="py-20 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white text-[#2E7D32] rounded-full text-sm font-semibold mb-6">
                ♻️ Reciclaje Inteligente
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Descubre puntos verdes y rutas de recolección
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Encuentra los centros de reciclaje más cercanos, conoce las rutas de los camiones y contribuye a un Cochabamba más limpio.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/reciclaje"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <Recycle className="w-5 h-5" />
                  Explorar sistema de reciclaje
                </Link>
                <Link
                  to="/campanas-reciclaje"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E7D32] border-2 border-[#2E7D32] rounded-2xl font-semibold hover:bg-[#2E7D32] hover:text-white hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Ver campañas de reciclaje
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1761494907751-faf14c99f7ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBzb3J0aW5nJTIwd2FzdGUlMjBtYW5hZ2VtZW50fGVufDF8fHx8MTc3MTIxMzM0MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Reciclaje"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
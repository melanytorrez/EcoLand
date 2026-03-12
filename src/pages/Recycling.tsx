import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MapPin, Truck, Users, TrendingUp, Navigation } from 'lucide-react';

export default function Recycling() {
  const nearbyPoints = [
    { name: 'Punto Verde Plaza Colón', distance: '0.8 km', status: 'Abierto', schedule: 'Lun-Vie 8:00-18:00' },
    { name: 'Punto Verde Mercado La Cancha', distance: '1.2 km', status: 'Abierto', schedule: 'Lun-Sáb 7:00-20:00' },
    { name: 'Punto Verde Parque Tunari', distance: '2.5 km', status: 'Cerrado', schedule: 'Lun-Dom 6:00-22:00' },
  ];

  const nextCollection = {
    day: 'Miércoles',
    date: '19 de Febrero',
    time: '08:00 AM',
    zone: 'Zona Norte - Centro',
    vehicle: 'Camión RF-123',
  };

  const impact = {
    recycled: '156 kg',
    trees: '12 árboles',
    co2: '340 kg CO₂',
    rank: 'Top 15%',
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              ♻️ Sistema de Reciclaje
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Recicla inteligentemente
            </h1>
            <p className="text-xl text-[#A5D6A7] mb-8">
              Encuentra puntos verdes, conoce las rutas de recolección y sigue el camino de los recicladores en Cochabamba.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mapa Interactivo</h2>
            <p className="text-lg text-gray-600">
              Explora puntos verdes, rutas de camiones y trayectorias de recicladores
            </p>
          </div>

          <div className="relative w-full h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
            {/* Map Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-[#2E7D32]"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#map-grid)" />
              </svg>
            </div>

            {/* Green Point Markers */}
            <div className="absolute top-1/4 left-1/4 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 w-14 h-14 bg-[#4CAF50] rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-full flex items-center justify-center shadow-2xl">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                <p className="text-sm font-bold text-gray-900">Plaza Colón</p>
                <p className="text-xs text-[#4CAF50]">Punto Verde • Abierto</p>
              </div>
            </div>

            <div className="absolute top-1/2 right-1/3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 w-14 h-14 bg-[#4CAF50] rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-full flex items-center justify-center shadow-2xl">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                <p className="text-sm font-bold text-gray-900">La Cancha</p>
                <p className="text-xs text-[#4CAF50]">Punto Verde • Abierto</p>
              </div>
            </div>

            {/* Truck Route Marker */}
            <div className="absolute top-1/3 right-1/4 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 w-14 h-14 bg-blue-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl">
                  <Truck className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                <p className="text-sm font-bold text-gray-900">Ruta Norte</p>
                <p className="text-xs text-blue-600">Camión en servicio</p>
              </div>
            </div>

            {/* Recycler Route Marker */}
            <div className="absolute bottom-1/3 left-1/3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 w-14 h-14 bg-yellow-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                <p className="text-sm font-bold text-gray-900">Zona Centro</p>
                <p className="text-xs text-yellow-600">Reciclador activo</p>
              </div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 space-y-4">
              <h3 className="font-bold text-gray-900 mb-3">Leyenda</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Puntos Verdes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Rutas Basura</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Recicladores</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Nearby Green Points */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Puntos Verdes</h3>
                  <p className="text-sm text-gray-600">Cercanos a ti</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {nearbyPoints.map((point, index) => (
                  <div key={index} className="p-4 bg-[#E8F5E9] rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-900 text-sm">{point.name}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          point.status === 'Abierto'
                            ? 'bg-[#4CAF50] text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {point.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Navigation className="w-3 h-3" />
                      <span>{point.distance}</span>
                      <span>•</span>
                      <span>{point.schedule}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
                Ver todos los puntos
              </button>
            </div>

            {/* Next Collection */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Truck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Próxima Ruta</h3>
                  <p className="text-sm text-gray-600">Recolección de basura</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Día:</span>
                  <span className="font-semibold text-gray-900">{nextCollection.day}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Fecha:</span>
                  <span className="font-semibold text-gray-900">{nextCollection.date}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Hora:</span>
                  <span className="font-semibold text-[#2E7D32]">{nextCollection.time}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Zona:</span>
                  <span className="font-semibold text-gray-900">{nextCollection.zone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vehículo:</span>
                  <span className="font-semibold text-gray-900">{nextCollection.vehicle}</span>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
                Ver todas las rutas
              </button>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-3xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Tu Impacto</h3>
                  <p className="text-sm text-[#A5D6A7]">Ambiental personal</p>
                </div>
              </div>

              <div className="space-y-6 mb-6">
                <div>
                  <p className="text-[#A5D6A7] text-sm mb-2">Total Reciclado</p>
                  <p className="text-4xl font-bold">{impact.recycled}</p>
                </div>
                <div>
                  <p className="text-[#A5D6A7] text-sm mb-2">Árboles Salvados</p>
                  <p className="text-4xl font-bold">{impact.trees}</p>
                </div>
                <div>
                  <p className="text-[#A5D6A7] text-sm mb-2">CO₂ Reducido</p>
                  <p className="text-4xl font-bold">{impact.co2}</p>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-[#A5D6A7] text-sm mb-2">Tu Ranking</p>
                  <p className="text-2xl font-bold">{impact.rank}</p>
                  <p className="text-xs text-[#A5D6A7] mt-1">de todos los recicladores</p>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-white text-[#2E7D32] rounded-2xl font-semibold hover:shadow-2xl transition-all">
                Ver estadísticas completas
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { MapPin, Truck } from 'lucide-react';

export function MapSection() {
  const greenPoints = [
    { id: 1, name: 'Plaza 14 de Septiembre', x: 25, y: 30 },
    { id: 2, name: 'Parque Vial', x: 65, y: 45 },
    { id: 3, name: 'Centro Cultural', x: 40, y: 60 },
    { id: 4, name: 'Mercado La Cancha', x: 75, y: 25 },
    { id: 5, name: 'Parque Tunari', x: 50, y: 80 },
  ];

  const routes = [
    { id: 1, name: 'Ruta Norte', x: 70, y: 35 },
    { id: 2, name: 'Ruta Sur', x: 45, y: 70 },
    { id: 3, name: 'Ruta Centro', x: 30, y: 50 },
  ];

  return (
    <section id="routes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Mapa Interactivo
          </h2>
          <p className="text-lg text-gray-600">
            Encuentra puntos verdes y rutas de recolección cerca de ti
          </p>
        </div>

        <div className="relative w-full h-[500px] bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-xl overflow-hidden border-2 border-emerald-100">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-600" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Streets/Routes */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 100 150 Q 250 200 400 180 T 700 250"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              className="opacity-40"
            />
            <path
              d="M 150 400 Q 350 380 500 420 T 750 400"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              className="opacity-40"
            />
            <path
              d="M 200 100 Q 220 250 250 400"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              className="opacity-40"
            />
          </svg>

          {/* Green Points */}
          {greenPoints.map((point) => (
            <div
              key={point.id}
              className="absolute group cursor-pointer"
              style={{ left: `${point.x}%`, top: `${point.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative">
                <div className="absolute inset-0 w-12 h-12 bg-emerald-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <p className="text-sm font-medium text-gray-900">{point.name}</p>
                <p className="text-xs text-emerald-600">Green Point</p>
              </div>
            </div>
          ))}

          {/* Collection Vehicles */}
          {routes.map((route, index) => (
            <div
              key={route.id}
              className="absolute group cursor-pointer animate-pulse"
              style={{ 
                left: `${route.x}%`, 
                top: `${route.y}%`, 
                transform: 'translate(-50%, -50%)',
                animationDelay: `${index * 0.5}s`
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 w-12 h-12 bg-green-600 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <p className="text-sm font-medium text-gray-900">{route.name}</p>
                <p className="text-xs text-green-600">Ruta Activa</p>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-gray-700">Puntos Verdes</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">Rutas de Recolección</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
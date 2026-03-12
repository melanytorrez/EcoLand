import { MapPin, Route, BarChart3, Users } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: 'Ubicación de Puntos Verdes',
      description: 'Encuentra los puntos de reciclaje más cercanos en Cochabamba con disponibilidad en tiempo real',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Route,
      title: 'Rutas de Recolección',
      description: 'Rastrea los vehículos de recolección de residuos y sus horarios en tu vecindario',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: BarChart3,
      title: 'Estadísticas Ambientales',
      description: 'Monitorea el impacto ambiental y el progreso del reciclaje en la ciudad',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      icon: Users,
      title: 'Información para Recicladores',
      description: 'Accede a recursos, guías y apoyo para recicladores de la comunidad',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
    },
  ];

  return (
    <section id="green-points" className="py-20 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Nuestras Funciones
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas para participar en la creación de una Cochabamba más limpia y verde
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
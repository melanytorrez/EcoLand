import { ArrowRight, Recycle } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              🌱 Cochabamba más verde
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Recicla y cuida tu{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                ciudad
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
              Conoce puntos verdes y rutas de recolección en Cochabamba
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                Explorar Mapa
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-200 rounded-full hover:border-emerald-400 hover:shadow-lg transition-all duration-300">
                Conocer Más
              </button>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <Recycle className="w-40 h-40 sm:w-52 sm:h-52 text-white animate-spin" style={{ animationDuration: '10s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
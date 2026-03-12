import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <Leaf className="w-7 h-7 text-[#2E7D32]" />
              </div>
              <span className="text-2xl font-bold">EcoLand</span>
            </div>
            <p className="text-[#A5D6A7] leading-relaxed mb-6">
              Plataforma líder en gestión ambiental de Cochabamba. Juntos construimos un futuro más verde y sostenible.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#A5D6A7]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Cochabamba, Bolivia</span>
              </div>
              <div className="flex items-center gap-3 text-[#A5D6A7]">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contacto@ecoland.bo</span>
              </div>
              <div className="flex items-center gap-3 text-[#A5D6A7]">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+591 4 XXX XXXX</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Plataforma</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/reforestacion" className="text-[#A5D6A7] hover:text-white transition-colors text-sm">
                  Reforestación
                </Link>
              </li>
              <li>
                <Link to="/reciclaje" className="text-[#A5D6A7] hover:text-white transition-colors text-sm">
                  Reciclaje
                </Link>
              </li>
              <li>
                <Link to="/estadisticas" className="text-[#A5D6A7] hover:text-white transition-colors text-sm">
                  Estadísticas
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-[#A5D6A7] hover:text-white transition-colors text-sm">
                  Panel Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Ayuda</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#A5D6A7] hover:text-white transition-colors text-sm">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A5D6A7] hover:text-white transition-colors text-sm">
                  Guía de usuario
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A5D6A7] hover:text-white transition-colors text-sm">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A5D6A7] hover:text-white transition-colors text-sm">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20 text-center">
          <p className="text-[#A5D6A7] text-sm">
            © 2026 EcoLand. Todos los derechos reservados. Haciendo de Cochabamba una ciudad más verde 🌱
          </p>
        </div>
      </div>
    </footer>
  );
}

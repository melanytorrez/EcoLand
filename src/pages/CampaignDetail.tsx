import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  User,
} from "lucide-react";
import { useParams, Link } from "react-router";

export default function CampaignDetail() {
  const { id } = useParams();

  // Mock campaign data
  const campaign = {
    id: id || "1",
    image:
      "https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Reforestación Parque Tunari",
    date: "24 de Febrero, 2026",
    time: "08:00 AM - 02:00 PM",
    location: "Parque Nacional Tunari",
    address:
      "Entrada principal del Parque Tunari, carretera a Sacaba",
    spots: 45,
    participants: 32,
    organizer: "Alcaldía de Cochabamba",
    organizerContact: "eventos@cochabamba.gob.bo",
    status: "Activa",
    description: `Esta campaña de reforestación tiene como objetivo recuperar áreas degradadas del Parque Nacional Tunari, uno de los pulmones verdes más importantes de Cochabamba.

Durante la jornada se plantarán especies nativas como queñua, aliso y pino de monte, contribuyendo a la recuperación de la biodiversidad local y la protección de las cuencas hidrográficas.

La actividad incluye:
• Capacitación sobre técnicas de plantación
• Provisión de herramientas y material vegetal
• Almuerzo y refrigerio
• Certificado de participación

Se recomienda llevar:
• Ropa cómoda y abrigada
• Protector solar y gorra
• Botella de agua reutilizable
• Guantes de jardinería (opcional)`,
    requirements: [
      "Ser mayor de 12 años (menores acompañados)",
      "Inscripción previa obligatoria",
      "Compromiso de asistencia",
      "Seguir indicaciones del equipo organizador",
    ],
  };

  const availableSpots = campaign.spots - campaign.participants;
  const percentage =
    (campaign.participants / campaign.spots) * 100;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Image */}
      <section className="relative h-[400px]">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-[#4CAF50] text-white rounded-full text-sm font-semibold">
                {campaign.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {campaign.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Descripción
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                  {campaign.description}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Requisitos
                </h2>
                <ul className="space-y-3">
                  {campaign.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#E8F5E9] rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-[#2E7D32] mb-4">
                  Información del Organizador
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#4CAF50]" />
                    <span className="font-semibold text-gray-900">
                      {campaign.organizer}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">
                      Contacto: {campaign.organizerContact}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - CTA Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Fecha
                      </p>
                      <p className="font-semibold text-gray-900">
                        {campaign.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Horario
                      </p>
                      <p className="font-semibold text-gray-900">
                        {campaign.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Ubicación
                      </p>
                      <p className="font-semibold text-gray-900">
                        {campaign.location}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {campaign.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">
                        Cupos disponibles
                      </p>
                      <p className="font-semibold text-[#2E7D32] text-2xl mb-2">
                        {availableSpots} de {campaign.spots}
                      </p>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full px-8 py-4 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all mb-4">
                  Quiero ser voluntario
                </button>

                <Link
                  to="/reforestacion"
                  className="block w-full px-8 py-4 border-2 border-gray-200 text-gray-700 text-center rounded-2xl font-semibold hover:border-[#4CAF50] hover:text-[#2E7D32] transition-all"
                >
                  Ver otras campañas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
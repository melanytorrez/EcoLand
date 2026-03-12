import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Calendar, MapPin, Target, TrendingUp, Users, CheckCircle, Award } from 'lucide-react';
import { useParams, Link } from 'react-router';

export default function RecyclingCampaignDetail() {
  const { id } = useParams();

  // Mock campaign data
  const campaign = {
    id: id || '1',
    image: 'https://images.unsplash.com/photo-1703223513358-12fde6b96580?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwcmVjeWNsaW5nJTIwY2FtcGFpZ24lMjBzb3J0aW5nfGVufDF8fHx8MTc3MTk1Nzk1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Junio sin Plástico',
    wasteType: 'Plástico',
    date: '1-30 de Junio, 2026',
    location: 'Toda la ciudad de Cochabamba',
    goal: '5,000 kg',
    collected: 3240,
    goalAmount: 5000,
    status: 'Activa',
    participants: 456,
    organizer: 'Alcaldía de Cochabamba',
    organizerContact: 'reciclaje@cochabamba.gob.bo',
    description: `La campaña "Junio sin Plástico" es una iniciativa ambiciosa que busca reducir significativamente el consumo de plástico de un solo uso en toda la ciudad de Cochabamba durante todo el mes de junio.

Esta campaña tiene como objetivo principal:

• Recolectar 5,000 kg de residuos plásticos para su correcto reciclaje
• Concientizar a la población sobre el impacto ambiental del plástico
• Promover alternativas sostenibles y reutilizables
• Fortalecer la red de puntos verdes en la ciudad

¿Cómo participar?

1. Registra tu participación en la plataforma
2. Separa tus residuos plásticos en casa
3. Lleva tus plásticos a cualquier punto verde de la ciudad
4. Registra el peso de tu contribución
5. Gana puntos y premios por tu aporte

Tipos de plástico que aceptamos:
• Botellas PET (agua, gaseosas)
• Envases de productos de limpieza
• Bolsas plásticas limpias y secas
• Envases de alimentos (limpios)
• Tapas y tapones plásticos`,
    benefits: [
      'Certificado digital de participación',
      'Puntos canjeables por productos eco-friendly',
      'Reconocimiento en redes sociales',
      'Contribución al ranking de recicladores',
    ],
    rewards: [
      { rank: 'Oro', requirement: '100+ kg', participants: 12 },
      { rank: 'Plata', requirement: '50-99 kg', participants: 34 },
      { rank: 'Bronce', requirement: '20-49 kg', participants: 78 },
    ],
  };

  const percentage = (campaign.collected / campaign.goalAmount) * 100;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Image */}
      <section className="relative h-[400px]">
        <img
          src={campaign.image}
          alt={campaign.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold backdrop-blur-sm">
                {campaign.wasteType}
              </span>
              <span className="px-4 py-2 bg-[#4CAF50] text-white rounded-full text-sm font-semibold backdrop-blur-sm">
                {campaign.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {campaign.name}
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
              {/* Progress Card */}
              <div className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-3xl p-8 mb-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Progreso de la Campaña</h2>
                    <p className="text-gray-600">¡Estamos muy cerca de la meta!</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Recolección actual</span>
                    <span className="text-lg font-bold text-[#2E7D32]">{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-[#2E7D32]">
                      {campaign.collected.toLocaleString()} kg
                    </span>
                    <span className="text-gray-600">
                      de {campaign.goalAmount.toLocaleString()} kg
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <Users className="w-6 h-6 text-[#4CAF50] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{campaign.participants}</p>
                    <p className="text-sm text-gray-600">Participantes</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <Target className="w-6 h-6 text-[#4CAF50] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {(campaign.goalAmount - campaign.collected).toLocaleString()} kg
                    </p>
                    <p className="text-sm text-gray-600">Por alcanzar</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
                <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                  {campaign.description}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Beneficios de Participar</h2>
                <ul className="space-y-3">
                  {campaign.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rewards */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-yellow-200">
                <div className="flex items-center gap-4 mb-6">
                  <Award className="w-10 h-10 text-yellow-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Sistema de Recompensas</h2>
                    <p className="text-gray-600">Gana reconocimientos por tu contribución</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {campaign.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          reward.rank === 'Oro' ? 'bg-yellow-400' :
                          reward.rank === 'Plata' ? 'bg-gray-300' :
                          'bg-orange-400'
                        }`}>
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{reward.rank}</p>
                          <p className="text-sm text-gray-600">{reward.requirement}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {reward.participants} personas
                      </span>
                    </div>
                  ))}
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
                      <p className="text-sm text-gray-500 mb-1">Fecha</p>
                      <p className="font-semibold text-gray-900">{campaign.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                      <p className="font-semibold text-gray-900">{campaign.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Meta de recolección</p>
                      <p className="font-semibold text-[#2E7D32] text-2xl">{campaign.goal}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full px-8 py-4 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all mb-4">
                  Sumarme a la campaña
                </button>

                <Link
                  to="/campanas-reciclaje"
                  className="block w-full px-8 py-4 border-2 border-gray-200 text-gray-700 text-center rounded-2xl font-semibold hover:border-[#4CAF50] hover:text-[#2E7D32] transition-all"
                >
                  Ver otras campañas
                </Link>

                <div className="mt-8 p-6 bg-[#E8F5E9] rounded-2xl">
                  <h3 className="font-bold text-[#2E7D32] mb-3">Organizado por:</h3>
                  <p className="font-semibold text-gray-900 mb-2">{campaign.organizer}</p>
                  <p className="text-sm text-gray-600">{campaign.organizerContact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

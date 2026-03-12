import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TreeDeciduous, Recycle, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

export default function Statistics() {
  const stats = [
    { icon: TreeDeciduous, label: 'Árboles Plantados', value: '15,432', change: '+1,234 este mes', color: 'from-[#2E7D32] to-[#4CAF50]' },
    { icon: Recycle, label: 'Kg Reciclados', value: '328,567', change: '+12,450 este mes', color: 'from-blue-500 to-blue-700' },
    { icon: Users, label: 'Voluntarios Activos', value: '1,856', change: '+142 este mes', color: 'from-purple-500 to-purple-700' },
    { icon: TrendingUp, label: 'Campañas Activas', value: '24', change: '+3 esta semana', color: 'from-orange-500 to-orange-700' },
  ];

  const monthlyTrees = [
    { month: 'Ene', arboles: 890 },
    { month: 'Feb', arboles: 1240 },
    { month: 'Mar', arboles: 1100 },
    { month: 'Abr', arboles: 1560 },
    { month: 'May', arboles: 1420 },
    { month: 'Jun', arboles: 1680 },
  ];

  const recyclingData = [
    { name: 'Plástico', value: 35, color: '#4CAF50' },
    { name: 'Papel', value: 25, color: '#2E7D32' },
    { name: 'Vidrio', value: 20, color: '#A5D6A7' },
    { name: 'Metal', value: 15, color: '#66BB6A' },
    { name: 'Orgánico', value: 5, color: '#81C784' },
  ];

  const zoneData = [
    { zone: 'Norte', reciclaje: 180, reforestacion: 45 },
    { zone: 'Sur', reciclaje: 145, reforestacion: 38 },
    { zone: 'Este', reciclaje: 95, reforestacion: 28 },
    { zone: 'Oeste', reciclaje: 120, reforestacion: 32 },
    { zone: 'Centro', reciclaje: 210, reforestacion: 52 },
  ];

  const participationData = [
    { month: 'Ene', voluntarios: 1420 },
    { month: 'Feb', voluntarios: 1580 },
    { month: 'Mar', voluntarios: 1650 },
    { month: 'Abr', voluntarios: 1720 },
    { month: 'May', voluntarios: 1790 },
    { month: 'Jun', voluntarios: 1856 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              📊 Estadísticas Ambientales
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Nuestro impacto en números
            </h1>
            <p className="text-xl text-[#A5D6A7] mb-8">
              Visualiza el progreso colectivo de Cochabamba hacia un futuro más verde y sostenible.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-16 bg-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-gray-600 font-medium mb-3">{stat.label}</p>
                  <p className="text-sm text-[#4CAF50] font-semibold">{stat.change}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Trees Planted Monthly */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-2xl flex items-center justify-center">
                  <TreeDeciduous className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Árboles Plantados</h3>
                  <p className="text-sm text-gray-600">Progreso mensual</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrees}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '1rem',
                    }}
                  />
                  <Bar dataKey="arboles" fill="url(#colorGradient)" radius={[12, 12, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4CAF50" />
                      <stop offset="100%" stopColor="#2E7D32" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recycling Distribution */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Distribución de Residuos</h3>
                  <p className="text-sm text-gray-600">Por tipo de material</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={recyclingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {recyclingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Zone Activity */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Actividad por Zona</h3>
                <p className="text-sm text-gray-600">Reciclaje y reforestación</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={zoneData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="zone" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '1rem',
                  }}
                />
                <Legend />
                <Bar dataKey="reciclaje" fill="#4CAF50" radius={[12, 12, 0, 0]} name="Kg Reciclados" />
                <Bar dataKey="reforestacion" fill="#2E7D32" radius={[12, 12, 0, 0]} name="Árboles Plantados" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Volunteer Participation */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Crecimiento de Voluntarios</h3>
                <p className="text-sm text-gray-600">Participación mensual</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '1rem',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="voluntarios" 
                  stroke="#4CAF50" 
                  strokeWidth={3}
                  dot={{ fill: '#2E7D32', strokeWidth: 2, r: 6 }}
                  name="Voluntarios Activos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Impact Summary */}
      <section className="py-16 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Impacto Ambiental Acumulado
            </h2>
            <p className="text-lg text-gray-600">
              El resultado de nuestro esfuerzo colectivo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 text-center shadow-xl">
              <div className="text-6xl mb-4">🌳</div>
              <p className="text-5xl font-bold text-[#2E7D32] mb-2">15,432</p>
              <p className="text-gray-600 font-medium mb-4">Árboles plantados</p>
              <p className="text-sm text-gray-500">Equivalente a 185 hectáreas de bosque</p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-xl">
              <div className="text-6xl mb-4">♻️</div>
              <p className="text-5xl font-bold text-[#2E7D32] mb-2">328 ton</p>
              <p className="text-gray-600 font-medium mb-4">Residuos reciclados</p>
              <p className="text-sm text-gray-500">Reducción de 520 toneladas de CO₂</p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-xl">
              <div className="text-6xl mb-4">💧</div>
              <p className="text-5xl font-bold text-[#2E7D32] mb-2">2.4M L</p>
              <p className="text-gray-600 font-medium mb-4">Agua ahorrada</p>
              <p className="text-sm text-gray-500">Gracias al reciclaje de papel y plástico</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

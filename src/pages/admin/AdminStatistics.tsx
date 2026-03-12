import { Download, BarChart3, TreeDeciduous, Recycle, Users } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminStatistics() {
  const monthlyData = [
    { month: 'Ene', reforestacion: 45, reciclaje: 52 },
    { month: 'Feb', reforestacion: 52, reciclaje: 48 },
    { month: 'Mar', reforestacion: 48, reciclaje: 61 },
    { month: 'Abr', reforestacion: 61, reciclaje: 55 },
    { month: 'May', reforestacion: 55, reciclaje: 67 },
    { month: 'Jun', reforestacion: 67, reciclaje: 72 },
  ];

  const wasteData = [
    { name: 'Plástico', value: 35, color: '#4CAF50' },
    { name: 'Papel', value: 25, color: '#2E7D32' },
    { name: 'Vidrio', value: 20, color: '#A5D6A7' },
    { name: 'Metal', value: 15, color: '#66BB6A' },
    { name: 'Orgánico', value: 5, color: '#81C784' },
  ];

  const zoneData = [
    { zone: 'Norte', value: 180 },
    { zone: 'Sur', value: 145 },
    { zone: 'Este', value: 95 },
    { zone: 'Oeste', value: 120 },
    { zone: 'Centro', value: 210 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Estadísticas y Reportes</h1>
          <p className="text-gray-600 text-lg">Análisis avanzado del sistema</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-2xl font-semibold hover:shadow-xl transition-all">
          <Download className="w-5 h-5" />
          Exportar Reporte
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-3xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <TreeDeciduous className="w-7 h-7" />
            </div>
            <span className="text-sm bg-white/20 px-3 py-1.5 rounded-full">+18%</span>
          </div>
          <p className="text-5xl font-bold mb-2">328</p>
          <p className="text-[#A5D6A7]">Árboles este mes</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
              <Recycle className="w-7 h-7 text-blue-600" />
            </div>
            <span className="text-sm bg-[#E8F5E9] text-[#2E7D32] px-3 py-1.5 rounded-full font-semibold">+12%</span>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">168</p>
          <p className="text-gray-600">Toneladas recicladas</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <span className="text-sm bg-[#E8F5E9] text-[#2E7D32] px-3 py-1.5 rounded-full font-semibold">+8%</span>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">2.4K</p>
          <p className="text-gray-600">Usuarios activos</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-orange-600" />
            </div>
            <span className="text-sm bg-[#E8F5E9] text-[#2E7D32] px-3 py-1.5 rounded-full font-semibold">100%</span>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">92%</p>
          <p className="text-gray-600">Eficiencia operativa</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Actividades Mensuales</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reforestacion" stroke="#4CAF50" strokeWidth={3} name="Reforestación" />
              <Line type="monotone" dataKey="reciclaje" stroke="#2E7D32" strokeWidth={3} name="Reciclaje" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Distribución de Residuos</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={wasteData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={110}
                dataKey="value"
              >
                {wasteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Actividad por Zona</h3>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={zoneData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="zone" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="value" fill="#4CAF50" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

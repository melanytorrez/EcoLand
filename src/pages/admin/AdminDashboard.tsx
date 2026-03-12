import { TreeDeciduous, MapPin, Route as RouteIcon, Users, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Campañas Activas',
      value: '24',
      icon: TreeDeciduous,
      color: 'from-[#2E7D32] to-[#4CAF50]',
      bgColor: 'bg-[#E8F5E9]',
      change: '+3 esta semana',
    },
    {
      label: 'Puntos Verdes',
      value: '18',
      icon: MapPin,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      change: '16 activos',
    },
    {
      label: 'Rutas Activas',
      value: '12',
      icon: RouteIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      change: '8 completadas hoy',
    },
    {
      label: 'Usuarios Registrados',
      value: '2,456',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      change: '+142 este mes',
    },
  ];

  const campaignData = [
    { month: 'Ene', participantes: 320 },
    { month: 'Feb', participantes: 450 },
    { month: 'Mar', participantes: 380 },
    { month: 'Abr', participantes: 520 },
    { month: 'May', participantes: 480 },
    { month: 'Jun', participantes: 640 },
  ];

  const recyclingData = [
    { name: 'Plástico', value: 35, color: '#4CAF50' },
    { name: 'Papel', value: 25, color: '#2E7D32' },
    { name: 'Vidrio', value: 20, color: '#A5D6A7' },
    { name: 'Metal', value: 15, color: '#66BB6A' },
    { name: 'Orgánico', value: 5, color: '#81C784' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-600 text-lg">Resumen general del sistema EcoLand</p>
      </div>

      {/* Stats Grid */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-3xl p-8 border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all`}>
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-base font-semibold text-gray-700 mb-3">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Campaign Participation */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Participación en Campañas</h3>
              <p className="text-sm text-gray-500">Voluntarios por mes</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={campaignData}>
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
              <Bar dataKey="participantes" fill="url(#colorGradient)" radius={[12, 12, 0, 0]} />
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
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Distribución de Residuos</h3>
              <p className="text-sm text-gray-500">Porcentaje por tipo</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={recyclingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={110}
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

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Actividad Reciente</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center flex-shrink-0">
              <TreeDeciduous className="w-6 h-6 text-[#2E7D32]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Nueva campaña creada</p>
              <p className="text-sm text-gray-500">Reforestación Parque Tunari - Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Punto verde actualizado</p>
              <p className="text-sm text-gray-500">Plaza 14 de Septiembre - Hace 4 horas</p>
            </div>
          </div>
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <RouteIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Ruta completada</p>
              <p className="text-sm text-gray-500">Ruta Norte - Zona Centro - Hace 6 horas</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Nuevo usuario registrado</p>
              <p className="text-sm text-gray-500">Usuario #2456 - Hace 8 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

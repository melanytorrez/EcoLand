import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, MapPinned, Truck as TruckIcon, Leaf } from 'lucide-react';

export function StatisticsSection() {
  const recyclingData = [
    { month: 'Ene', tons: 45 },
    { month: 'Feb', tons: 52 },
    { month: 'Mar', tons: 61 },
    { month: 'Abr', tons: 58 },
    { month: 'May', tons: 70 },
    { month: 'Jun', tons: 78 },
  ];

  const wasteTypeData = [
    { name: 'Plástico', value: 35, color: '#10b981' },
    { name: 'Papel', value: 25, color: '#14b8a6' },
    { name: 'Vidrio', value: 20, color: '#06b6d4' },
    { name: 'Metal', value: 15, color: '#0891b2' },
    { name: 'Otros', value: 5, color: '#0e7490' },
  ];

  const stats = [
    {
      icon: MapPinned,
      value: '24',
      label: 'Zonas Recicladas',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: TruckIcon,
      value: '12',
      label: 'Rutas Activas',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Leaf,
      value: '458',
      label: 'Toneladas Recicladas',
      suffix: 't',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      icon: TrendingUp,
      value: '87',
      label: 'Impacto Ambiental',
      suffix: '%',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
    },
  ];

  return (
    <section id="statistics" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Nuestro Impacto
          </h2>
          <p className="text-lg text-gray-600">
            Estadísticas en tiempo real de nuestro progreso ambiental
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-2xl p-6 text-center`}
              >
                <div className="flex justify-center mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 shadow-md border border-emerald-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Monthly Recycling Progress
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recyclingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #d1fae5',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="tons" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 shadow-md border border-emerald-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Distribución por Tipo de Residuo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {wasteTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #d1fae5',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
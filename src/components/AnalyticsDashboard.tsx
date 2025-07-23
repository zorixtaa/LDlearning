import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Clock, Award, AlertTriangle, Download } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const performanceData = [
    { module: 'Transport Basics', avgScore: 89, completions: 45, failures: 3 },
    { module: 'Direct Loads', avgScore: 82, completions: 38, failures: 7 },
    { module: 'Romper Pedido', avgScore: 76, completions: 28, failures: 12 },
    { module: 'Ferry & Customs', avgScore: 85, completions: 35, failures: 5 },
    { module: 'Driving Times', avgScore: 91, completions: 42, failures: 2 },
    { module: 'Pallet Exchange', avgScore: 78, completions: 31, failures: 9 },
    { module: 'Incidents', avgScore: 83, completions: 33, failures: 6 },
    { module: 'Order Mgmt', avgScore: 74, completions: 25, failures: 15 }
  ];

  const timeSpentData = [
    { week: 'Sem 1', hours: 120 },
    { week: 'Sem 2', hours: 145 },
    { week: 'Sem 3', hours: 132 },
    { week: 'Sem 4', hours: 167 },
    { week: 'Sem 5', hours: 189 },
    { week: 'Sem 6', hours: 201 }
  ];

  const departmentData = [
    { name: 'Trucking', value: 35, color: '#3B82F6' },
    { name: 'Frigo', value: 28, color: '#10B981' },
    { name: 'Tautliner', value: 22, color: '#F59E0B' },
    { name: 'Customs', value: 15, color: '#EF4444' }
  ];

  const certificationTrends = [
    { month: 'Jul', issued: 23, expired: 2, revoked: 0 },
    { month: 'Ago', issued: 31, expired: 1, revoked: 1 },
    { month: 'Sep', issued: 28, expired: 3, revoked: 0 },
    { month: 'Oct', issued: 35, expired: 2, revoked: 0 },
    { month: 'Nov', issued: 42, expired: 4, revoked: 1 },
    { month: 'Dic', issued: 38, expired: 1, revoked: 0 }
  ];

  const kpiCards = [
    {
      title: 'Tasa de Finalización',
      value: '78.5%',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      title: 'Usuarios Activos',
      value: '247',
      change: '+12 este mes',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'Tiempo Promedio',
      value: '4.2h',
      change: '-0.3h desde el mes pasado',
      changeType: 'positive' as const,
      icon: Clock
    },
    {
      title: 'Certificados Válidos',
      value: '1,205',
      change: '+89 esta semana',
      changeType: 'positive' as const,
      icon: Award
    }
  ];

  const alerts = [
    {
      type: 'warning',
      message: '12 usuarios con múltiples intentos fallidos en "Romper Pedido"',
      time: '2 horas'
    },
    {
      type: 'info',
      message: 'Actualización de módulo "Ferry & Customs" programada para mañana',
      time: '4 horas'
    },
    {
      type: 'error',
      message: '3 certificados próximos a vencer requieren renovación',
      time: '6 horas'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Análisis completo de rendimiento y progreso</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4" />
          Exportar Reporte
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <span className={`text-sm font-medium ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                <p className="text-sm text-gray-600">{kpi.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Módulo</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="module" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgScore" fill="#3B82F6" name="Puntuación Promedio" />
              <Bar dataKey="completions" fill="#10B981" name="Finalizaciones" />
              <Bar dataKey="failures" fill="#EF4444" name="Fallos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Spent Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tiempo de Estudio Semanal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSpentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Departamento</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Certification Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencias de Certificación</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={certificationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="issued" stroke="#10B981" strokeWidth={2} name="Emitidos" />
              <Line type="monotone" dataKey="expired" stroke="#F59E0B" strokeWidth={2} name="Expirados" />
              <Line type="monotone" dataKey="revoked" stroke="#EF4444" strokeWidth={2} name="Revocados" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-900">Alertas del Sistema</h2>
        </div>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'error' ? 'bg-red-50 border-red-500' :
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <span className="text-xs text-gray-500">hace {alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
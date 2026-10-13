import { useApp } from '../store';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function Dashboard() {
  const { tasks } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Tareas',
      value: totalTasks,
      icon: <TrendingUp size={20} />,
      color: 'from-teal-400 to-teal-500',
      bgColor: 'bg-teal-50',
      change: '+12%',
      up: true,
    },
    {
      label: 'Completadas',
      value: completedTasks,
      icon: <CheckCircle2 size={20} />,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      change: '+8%',
      up: true,
    },
    {
      label: 'En Progreso',
      value: inProgressTasks,
      icon: <Clock size={20} />,
      color: 'from-orange-400 to-orange-500',
      bgColor: 'bg-orange-50',
      change: '-3%',
      up: false,
    },
    {
      label: 'Urgentes',
      value: urgentTasks,
      icon: <AlertTriangle size={20} />,
      color: 'from-red-400 to-red-500',
      bgColor: 'bg-red-50',
      change: '+2',
      up: true,
    },
  ];

  const recentTasks = tasks.slice(0, 5);

  const priorityColors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  };

  const statusColors: Record<string, string> = {
    'todo': 'bg-gray-100 text-gray-600',
    'in-progress': 'bg-teal-100 text-teal-700',
    'review': 'bg-purple-100 text-purple-700',
    'done': 'bg-green-100 text-green-700',
  };

  const statusLabels: Record<string, string> = {
    'todo': 'Por hacer',
    'in-progress': 'En progreso',
    'review': 'En revisión',
    'done': 'Completada',
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                  {stat.icon}
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 lg:col-span-1">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Progreso General</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#f0f0f0"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${completionRate * 2.51} 251`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0D9488" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{completionRate}%</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                Completadas
              </span>
              <span className="font-medium">{completedTasks}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                En progreso
              </span>
              <span className="font-medium">{inProgressTasks}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                Pendientes
              </span>
              <span className="font-medium">{totalTasks - completedTasks - inProgressTasks}</span>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Tareas Recientes</h3>
          <div className="space-y-3">
            {recentTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-50"
              >
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'done' ? 'bg-green-500' :
                  task.status === 'in-progress' ? 'bg-teal-500' :
                  task.status === 'review' ? 'bg-purple-500' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{task.assignee}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium hidden sm:inline ${statusColors[task.status]}`}>
                  {statusLabels[task.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Actividad del Equipo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'María García', tasks: 3, avatar: 'MG', color: 'from-teal-400 to-teal-500' },
            { name: 'Carlos López', tasks: 4, avatar: 'CL', color: 'from-orange-400 to-orange-500' },
            { name: 'Ana Martínez', tasks: 3, avatar: 'AM', color: 'from-purple-400 to-purple-500' },
            { name: 'Pedro Sánchez', tasks: 2, avatar: 'PS', color: 'from-cyan-400 to-cyan-500' },
          ].map((member, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-xs`}>
                {member.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{member.name}</p>
                <p className="text-xs text-gray-400">{member.tasks} tareas activas</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

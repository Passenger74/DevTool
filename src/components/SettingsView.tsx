import { useAuth } from '../auth';
import { useApp } from '../store';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function SettingsView() {
  const { user } = useAuth();
  const { calendarConnection } = useApp();

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Configuración</h2>
        <p className="text-sm text-gray-500">Administra tu cuenta y preferencias</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <User size={20} className="text-teal-600" />
          <h3 className="font-semibold text-gray-800">Perfil</h3>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-orange-400 flex items-center justify-center text-white font-bold text-xl">
            {user?.avatar}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full mt-1">
              <CheckCircle2 size={10} />
              Verificado con Google
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe size={20} className="text-teal-600" />
          <h3 className="font-semibold text-gray-800">Integraciones</h3>
        </div>

        <div className="space-y-3">
          {/* Google Calendar */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Google Calendar</p>
                <p className="text-xs text-gray-500">
                  {calendarConnection.connected
                    ? `Conectado como ${calendarConnection.email}`
                    : 'Sincroniza tareas con tu calendario'}
                </p>
              </div>
            </div>
            {calendarConnection.connected ? (
              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle2 size={12} />
                Conectado
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <XCircle size={12} />
                No conectado
              </span>
            )}
          </div>

          {/* Google Drive (placeholder) */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Globe size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Google Drive</p>
                <p className="text-xs text-gray-500">Adjunta archivos a tus tareas</p>
              </div>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              Próximamente
            </span>
          </div>

          {/* Slack (placeholder) */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Bell size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Slack</p>
                <p className="text-xs text-gray-500">Recibe notificaciones en Slack</p>
              </div>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              Próximamente
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell size={20} className="text-teal-600" />
          <h3 className="font-semibold text-gray-800">Notificaciones</h3>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Notificaciones por email', desc: 'Recibe actualizaciones por email', defaultChecked: true },
            { label: 'Recordatorios de tareas', desc: 'Te avisamos antes de la fecha límite', defaultChecked: true },
            { label: 'Menciones y comentarios', desc: 'Cuando alguien te menciona', defaultChecked: true },
            { label: 'Nuevas asignaciones', desc: 'Cuando te asignan una tarea', defaultChecked: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={20} className="text-teal-600" />
          <h3 className="font-semibold text-gray-800">Seguridad</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-700">Autenticación de dos factores</p>
              <p className="text-xs text-gray-500">Añade una capa extra de seguridad</p>
            </div>
            <button className="text-sm text-teal-600 font-medium hover:underline">
              Configurar
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-700">Sesiones activas</p>
              <p className="text-xs text-gray-500">1 sesión activa</p>
            </div>
            <button className="text-sm text-gray-600 font-medium hover:underline">
              Ver todas
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette size={20} className="text-teal-600" />
          <h3 className="font-semibold text-gray-800">Apariencia</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
            <div className="flex gap-2">
              <button className="flex-1 p-3 rounded-lg border-2 border-teal-500 bg-white text-sm font-medium text-gray-700">
                ☀️ Claro
              </button>
              <button className="flex-1 p-3 rounded-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300">
                🌙 Oscuro
              </button>
              <button className="flex-1 p-3 rounded-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300">
                💻 Sistema
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

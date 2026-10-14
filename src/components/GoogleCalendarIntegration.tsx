import { useState } from 'react';
import { useApp } from '../store';
import { useAuth } from '../auth';
import {
  Calendar,
  Link2,
  Unlink,
  RefreshCw,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

export default function GoogleCalendarIntegration() {
  const { calendarConnection, connectGoogleCalendar, disconnectGoogleCalendar, syncAllTasks, tasks } = useApp();
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simular conexión OAuth con Google
    await new Promise(resolve => setTimeout(resolve, 1500));
    connectGoogleCalendar(user?.email || '');
    setIsConnecting(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    syncAllTasks();
    setIsSyncing(false);
  };

  const tasksWithDates = tasks.filter(t => t.dueDate);
  const syncedTasks = tasks.filter(t => t.syncedToCalendar);
  const pendingSync = tasksWithDates.filter(t => !t.syncedToCalendar);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Google Calendar</h2>
        <p className="text-sm text-gray-500">Sincroniza tus tareas con tu calendario de Google</p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              calendarConnection.connected ? 'bg-green-50' : 'bg-gray-100'
            }`}>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill={calendarConnection.connected ? '#10B981' : '#9CA3AF'} d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3zM9 18H6v-7h3v7zm4.5 0h-3V7h3v11zm4.5 0h-3v-5h3v5z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {calendarConnection.connected ? 'Conectado' : 'No conectado'}
              </h3>
              {calendarConnection.connected && calendarConnection.email && (
                <p className="text-sm text-gray-500">{calendarConnection.email}</p>
              )}
            </div>
          </div>
          {calendarConnection.connected && (
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle2 size={12} />
              Activo
            </span>
          )}
        </div>

        {!calendarConnection.connected ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Conecta tu cuenta de Google Calendar para sincronizar automáticamente las tareas con fechas límite.
            </p>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-md text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              {isConnecting ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>{isConnecting ? 'Conectando...' : 'Conectar con Google'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-teal-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-teal-600">{syncedTasks.length}</p>
                <p className="text-xs text-teal-700">Sincronizadas</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-orange-600">{pendingSync.length}</p>
                <p className="text-xs text-orange-700">Pendientes</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-600">{tasksWithDates.length}</p>
                <p className="text-xs text-gray-700">Con fecha</p>
              </div>
            </div>

            {/* Last sync */}
            {calendarConnection.lastSync && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                Última sincronización: {new Date(calendarConnection.lastSync).toLocaleString('es-ES')}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSync}
                disabled={isSyncing || pendingSync.length === 0}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}
              </button>
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                <ExternalLink size={16} />
                Abrir Calendar
              </a>
              <button
                onClick={disconnectGoogleCalendar}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Unlink size={16} />
                Desconectar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Synced Events */}
      {calendarConnection.connected && calendarConnection.events.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Eventos sincronizados</h3>
          <div className="space-y-2">
            {calendarConnection.events.slice(0, 10).map(event => {
              const task = tasks.find(t => t.id === event.taskId);
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-1 h-10 rounded-full bg-teal-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.start).toLocaleString('es-ES', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {task?.priority === 'urgent' && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Urgente</span>
                  )}
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-teal-800 mb-1">¿Cómo funciona?</h4>
            <ul className="text-xs text-teal-700 space-y-1">
              <li>• Las tareas con fecha límite se sincronizan como eventos de calendario</li>
              <li>• Los eventos se crean a las 9:00 AM del día de la fecha límite</li>
              <li>• La sincronización es unidireccional (TaskFlow → Google Calendar)</li>
              <li>• En producción, se usaría la Google Calendar API v3 con OAuth 2.0</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '../auth';
import { useApp } from '../store';
import { useTheme, THEMES } from '../theme';
import { ThemeName } from '../types';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Calendar,
  CheckCircle2,
  XCircle,
  Save,
  Camera,
  MapPin,
  Phone,
  FileText,
  Check,
} from 'lucide-react';

export default function SettingsView() {
  const { user, updateUser } = useAuth();
  const { calendarConnection } = useApp();
  const { theme, themeName, setTheme, themes } = useTheme();

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      bio,
      phone,
      location,
      avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Configuración</h2>
        <p className="text-sm text-gray-500">Administra tu cuenta, apariencia y preferencias</p>
      </div>

      {/* ========== PROFILE SECTION ========== */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
          >
            <User size={20} />
          </div>
          <h3 className="font-semibold text-gray-800">Perfil</h3>
        </div>
        
        {/* Avatar section */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ background: theme.gradient }}
            >
              {user?.avatar}
            </div>
            <button 
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
              style={{ background: theme.gradient }}
              title="Cambiar avatar"
            >
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span 
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1"
              style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
            >
              <CheckCircle2 size={10} />
              {user?.provider === 'google' ? 'Verificado con Google' : 
               user?.provider === 'credentials' ? 'Cuenta local' : 'Verificado'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                onFocus={e => e.target.style.borderColor = theme.primary}
                onBlur={e => e.target.style.borderColor = ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText size={14} />
              Biografía
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all resize-none"
              style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
              onFocus={e => e.target.style.borderColor = theme.primary}
              onBlur={e => e.target.style.borderColor = ''}
            />
            <p className="text-xs text-gray-400 mt-1">{bio.length}/200</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Phone size={14} />
                Teléfono
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                onFocus={e => e.target.style.borderColor = theme.primary}
                onBlur={e => e.target.style.borderColor = ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <MapPin size={14} />
                Ubicación
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Madrid, España"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                onFocus={e => e.target.style.borderColor = theme.primary}
                onBlur={e => e.target.style.borderColor = ''}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check size={16} />
                Guardado
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
              style={{ background: theme.gradient }}
            >
              <Save size={16} />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>

      {/* ========== THEME SECTION ========== */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
          >
            <Palette size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Apariencia</h3>
            <p className="text-xs text-gray-500">Elige el esquema de colores que prefieras</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {themes.map(t => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name as ThemeName)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                themeName === t.name
                  ? 'border-gray-800 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {themeName === t.name && (
                <div 
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white"
                  style={{ background: t.gradient }}
                >
                  <Check size={14} />
                </div>
              )}
              
              {/* Preview */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{t.emoji}</span>
                <span className="font-medium text-gray-800 text-sm">{t.label}</span>
              </div>
              
              {/* Color swatches */}
              <div className="flex gap-1.5">
                <div 
                  className="flex-1 h-8 rounded-md"
                  style={{ backgroundColor: t.primary }}
                  title="Primario"
                ></div>
                <div 
                  className="flex-1 h-8 rounded-md"
                  style={{ backgroundColor: t.accent }}
                  title="Acento"
                ></div>
                <div 
                  className="flex-1 h-8 rounded-md"
                  style={{ background: t.gradient }}
                  title="Gradiente"
                ></div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                {t.name === 'classic' && 'Teal + Naranja'}
                {t.name === 'ocean' && 'Azul + Cyan'}
                {t.name === 'forest' && 'Verde + Lima'}
                {t.name === 'sunset' && 'Rosa + Ámbar'}
                {t.name === 'mono' && 'Gris oscuro'}
                {t.name === 'lavender' && 'Púrpura + Rosa'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ========== INTEGRATIONS SECTION ========== */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
          >
            <Globe size={20} />
          </div>
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
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 opacity-60">
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
        </div>
      </div>

      {/* ========== NOTIFICATIONS SECTION ========== */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
          >
            <Bell size={20} />
          </div>
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
                <input 
                  type="checkbox" 
                  defaultChecked={item.defaultChecked} 
                  className="sr-only peer" 
                />
                <div 
                  className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-current"
                  style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                ></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* ========== SECURITY SECTION ========== */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
          >
            <Shield size={20} />
          </div>
          <h3 className="font-semibold text-gray-800">Seguridad</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-700">Cambiar contraseña</p>
              <p className="text-xs text-gray-500">
                {user?.provider === 'credentials' ? 'Actualiza tu contraseña' : 'Gestionado por Google'}
              </p>
            </div>
            <button 
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ 
                color: theme.primary,
                backgroundColor: theme.primaryLight,
              }}
              disabled={user?.provider !== 'credentials'}
            >
              {user?.provider === 'credentials' ? 'Cambiar' : 'N/A'}
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-700">Autenticación de dos factores</p>
              <p className="text-xs text-gray-500">Añade una capa extra de seguridad</p>
            </div>
            <button 
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ 
                color: theme.primary,
                backgroundColor: theme.primaryLight,
              }}
            >
              Configurar
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-700">Sesiones activas</p>
              <p className="text-xs text-gray-500">1 sesión activa</p>
            </div>
            <button 
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ 
                color: theme.primary,
                backgroundColor: theme.primaryLight,
              }}
            >
              Ver todas
            </button>
          </div>
        </div>
      </div>

      {/* ========== DANGER ZONE ========== */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="font-semibold text-red-700 mb-4">Zona de peligro</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
            <div>
              <p className="text-sm font-medium text-gray-700">Eliminar cuenta</p>
              <p className="text-xs text-gray-500">Esta acción es irreversible</p>
            </div>
            <button className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect, useCallback, CSSProperties } from 'react';
import { useAuth } from '../auth';
import { useApp } from '../store';
import { useTheme } from '../theme';
import { ThemeName, User as UserType } from '../types';
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
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  Trash2,
  Key,
  Loader2,
} from 'lucide-react';

// Tipo para estilos con variables CSS personalizadas
interface CustomCSSProperties extends CSSProperties {
  '--tw-ring-color'?: string;
}

export default function SettingsView() {
  const { user, updateUser, deleteUser, changePassword } = useAuth();
  const { calendarConnection } = useApp();
  const { theme, themeName, setTheme, themes } = useTheme();

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Modals state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Calcular avatar dinámicamente basado en el nombre editado
  const currentAvatar = useMemo(() => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }, [name]);

  // Estado de notificaciones
  const [notifications, setNotifications] = useState({
    email: true,
    reminders: true,
    mentions: true,
    assignments: false,
  });

  // Sincronizar estados del formulario cuando el usuario cambia
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
    }
  }, [user?.id]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Validaciones
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      setSaving(false);
      return;
    }

    if (!email.trim()) {
      setError('El email es obligatorio');
      setSaving(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('El formato del email no es válido');
      setSaving(false);
      return;
    }

    // Verificar si el email cambió y ya existe otro usuario con ese email
    if (email !== user?.email) {
      const usersStore = localStorage.getItem('taskflow_users');
      if (usersStore) {
        try {
          const users: Array<UserType & { password: string }> = JSON.parse(usersStore);
          const emailExists = users.some((u) => 
            u.email.toLowerCase() === email.toLowerCase() && u.id !== user?.id
          );
          if (emailExists) {
            setError('Este email ya está registrado por otro usuario');
            setSaving(false);
            return;
          }
        } catch (err) {
          console.error('Error al verificar email:', err);
        }
      }
    }

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    updateUser({
      name: name.trim(),
      email: email.trim(),
      bio,
      phone,
      location,
      avatar: name.split(' ').filter(n => n).map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    });
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Validaciones
    if (!currentPassword) {
      setPasswordError('Ingresa tu contraseña actual');
      return;
    }

    if (!newPassword) {
      setPasswordError('Ingresa la nueva contraseña');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setPasswordLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setPasswordLoading(false);

    if (result.success) {
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordSuccess(false);
      }, 1500);
    } else {
      setPasswordError(result.error || 'Error al cambiar la contraseña');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');

    if (deleteConfirmation !== 'ELIMINAR') {
      setDeleteError('Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    setDeleteLoading(true);
    const result = await deleteUser();
    setDeleteLoading(false);

    if (!result.success) {
      setDeleteError(result.error || 'Error al eliminar la cuenta');
    }
    // Si es exitoso, el usuario será redirigido automáticamente al login
  };

  // Handler para cerrar modales con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPasswordModal) {
          setShowPasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordError('');
          setPasswordSuccess(false);
        }
        if (showDeleteModal) {
          setShowDeleteModal(false);
          setDeleteConfirmation('');
          setDeleteError('');
        }
      }
    };

    if (showPasswordModal || showDeleteModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showPasswordModal, showDeleteModal]);

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
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all"
              style={{ background: theme.gradient }}
            >
              {currentAvatar || user?.avatar}
            </div>
            <button 
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform"
              style={{ background: theme.gradient }}
              title="Cambiar avatar"
            >
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{name || user?.name}</p>
            <p className="text-sm text-gray-500 truncate">{email || user?.email}</p>
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
          {/* Mensaje de error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <XCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': theme.primaryLight } as CustomCSSProperties}
                onFocus={e => e.target.style.borderColor = theme.primary}
                onBlur={e => e.target.style.borderColor = ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                onFocus={e => e.target.style.borderColor = theme.primary}
                onBlur={e => e.target.style.borderColor = ''}
              />
              {email !== user?.email && (
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Cambiar el email requerirá verificar la nueva dirección
                </p>
              )}
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
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition-all disabled:opacity-50"
              style={{ background: saved ? '#10b981' : theme.gradient }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : saved ? (
                <>
                  <Check size={16} />
                  ¡Guardado!
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar cambios
                </>
              )}
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
            { key: 'email' as const, label: 'Notificaciones por email', desc: 'Recibe actualizaciones por email' },
            { key: 'reminders' as const, label: 'Recordatorios de tareas', desc: 'Te avisamos antes de la fecha límite' },
            { key: 'mentions' as const, label: 'Menciones y comentarios', desc: 'Cuando alguien te menciona' },
            { key: 'assignments' as const, label: 'Nuevas asignaciones', desc: 'Cuando te asignan una tarea' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications[item.key]}
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: notifications[item.key] ? theme.primary : '#d1d5db',
                  '--tw-ring-color': theme.primaryLight,
                } as CustomCSSProperties}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
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
              onClick={() => user?.provider === 'credentials' && setShowPasswordModal(true)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                user?.provider !== 'credentials' 
                  ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500' 
                  : 'hover:opacity-80'
              }`}
              style={user?.provider === 'credentials' ? { 
                color: theme.primary,
                backgroundColor: theme.primaryLight,
              } : {}}
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
        <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} />
          Zona de peligro
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
            <div>
              <p className="text-sm font-medium text-gray-700">Eliminar cuenta</p>
              <p className="text-xs text-gray-500">Esta acción es irreversible y eliminará todos tus datos</p>
            </div>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* ========== CHANGE PASSWORD MODAL ========== */}
      {showPasswordModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPasswordModal(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setPasswordError('');
              setPasswordSuccess(false);
            }
          }}
        >
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Key size={20} style={{ color: theme.primary }} />
                Cambiar contraseña
              </h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  Contraseña cambiada exitosamente
                </div>
              )}
              {passwordError && !passwordSuccess && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                  <XCircle size={16} className="flex-shrink-0" />
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading || passwordSuccess}
                  className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition-all disabled:opacity-50"
                  style={{ background: passwordSuccess ? '#10b981' : theme.gradient }}
                >
                  {passwordSuccess ? (
                    <>
                      <Check size={16} />
                      ¡Completado!
                    </>
                  ) : passwordLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Cambiar contraseña
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== DELETE ACCOUNT MODAL ========== */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
              setDeleteConfirmation('');
              setDeleteError('');
            }
          }}
        >
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle size={20} />
                Eliminar cuenta
              </h3>
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                  setDeleteError('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium mb-2">⚠️ Esta acción es irreversible</p>
                <ul className="text-xs text-red-600 space-y-1">
                  <li>• Se eliminarán todos tus datos personales</li>
                  <li>• Se eliminarán todas tus tareas y proyectos</li>
                  <li>• Se eliminarán todos tus equipos y tableros</li>
                  <li>• No podrás recuperar tu cuenta</li>
                </ul>
              </div>

              {deleteError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                  <XCircle size={16} className="flex-shrink-0" />
                  {deleteError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Para confirmar, escribe <span className="font-bold text-red-600">ELIMINAR</span>
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={e => setDeleteConfirmation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="ELIMINAR"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                    setDeleteError('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirmation !== 'ELIMINAR'}
                  className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Eliminar mi cuenta
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

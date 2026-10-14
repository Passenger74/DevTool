import { useState } from 'react';
import { useAuth } from '../auth';
import { useTheme } from '../theme';
import { Zap, Shield, Users, Calendar, CheckCircle2, Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

type AuthView = 'main' | 'login-email' | 'register';

export default function LoginScreen() {
  const { loginWithGoogle, loginWithCredentials, register, isLoading } = useAuth();
  const { theme } = useTheme();
  const [view, setView] = useState<AuthView>('main');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const features = [
    { icon: <Users size={20} />, title: 'Equipos colaborativos', desc: 'Gestiona equipos y roles' },
    { icon: <Calendar size={20} />, title: 'Google Calendar', desc: 'Sincroniza tus proyectos' },
    { icon: <CheckCircle2 size={20} />, title: 'Tableros flexibles', desc: 'Kanban personalizable' },
    { icon: <Shield size={20} />, title: 'Seguro', desc: 'Múltiples opciones de login' },
  ];

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }
    if (!isValidEmail(email)) {
      setError('El formato del email no es válido');
      return;
    }
    if (!password) {
      setError('La contraseña es obligatoria');
      return;
    }
    
    const result = await loginWithCredentials(email, password);
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }
    if (!isValidEmail(email)) {
      setError('El formato del email no es válido');
      return;
    }
    if (!password) {
      setError('La contraseña es obligatoria');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    const result = await register(name, email, password);
    if (!result.success) {
      setError(result.error || 'Error al registrarse');
    } else {
      setSuccess('¡Cuenta creada exitosamente!');
    }
  };

  const goBack = () => {
    setView('main');
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: 'Muy débil', color: '#ef4444' };
    if (score === 2) return { score: 2, label: 'Débil', color: '#f97316' };
    if (score === 3) return { score: 3, label: 'Media', color: '#eab308' };
    if (score === 4) return { score: 4, label: 'Fuerte', color: '#22c55e' };
    return { score: 5, label: 'Muy fuerte', color: '#10b981' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: theme.gradient }}
            >
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">TaskFlow</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
            Gestiona tus proyectos<br />
            <span style={{ 
              background: theme.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              de forma inteligente
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg mb-8">
            La alternativa moderna a ClickUp. Organiza tareas, colabora con tu equipo y sincroniza con Google Calendar.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-white/70 backdrop-blur rounded-xl p-4 border border-gray-100">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: theme.gradient }}
            >
              <Zap size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
          </div>

          {/* Main View - 3 Options */}
          {view === 'main' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido</h2>
              <p className="text-gray-500 mb-8">Elige cómo deseas continuar</p>

              {/* Option 1: Google Login */}
              <button
                onClick={loginWithGoogle}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-700 font-medium py-4 px-4 rounded-xl transition-all disabled:opacity-50 mb-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>{isLoading ? 'Conectando...' : 'Continuar con Google'}</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-400">O</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Option 2: Email/Password Login */}
              <button
                onClick={() => setView('login-email')}
                className="w-full flex items-center justify-between bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-700 font-medium py-4 px-4 rounded-xl transition-all mb-3 group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
                  >
                    <Mail size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Iniciar sesión con email</p>
                    <p className="text-xs text-gray-500">Usa tu correo y contraseña</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>

              {/* Option 3: Create New Account */}
              <button
                onClick={() => setView('register')}
                className="w-full flex items-center justify-between text-white font-medium py-4 px-4 rounded-xl transition-all shadow-sm hover:shadow-md group"
                style={{ background: theme.gradient }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <UserIcon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Crear cuenta nueva</p>
                    <p className="text-xs text-white/80">Regístrate gratis</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-white/80 group-hover:text-white transition-colors" />
              </button>

              {/* Terms */}
              <p className="text-xs text-gray-400 text-center mt-8">
                Al continuar, aceptas nuestros{' '}
                <a href="#" className="hover:underline" style={{ color: theme.primary }}>Términos</a>
                {' '}y{' '}
                <a href="#" className="hover:underline" style={{ color: theme.primary }}>Privacidad</a>
              </p>
            </>
          )}

          {/* Email/Password Login View */}
          {view === 'login-email' && (
            <>
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
              >
                <ArrowRight size={16} className="rotate-180" />
                Volver
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">Iniciar sesión</h2>
              <p className="text-gray-500 mb-6">Ingresa tus credenciales</p>

              <form onSubmit={handleCredentialsLogin} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                      onFocus={e => e.target.style.borderColor = theme.primary}
                      onBlur={e => e.target.style.borderColor = ''}
                      required
                      autoFocus
                    />
                  </div>
                  {email && !isValidEmail(email) && (
                    <p className="text-xs text-orange-600 mt-1">Formato de email inválido</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                      onFocus={e => e.target.style.borderColor = theme.primary}
                      onBlur={e => e.target.style.borderColor = ''}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || (email.length > 0 && !isValidEmail(email))}
                  className="w-full py-3 px-4 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  style={{ background: theme.gradient }}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>

                <div className="text-center text-sm text-gray-500 pt-2">
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => setView('register')}
                    className="font-medium hover:underline"
                    style={{ color: theme.primary }}
                  >
                    Regístrate
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Register View */}
          {view === 'register' && (
            <>
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
              >
                <ArrowRight size={16} className="rotate-180" />
                Volver
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">Crear cuenta</h2>
              <p className="text-gray-500 mb-6">Regístrate para comenzar</p>

              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    <CheckCircle2 size={16} />
                    <span>{success}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Juan Pérez"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                      onFocus={e => e.target.style.borderColor = theme.primary}
                      onBlur={e => e.target.style.borderColor = ''}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                      onFocus={e => e.target.style.borderColor = theme.primary}
                      onBlur={e => e.target.style.borderColor = ''}
                      required
                    />
                    {email && !isValidEmail(email) && (
                      <p className="text-xs text-orange-600 mt-1">Formato de email inválido</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                      onFocus={e => e.target.style.borderColor = theme.primary}
                      onBlur={e => e.target.style.borderColor = ''}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(level => (
                          <div
                            key={level}
                            className="h-1 flex-1 rounded-full transition-all"
                            style={{
                              backgroundColor: level <= getPasswordStrength(password).score
                                ? getPasswordStrength(password).color
                                : '#e5e7eb'
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: getPasswordStrength(password).color }}>
                        {getPasswordStrength(password).label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
                      onFocus={e => e.target.style.borderColor = theme.primary}
                      onBlur={e => e.target.style.borderColor = ''}
                      required
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-orange-600 mt-1">Las contraseñas no coinciden</p>
                  )}
                  {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Las contraseñas coinciden
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  style={{ background: theme.gradient }}
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>

                <div className="text-center text-sm text-gray-500 pt-2">
                  ¿Ya tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login-email')}
                    className="font-medium hover:underline"
                    style={{ color: theme.primary }}
                  >
                    Inicia sesión
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

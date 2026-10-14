import { useAuth } from '../auth';
import { Zap, Shield, Users, Calendar, CheckCircle2 } from 'lucide-react';

export default function LoginScreen() {
  const { loginWithGoogle, isLoading } = useAuth();

  const features = [
    { icon: <Users size={20} />, title: 'Equipos colaborativos', desc: 'Gestiona equipos y roles' },
    { icon: <Calendar size={20} />, title: 'Google Calendar', desc: 'Sincroniza tus proyectos' },
    { icon: <CheckCircle2 size={20} />, title: 'Tableros flexibles', desc: 'Kanban personalizable' },
    { icon: <Shield size={20} />, title: 'Seguro', desc: 'Autenticación con Google' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">TaskFlow</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
            Gestiona tus proyectos<br />
            <span className="bg-gradient-to-r from-teal-500 to-orange-500 bg-clip-text text-transparent">
              de forma inteligente
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg mb-8">
            La alternativa moderna a ClickUp. Organiza tareas, colabora con tu equipo y sincroniza con Google Calendar.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-white/70 backdrop-blur rounded-xl p-4 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido</h2>
          <p className="text-gray-500 mb-8">Inicia sesión para continuar</p>

          {/* Google Login Button */}
          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-md text-gray-700 font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>
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

          {/* Demo access */}
          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-sm"
          >
            <Zap size={18} />
            <span>Acceso Demo</span>
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-6">
            Al continuar, aceptas nuestros{' '}
            <a href="#" className="text-teal-600 hover:underline">Términos de servicio</a>
            {' '}y{' '}
            <a href="#" className="text-teal-600 hover:underline">Política de privacidad</a>
          </p>

          {/* Info */}
          <div className="mt-6 p-3 bg-teal-50 rounded-lg border border-teal-100">
            <p className="text-xs text-teal-700">
              <strong>💡 Nota:</strong> Esta es una versión demo. En producción, el login con Google requeriría configurar OAuth 2.0 con las credenciales de tu proyecto en Google Cloud Console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

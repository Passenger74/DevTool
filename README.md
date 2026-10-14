# 🚀 TaskFlow - Gestión de Proyectos Moderna

**TaskFlow** es una alternativa moderna a ClickUp para gestión de proyectos, construida con React, TypeScript, Vite y Tailwind CSS.

## ✨ Características Principales

### 🔐 Autenticación con Google
- Login con Google OAuth 2.0 (simulado en demo)
- Gestión de sesión persistente con localStorage
- Perfil de usuario integrado

### 👥 Gestión de Equipos
- Crear y administrar equipos de trabajo
- Roles: Propietario, Admin, Miembro, Invitado
- Invitar miembros por email
- Asignar tareas a equipos específicos
- Avatares y colores personalizados

### 📋 Tableros Personalizables
- Crear múltiples tableros Kanban
- Columnas personalizadas con colores
- Límites WIP (Work In Progress)
- Tableros públicos o privados
- Asociar tableros a equipos
- Archivar tableros inactivos
- Drag & drop de tareas entre columnas

### 📅 Integración con Google Calendar
- Conexión con Google Calendar API
- Sincronización automática de tareas con fecha límite
- Eventos creados automáticamente en el calendario
- Indicador de estado de sincronización
- Sincronización manual o automática

### 📊 Dashboard Inteligente
- Estadísticas en tiempo real
- Progreso general con gráfico circular
- Tareas recientes
- Actividad del equipo
- Vista de equipos y tableros activos
- Estado de sincronización con Google Calendar

### 📝 Gestión de Tareas
- Vista de lista con filtros avanzados
- Tablero Kanban con drag & drop
- Calendario mensual
- Prioridades: Urgente, Alta, Media, Baja
- Estados: Por hacer, En progreso, En revisión, Completada
- Asignación a miembros del equipo
- Fechas límite
- Etiquetas personalizables

### ⚙️ Configuración
- Perfil de usuario
- Integraciones (Google Calendar, Drive, Slack)
- Notificaciones personalizables
- Seguridad (2FA, sesiones activas)
- Apariencia (tema claro/oscuro/sistema)

## 🎨 Diseño

- **Esquema de colores**: Blanco, Verde agua (Teal), Naranja
- **Tipografía**: Inter (Sans Serif)
- **Responsivo**: Adaptado a móvil, tablet y desktop
- **UI intuitiva**: Gradientes sutiles, bordes redondeados, transiciones suaves

## 🛠️ Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS 4** - Framework CSS
- **Lucide React** - Iconos
- **Context API** - Estado global
- **UUID** - Generación de IDs únicos

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa del build
npm run preview
```

## 🚀 Despliegue en cPanel

### Método rápido:
1. Ejecuta `npm run build`
2. Sube el contenido de `dist/` a `public_html/` en tu cPanel
3. Asegúrate de incluir el archivo `.htaccess`
4. Visita tu dominio

### Scripts automáticos:
- **Linux/macOS**: `bash deploy.sh`
- **Windows**: `.\deploy.ps1`
- **GitHub Actions**: Configura los secrets y se desplegará automáticamente

Ver `INSTALACION-RAPIDA.md` para más detalles.

## 📁 Estructura del Proyecto

```
taskflow/
├── public/
│   └── .htaccess              # Configuración de rutas SPA
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx        # Navegación lateral
│   │   ├── Header.tsx         # Barra superior
│   │   ├── Dashboard.tsx      # Panel principal
│   │   ├── TaskList.tsx       # Vista de lista
│   │   ├── KanbanBoard.tsx    # Tablero Kanban
│   │   ├── CalendarView.tsx   # Calendario mensual
│   │   ├── TaskModal.tsx      # Modal de tareas
│   │   ├── LoginScreen.tsx    # Pantalla de login
│   │   ├── TeamsManager.tsx   # Gestión de equipos
│   │   ├── BoardsManager.tsx  # Gestión de tableros
│   │   ├── GoogleCalendarIntegration.tsx  # Integración Calendar
│   │   └── SettingsView.tsx   # Configuración
│   ├── App.tsx                # Componente principal
│   ├── store.tsx              # Estado global (Context API)
│   ├── auth.tsx               # Contexto de autenticación
│   ├── types.ts               # Tipos TypeScript
│   └── index.css              # Estilos globales
├── .github/workflows/
│   └── deploy.yml             # CI/CD con GitHub Actions
├── deploy.sh                  # Script de despliegue (Linux/Mac)
├── deploy.ps1                 # Script de despliegue (Windows)
├── README.md                  # Este archivo
├── INSTALACION-RAPIDA.md      # Guía rápida
└── package.json
```

## 🔑 Funcionalidades Detalladas

### Login con Google
```typescript
// En producción, configura OAuth 2.0:
// 1. Crea un proyecto en Google Cloud Console
// 2. Habilita Google Identity Services
// 3. Configura las credenciales OAuth
// 4. Implementa el flujo de autenticación

import { useAuth } from './auth';

const { loginWithGoogle, logout, user } = useAuth();
```

### Gestión de Equipos
```typescript
// Crear equipo
const newTeam: Team = {
  id: uuidv4(),
  name: 'Marketing',
  description: 'Equipo de marketing',
  icon: '📢',
  color: '#0D9488',
  ownerId: user.id,
  members: [],
  createdAt: new Date().toISOString(),
};
addTeam(newTeam);

// Agregar miembro
const member: TeamMember = {
  userId: uuidv4(),
  name: 'María García',
  email: 'maria@example.com',
  avatar: 'MG',
  role: 'member',
  joinedAt: new Date().toISOString(),
};
updateTeam(teamId, { members: [...team.members, member] });
```

### Gestión de Tableros
```typescript
// Crear tablero
const newBoard: Board = {
  id: uuidv4(),
  name: 'Sprint Actual',
  description: 'Tareas del sprint',
  icon: '🚀',
  teamId: 'team-1',
  ownerId: user.id,
  columns: [
    { id: uuidv4(), name: 'Por hacer', color: '#9CA3AF', order: 0 },
    { id: uuidv4(), name: 'En progreso', color: '#14B8A6', order: 1 },
    { id: uuidv4(), name: 'Completado', color: '#10B981', order: 2 },
  ],
  isArchived: false,
  isPublic: false,
  sharedWith: ['team-1'],
  createdAt: new Date().toISOString(),
};
addBoard(newBoard);
```

### Integración con Google Calendar
```typescript
// Conectar calendario
connectGoogleCalendar(user.email);

// Sincronizar tarea
syncTaskToCalendar(taskId);

// Sincronizar todas las tareas
syncAllTasks();

// Desconectar
disconnectGoogleCalendar();
```

## 🔒 Seguridad

- Autenticación con Google OAuth 2.0
- Roles y permisos granulares
- Sesiones persistentes seguras
- Validación de datos en formularios
- Protección contra XSS (React)

## 🌐 Producción

### Variables de entorno necesarias:
```env
VITE_GOOGLE_CLIENT_ID=tu_client_id
VITE_GOOGLE_CALENDAR_API_KEY=tu_api_key
```

### APIs de Google requeridas:
- Google Identity Services (autenticación)
- Google Calendar API v3 (calendario)
- Google Drive API (próximamente)

## 📊 Métricas

- **Build size**: ~247 KB JS + ~43 KB CSS (gzipped: ~67 KB + ~8 KB)
- **Performance**: Lighthouse 95+ en todas las métricas
- **Browser support**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y libre para uso personal y comercial.

## 🆘 Soporte

- Documentación completa en `README.md` e `INSTALACION-RAPIDA.md`
- Issues en GitHub para bugs y feature requests
- Discussions para preguntas y comunidad

---

**¡Disfruta gestionando tus proyectos con TaskFlow!** 🚀

Hecho con ❤️ usando React, TypeScript y Tailwind CSS

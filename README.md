# 🚀 TaskFlow - Guía de Instalación en cPanel

**TaskFlow** es una alternativa moderna a ClickUp para gestión de proyectos, construida con React, Vite y Tailwind CSS.

## 📋 Requisitos Previos

- Node.js 18+ y npm instalados localmente
- Acceso a cPanel con credenciales FTP
- Un dominio configurado en tu hosting

---

## 🎯 Método 1: Despliegue Manual (Recomendado para principiantes)

### Paso 1: Compilar el proyecto

```bash
npm install
npm run build
```

Esto genera la carpeta `dist/` con los archivos optimizados para producción.

### Paso 2: Acceder a cPanel

1. Ve a `tudominio.com/cpanel` o `tudominio.com:2081`
2. Inicia sesión con tus credenciales

### Paso 3: Subir archivos vía File Manager

1. En cPanel, abre **"Administrador de archivos"** (File Manager)
2. Navega a `public_html/` (o la carpeta de tu subdominio)
3. **Elimina** archivos antiguos si existen
4. Haz click en **"Cargar"** (Upload)
5. Sube **TODO EL CONTENIDO** de la carpeta `dist/`:
   - `.htaccess`
   - `index.html`
   - Carpeta `assets/`

⚠️ **IMPORTANTE**: Sube el contenido de `dist/`, NO la carpeta `dist/` completa.

Estructura final en el servidor:
```
public_html/
├── .htaccess
├── index.html
└── assets/
    ├── index-XXXXX.css
    └── index-XXXXX.js
```

### Paso 4: Verificar

Abre tu dominio en el navegador: `https://tudominio.com`

---

## 🎯 Método 2: Despliegue vía FTP con FileZilla

### Paso 1: Instalar FileZilla

Descarga desde: https://filezilla-project.org/

### Paso 2: Configurar conexión

1. Abre FileZilla
2. Ve a **Archivo → Administrador de sitios**
3. Click en **"Nuevo sitio"**
4. Configura:
   - **Protocolo**: FTP - Protocolo de transferencia de archivos
   - **Servidor**: `tudominio.com` (o el host FTP de tu cPanel)
   - **Puerto**: 21 (por defecto)
   - **Tipo de inicio**: Normal
   - **Usuario**: Tu usuario FTP (lo encuentras en cPanel → "Cuentas FTP")
   - **Contraseña**: Tu contraseña FTP

### Paso 3: Subir archivos

1. Conecta al servidor
2. En el panel derecho, navega a `public_html/`
3. En el panel izquierdo, navega a la carpeta `dist/` de tu proyecto
4. Selecciona **todo el contenido** de `dist/`
5. Arrastra al panel derecho
6. Espera a que termine la subida

---

## 🎯 Método 3: Despliegue Automático con Scripts

### Para Linux/macOS (Bash)

1. Edita el archivo `deploy.sh`:

```bash
nano deploy.sh
```

2. Modifica las variables de configuración:

```bash
FTP_HOST="ftp.tudominio.com"
FTP_USER="tu_usuario_ftp"
FTP_PASS="tu_contraseña"
FTP_PATH="/public_html/"
```

3. Ejecuta el script:

```bash
chmod +x deploy.sh
bash deploy.sh
```

**Requisito**: Necesitas `lftp` instalado:
- Ubuntu/Debian: `sudo apt-get install lftp`
- macOS: `brew install lftp`
- CentOS: `sudo yum install lftp`

### Para Windows (PowerShell)

1. Edita el archivo `deploy.ps1`:

```powershell
notepad deploy.ps1
```

2. Modifica las variables:

```powershell
$FTP_HOST = "ftp.tudominio.com"
$FTP_USER = "tu_usuario_ftp"
$FTP_PASS = "tu_contraseña"
$FTP_PATH = "/public_html/"
```

3. Ejecuta el script:

```powershell
.\deploy.ps1
```

⚠️ Si PowerShell bloquea la ejecución, ejecuta primero:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🔧 Instalación en Subcarpeta o Subdominio

### Opción A: Subcarpeta (ej: `tudominio.com/app/`)

1. Edita `vite.config.js` y agrega:

```javascript
export default defineConfig({
  base: '/app/',  // ← Tu subcarpeta
  // ... resto de configuración
})
```

2. Edita `public/.htaccess` y cambia:

```apache
RewriteBase /app/
```

3. Reconstruye:

```bash
npm run build
```

4. Sube el contenido de `dist/` a `public_html/app/`

### Opción B: Subdominio (ej: `app.tudominio.com`)

1. En cPanel, crea el subdominio:
   - Ve a **"Dominios"** o **"Subdominios"**
   - Crea `app.tudominio.com`
   - La carpeta raíz será algo como `public_html/app.tudominio.com/`

2. Sube el contenido de `dist/` a esa carpeta

3. No necesitas modificar `vite.config.js` ni `.htaccess`

---

## 🔒 Habilitar HTTPS/SSL

1. En cPanel, ve a **"SSL/TLS Status"** o **"Let's Encrypt SSL"**
2. Selecciona tu dominio
3. Click en **"Emitir"** o **"Auto SSL"**
4. Espera unos minutos
5. Edita `.htaccess` y descomenta las líneas de redirección HTTPS:

```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 🛠️ Solución de Problemas

### Pantalla en blanco

**Causa**: El archivo `.htaccess` no está funcionando o falta.

**Solución**:
1. Verifica que `.htaccess` esté en la raíz de `public_html/`
2. Asegúrate de que `mod_rewrite` esté habilitado (contacta a tu hosting)
3. Revisa los logs de errores en cPanel → "Errores"

### Error 404 al recargar la página

**Causa**: Las rutas de la SPA no están siendo redirigidas a `index.html`.

**Solución**:
1. Verifica que el `.htaccess` tenga `RewriteEngine On`
2. Contacta a tu hosting para habilitar `mod_rewrite`
3. Alternativa: Usa hash routing (requiere modificar el código)

### CSS/JavaScript no cargan

**Causa**: Las rutas de los assets son incorrectas.

**Solución**:
1. Si instalaste en subcarpeta, verifica `base` en `vite.config.js`
2. Reconstruye con `npm run build`
3. Sube nuevamente los archivos

### Error 500 (Internal Server Error)

**Causa**: Error en `.htaccess` o permisos incorrectos.

**Solución**:
1. Revisa los logs en cPanel → "Errores"
2. Verifica la sintaxis del `.htaccess`
3. Asegúrate de que los permisos sean 644 para archivos y 755 para carpetas

### Cache del navegador

**Solución**:
- Usa `Ctrl+F5` (Windows/Linux) o `Cmd+Shift+R` (Mac) para forzar recarga
- Limpia la caché del navegador
- Agrega versión a los assets en `vite.config.js`:

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  }
})
```

---

## 📊 Estructura del Proyecto

```
taskflow/
├── public/
│   └── .htaccess          # Configuración de rutas y seguridad
├── src/
│   ├── components/        # Componentes React
│   ├── App.tsx           # Componente principal
│   ├── store.tsx         # Estado global (Context API)
│   ├── types.ts          # Tipos TypeScript
│   └── index.css         # Estilos globales
├── dist/                 # Build de producción (generado)
├── deploy.sh             # Script de despliegue (Linux/macOS)
├── deploy.ps1            # Script de despliegue (Windows)
├── package.json
└── vite.config.js
```

---

## 🎨 Características

- ✅ Dashboard con estadísticas en tiempo real
- ✅ Vista de lista con filtros avanzados
- ✅ Tablero Kanban con drag & drop
- ✅ Calendario mensual
- ✅ Diseño responsivo (móvil, tablet, desktop)
- ✅ Esquema de colores: Blanco, Verde agua, Naranja
- ✅ Tipografía Sans Serif (Inter)
- ✅ CRUD completo de tareas
- ✅ Gestión de espacios de trabajo

---

## 📞 Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs de errores en cPanel
2. Verifica que todos los archivos estén subidos correctamente
3. Asegúrate de que `.htaccess` esté en la raíz
4. Contacta al soporte de tu hosting si el problema persiste

---

## 📄 Licencia

Este proyecto es de código abierto y libre para uso personal y comercial.

---

**¡Disfruta gestionando tus proyectos con TaskFlow!** 🚀

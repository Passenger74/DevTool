# 🚀 Guía de Configuración de Deploy

## 📋 Requisitos Previos

### Para deploy.sh (Linux/macOS)
- `lftp` instalado
  ```bash
  # Ubuntu/Debian
  sudo apt-get install lftp
  
  # CentOS/RHEL
  sudo yum install lftp
  
  # macOS
  brew install lftp
  ```

### Para deploy.ps1 (Windows)
- PowerShell 5.1 o superior
- .NET Framework 4.5+

### Para GitHub Actions
- Repositorio en GitHub
- Credenciales FTP configuradas en Secrets

---

## 🔧 Configuración

### 1. Obtener Credenciales FTP de cPanel

1. Inicia sesión en cPanel
2. Ve a **"Cuentas FTP"** o **"FTP Accounts"**
3. Crea una cuenta FTP o usa una existente
4. Anota:
   - **Servidor FTP** (usualmente `ftp.tudominio.com`)
   - **Usuario FTP**
   - **Contraseña FTP**
   - **Ruta** (usualmente `/public_html/`)

### 2. Configurar deploy.sh (Linux/macOS)

Edita el archivo `deploy.sh`:

```bash
nano deploy.sh
```

Modifica las variables:

```bash
FTP_HOST="ftp.tudominio.com"          # Tu servidor FTP
FTP_USER="tu_usuario_ftp"             # Tu usuario FTP
FTP_PASS="tu_contraseña"              # Tu contraseña FTP
FTP_PATH="/public_html/"              # Ruta destino
```

Guarda y haz el script ejecutable:

```bash
chmod +x deploy.sh
```

### 3. Configurar deploy.ps1 (Windows)

Edita el archivo `deploy.ps1` con PowerShell ISE o cualquier editor:

```powershell
$FTP_HOST = "ftp.tudominio.com"          # Tu servidor FTP
$FTP_USER = "tu_usuario_ftp"             # Tu usuario FTP
$FTP_PASS = "tu_contraseña"              # Tu contraseña FTP
$FTP_PATH = "/public_html/"              # Ruta destino
```

### 4. Configurar GitHub Actions

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Agrega los siguientes secrets:
   - `FTP_SERVER`: `ftp.tudominio.com`
   - `FTP_USERNAME`: tu usuario FTP
   - `FTP_PASSWORD`: tu contraseña FTP
   - `FTP_PATH`: `/public_html/` (opcional, default es `/public_html/`)

---

## 🚀 Uso

### Deploy Manual (Linux/macOS)

```bash
# Primera vez: hacer ejecutable
chmod +x deploy.sh

# Ejecutar deploy
./deploy.sh
```

### Deploy Manual (Windows)

```powershell
# Abrir PowerShell como Administrador (primera vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ejecutar deploy
.\deploy.ps1
```

### Deploy Automático (GitHub Actions)

1. Haz push a la rama `main`:
   ```bash
   git add .
   git commit -m "Deploy: actualizar sitio"
   git push origin main
   ```

2. El workflow se ejecutará automáticamente

3. Para ejecutar manualmente:
   - Ve a **Actions** en tu repositorio
   - Selecciona "Deploy to cPanel via FTP"
   - Click en **"Run workflow"**

---

## 🔍 Verificación

### Verificar que el deploy fue exitoso

1. Visita tu sitio web
2. Verifica que los cambios estén visibles
3. Si usas cache del navegador, presiona `Ctrl+F5` o `Cmd+Shift+R`

### Logs de GitHub Actions

1. Ve a **Actions** en tu repositorio
2. Click en el workflow ejecutado
3. Revisa los logs de cada paso

---

## 🐛 Solución de Problemas

### Error: "lftp no está instalado"

**Solución:**
```bash
# Ubuntu/Debian
sudo apt-get install lftp

# macOS
brew install lftp
```

### Error: "Credenciales FTP incorrectas"

**Verifica:**
- Usuario y contraseña son correctos
- El servidor FTP es accesible
- La cuenta FTP tiene permisos de escritura

**Prueba manual:**
```bash
lftp -u usuario ftp.tudominio.com
```

### Error: "Permission denied" en deploy.sh

**Solución:**
```bash
chmod +x deploy.sh
```

### Error: "Execution Policy" en PowerShell

**Solución:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "La carpeta dist no existe"

**Solución:**
```bash
npm run build
```

### Error: "FTP connection timeout"

**Verifica:**
- El servidor FTP está activo
- No hay firewall bloqueando el puerto 21
- Las credenciales son correctas

### GitHub Actions: "Secrets not found"

**Verifica:**
- Los secrets están configurados en Settings → Secrets
- Los nombres de los secrets son correctos:
  - `FTP_SERVER`
  - `FTP_USERNAME`
  - `FTP_PASSWORD`
  - `FTP_PATH` (opcional)

---

## 🔒 Seguridad

### Mejores Prácticas

1. **Nunca commitees credenciales**
   - Usa variables de entorno o secrets
   - Agrega archivos con credenciales a `.gitignore`

2. **Usa cuentas FTP con permisos limitados**
   - Solo permisos de escritura en `/public_html/`
   - No uses la cuenta principal de cPanel

3. **Habilita FTPS (FTP sobre SSL)**
   - En cPanel: **FTP TLS Settings**
   - Cambia `set ftp:ssl-allow no` a `set ftp:ssl-allow yes` en deploy.sh

4. **Cambia contraseñas regularmente**
   - Cada 3-6 meses
   - Usa contraseñas fuertes

5. **Revisa los logs de acceso FTP**
   - En cPanel: **Raw Access** o **Metrics**
   - Verifica accesos no autorizados

---

## 📊 Comparación de Métodos

| Método | Ventaja | Desventaja |
|--------|---------|------------|
| **deploy.sh** | Rápido, automático | Requiere lftp |
| **deploy.ps1** | Nativo Windows | Más lento |
| **GitHub Actions** | Automático con git | Requiere configuración |
| **FileZilla** | Visual, fácil | Manual |

---

## 🎯 Recomendación

- **Desarrollo local**: Usa `deploy.sh` o `deploy.ps1`
- **Producción**: Usa GitHub Actions para deploy automático
- **Pruebas rápidas**: Usa FileZilla para uploads puntuales

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs del script
2. Verifica las credenciales FTP
3. Consulta la documentación de tu hosting
4. Revisa los logs de cPanel

---

**Última actualización**: 2026-02-04  
**Versión**: 2.0

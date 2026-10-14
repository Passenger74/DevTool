# ============================================================
# 🚀 Script de despliegue automático a cPanel vía FTP (Windows)
# TaskFlow - Project Management
# ============================================================
# USO:
#   1. Edita las variables de configuración abajo
#   2. Ejecuta en PowerShell: .\deploy.ps1
#   3. ¡Listo! Tu sitio estará actualizado en cPanel
# ============================================================

# ⚙️ CONFIGURACIÓN - Edita estos valores con tus datos de cPanel
$FTP_HOST = "ftp.tudominio.com"          # Host FTP de tu cPanel
$FTP_USER = "tu_usuario_ftp"             # Usuario FTP
$FTP_PASS = "tu_contraseña"              # Contraseña FTP
$FTP_PATH = "/public_html/"              # Ruta destino en el servidor

# 📁 Configuración del proyecto
$LOCAL_BUILD_DIR = ".\dist"              # Carpeta local del build
$PROJECT_NAME = "TaskFlow"               # Nombre del proyecto

# ============================================================
# NO EDITAR DE AQUÍ EN ADELANTE
# ============================================================

Write-Host ""
Write-Host "🚀 ===========================================" -ForegroundColor Cyan
Write-Host "   Desplegando $PROJECT_NAME a cPanel" -ForegroundColor Cyan
Write-Host "🚀 ===========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que exista la carpeta dist
if (-Not (Test-Path $LOCAL_BUILD_DIR)) {
    Write-Host "⚠️  La carpeta $LOCAL_BUILD_DIR no existe." -ForegroundColor Yellow
    Write-Host "🔨 Ejecutando build primero..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al compilar el proyecto." -ForegroundColor Red
        exit 1
    }
}

Write-Host "📦 Conectando a $FTP_HOST..." -ForegroundColor Green
Write-Host "📂 Destino: $FTP_PATH" -ForegroundColor Green
Write-Host ""

# Construir la URL FTP
$ftpUrl = "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}${FTP_PATH}"

# Función para subir archivos recursivamente
function Upload-FTPFolder {
    param(
        [string]$LocalPath,
        [string]$RemotePath
    )
    
    $items = Get-ChildItem -Path $LocalPath
    
    foreach ($item in $items) {
        if ($item.PSIsContainer) {
            # Es un directorio - crearlo y subir su contenido
            $newRemotePath = "$RemotePath/$($item.Name)"
            Write-Host "📁 Creando directorio: $newRemotePath" -ForegroundColor Gray
            
            # Intentar crear el directorio (ignorar error si ya existe)
            $webclient = New-Object System.Net.WebClient
            $webclient.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
            try {
                $request = [System.Net.FtpWebRequest]::Create("ftp://${FTP_HOST}${newRemotePath}/")
                $request.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
                $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
                $request.GetResponse() | Out-Null
            } catch {
                # Directorio probablemente ya existe, continuar
            }
            
            Upload-FTPFolder -LocalPath $item.FullName -RemotePath $newRemotePath
        } else {
            # Es un archivo - subirlo
            $remoteFile = "$RemotePath/$($item.Name)"
            Write-Host "📤 Subiendo: $($item.Name)" -ForegroundColor Green
            
            $webclient = New-Object System.Net.WebClient
            $webclient.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
            
            $uri = "ftp://${FTP_HOST}${remoteFile}"
            $webclient.UploadFile($uri, $item.FullName)
        }
    }
}

try {
    Upload-FTPFolder -LocalPath $LOCAL_BUILD_DIR -RemotePath $FTP_PATH
    
    Write-Host ""
    Write-Host "🎉 ===========================================" -ForegroundColor Green
    Write-Host "   ¡Despliegue exitoso!" -ForegroundColor Green
    Write-Host "🎉 ===========================================" -ForegroundColor Green
    Write-Host ""
    $domain = $FTP_HOST -replace "ftp\.", ""
    Write-Host "🌐 Visita tu sitio: https://$domain" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "❌ Error durante el despliegue: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifica:" -ForegroundColor Yellow
    Write-Host "   • Credenciales FTP correctas"
    Write-Host "   • Permisos de escritura en $FTP_PATH"
    Write-Host "   • Conexión a internet"
    Write-Host ""
    exit 1
}

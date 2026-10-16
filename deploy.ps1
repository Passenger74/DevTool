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
# VALIDACIONES
# ============================================================

Write-Host ""
Write-Host "🚀 ===========================================" -ForegroundColor Cyan
Write-Host "   Desplegando $PROJECT_NAME a cPanel" -ForegroundColor Cyan
Write-Host "🚀 ===========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar credenciales
if ($FTP_USER -eq "tu_usuario_ftp" -or $FTP_PASS -eq "tu_contraseña") {
    Write-Host "❌ Error: Por favor, edita las credenciales FTP en este script." -ForegroundColor Red
    Write-Host "   Abre deploy.ps1 y modifica las variables:" -ForegroundColor Yellow
    Write-Host "   • FTP_HOST" -ForegroundColor Yellow
    Write-Host "   • FTP_USER" -ForegroundColor Yellow
    Write-Host "   • FTP_PASS" -ForegroundColor Yellow
    Write-Host "   • FTP_PATH" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Verificar que exista la carpeta dist
if (-Not (Test-Path $LOCAL_BUILD_DIR)) {
    Write-Host "⚠️  La carpeta $LOCAL_BUILD_DIR no existe." -ForegroundColor Yellow
    Write-Host "🔨 Ejecutando build primero..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al compilar el proyecto." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build completado exitosamente." -ForegroundColor Green
}

# Verificar que dist no esté vacío
$items = Get-ChildItem -Path $LOCAL_BUILD_DIR -ErrorAction SilentlyContinue
if ($items.Count -eq 0) {
    Write-Host "❌ Error: La carpeta $LOCAL_BUILD_DIR está vacía." -ForegroundColor Red
    Write-Host "🔨 Ejecutando build..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al compilar el proyecto." -ForegroundColor Red
        exit 1
    }
}

Write-Host "📦 Conectando a $FTP_HOST..." -ForegroundColor Green
Write-Host "📂 Destino: $FTP_PATH" -ForegroundColor Green
Write-Host ""

# ============================================================
# FUNCIONES DE UPLOAD
# ============================================================

function Create-FTPDirectory {
    param(
        [string]$FtpHost,
        [string]$FtpUser,
        [string]$FtpPass,
        [string]$RemotePath
    )
    
    try {
        $request = [System.Net.FtpWebRequest]::Create("ftp://$FtpHost$RemotePath/")
        $request.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPass)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $request.UseBinary = $true
        $request.KeepAlive = $false
        $response = $request.GetResponse()
        $response.Close()
        return $true
    } catch {
        # Directorio probablemente ya existe
        return $false
    }
}

function Upload-FTPFile {
    param(
        [string]$FtpHost,
        [string]$FtpUser,
        [string]$FtpPass,
        [string]$LocalFile,
        [string]$RemotePath
    )
    
    try {
        $uri = "ftp://$FtpHost$RemotePath"
        $webClient = New-Object System.Net.WebClient
        $webClient.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPass)
        
        Write-Host "📤 Subiendo: $([System.IO.Path]::GetFileName($LocalFile))" -ForegroundColor Green
        $webClient.UploadFile($uri, $LocalFile)
        return $true
    } catch {
        Write-Host "❌ Error al subir $LocalFile : $_" -ForegroundColor Red
        return $false
    }
}

function Upload-FTPFolder {
    param(
        [string]$FtpHost,
        [string]$FtpUser,
        [string]$FtpPass,
        [string]$LocalPath,
        [string]$RemotePath
    )
    
    $items = Get-ChildItem -Path $LocalPath
    
    foreach ($item in $items) {
        if ($item.PSIsContainer) {
            # Es un directorio
            $newRemotePath = "$RemotePath/$($item.Name)"
            Write-Host "📁 Creando directorio: $newRemotePath" -ForegroundColor Gray
            
            Create-FTPDirectory -FtpHost $FtpHost -FtpUser $FtpUser -FtpPass $FtpPass -RemotePath $newRemotePath
            
            # Subir contenido recursivamente
            Upload-FTPFolder -FtpHost $FtpHost -FtpUser $FtpUser -FtpPass $FtpPass -LocalPath $item.FullName -RemotePath $newRemotePath
        } else {
            # Es un archivo
            $remoteFile = "$RemotePath/$($item.Name)"
            Upload-FTPFile -FtpHost $FtpHost -FtpUser $FtpUser -FtpPass $FtpPass -LocalFile $item.FullName -RemotePath $remoteFile
        }
    }
}

# ============================================================
# DESPLIEGUE
# ============================================================

try {
    # Crear directorio raíz si no existe
    Create-FTPDirectory -FtpHost $FTP_HOST -FtpUser $FTP_USER -FtpPass $FTP_PASS -RemotePath $FTP_PATH
    
    # Subir todos los archivos
    Upload-FTPFolder -FtpHost $FTP_HOST -FtpUser $FTP_USER -FtpPass $FTP_PASS -LocalPath $LOCAL_BUILD_DIR -RemotePath $FTP_PATH
    
    Write-Host ""
    Write-Host "🎉 ===========================================" -ForegroundColor Green
    Write-Host "   ¡Despliegue exitoso!" -ForegroundColor Green
    Write-Host "🎉 ===========================================" -ForegroundColor Green
    Write-Host ""
    $domain = $FTP_HOST -replace "^ftp\.", ""
    Write-Host "🌐 Visita tu sitio: https://$domain" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "❌ Error durante el despliegue." -ForegroundColor Red
    Write-Host ""
    Write-Host "🔍 Verifica:" -ForegroundColor Yellow
    Write-Host "   • Credenciales FTP correctas" -ForegroundColor Yellow
    Write-Host "   • Permisos de escritura en $FTP_PATH" -ForegroundColor Yellow
    Write-Host "   • Conexión a internet" -ForegroundColor Yellow
    Write-Host "   • El servidor FTP está activo" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Error detallado: $_" -ForegroundColor Red
    Write-Host ""
    exit 1
}

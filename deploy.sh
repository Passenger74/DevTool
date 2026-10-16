#!/bin/bash
# ============================================================
# 🚀 Script de despliegue automático a cPanel vía FTP
# TaskFlow - Project Management
# ============================================================
# USO:
#   1. Edita las variables de configuración abajo
#   2. Ejecuta: bash deploy.sh
#   3. ¡Listo! Tu sitio estará actualizado en cPanel
# ============================================================

# ⚙️ CONFIGURACIÓN - Edita estos valores con tus datos de cPanel
FTP_HOST="ftp.tudominio.com"          # Host FTP de tu cPanel
FTP_USER="tu_usuario_ftp"             # Usuario FTP
FTP_PASS="tu_contraseña"              # Contraseña FTP
FTP_PATH="/public_html/"              # Ruta destino en el servidor

# 📁 Configuración del proyecto
LOCAL_BUILD_DIR="./dist"              # Carpeta local del build
PROJECT_NAME="TaskFlow"               # Nombre del proyecto

# ============================================================
# VALIDACIONES
# ============================================================

echo ""
echo "🚀 ==========================================="
echo "   Desplegando $PROJECT_NAME a cPanel"
echo "🚀 ==========================================="
echo ""

# Verificar credenciales
if [ "$FTP_USER" = "tu_usuario_ftp" ] || [ "$FTP_PASS" = "tu_contraseña" ]; then
    echo "❌ Error: Por favor, edita las credenciales FTP en este script."
    echo "   Abre deploy.sh y modifica las variables:"
    echo "   • FTP_HOST"
    echo "   • FTP_USER"
    echo "   • FTP_PASS"
    echo "   • FTP_PATH"
    echo ""
    exit 1
fi

# Verificar que lftp esté instalado
if ! command -v lftp &> /dev/null; then
    echo "❌ Error: lftp no está instalado."
    echo ""
    echo "📦 Instala lftp con uno de estos comandos:"
    echo "   • Ubuntu/Debian:  sudo apt-get install lftp"
    echo "   • CentOS/RHEL:    sudo yum install lftp"
    echo "   • macOS:          brew install lftp"
    echo "   • Windows:        Usa deploy.ps1 o FileZilla"
    echo ""
    exit 1
fi

# Verificar que exista la carpeta dist
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
    echo "⚠️  La carpeta $LOCAL_BUILD_DIR no existe."
    echo "🔨 Ejecutando build primero..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Error al compilar el proyecto."
        exit 1
    fi
    echo "✅ Build completado exitosamente."
fi

# Verificar que dist no esté vacío
if [ -z "$(ls -A $LOCAL_BUILD_DIR)" ]; then
    echo "❌ Error: La carpeta $LOCAL_BUILD_DIR está vacía."
    echo "🔨 Ejecutando build..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Error al compilar el proyecto."
        exit 1
    fi
fi

echo "📦 Conectando a $FTP_HOST..."
echo "📂 Destino: $FTP_PATH"
echo ""

# ============================================================
# DESPLIEGUE CON LFTP
# ============================================================

lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" <<EOF
set ftp:ssl-allow yes
set ssl:verify-certificate no
set net:max-retries 3
set net:timeout 30
set net:reconnect-interval-base 5
set net:reconnect-interval-max 35

# Navegar al directorio destino
cd $FTP_PATH

# Crear backup de archivos actuales (opcional)
# mirror --reverse --delete . ./backup_$(date +%Y%m%d_%H%M%S)

# Sincronizar archivos
echo "📤 Sincronizando archivos..."
mirror --reverse --delete --verbose \
    --exclude ".git*" \
    --exclude ".env*" \
    --exclude "node_modules/*" \
    "$LOCAL_BUILD_DIR/" "."

echo ""
echo "✅ Sincronización completada!"
bye
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ==========================================="
    echo "   ¡Despliegue exitoso!"
    echo "🎉 ==========================================="
    echo ""
    # Extraer dominio del host FTP
    DOMAIN=$(echo $FTP_HOST | sed 's/^ftp\.//')
    echo "🌐 Visita tu sitio: https://$DOMAIN"
    echo ""
else
    echo ""
    echo "❌ Error durante el despliegue."
    echo ""
    echo "🔍 Verifica:"
    echo "   • Credenciales FTP correctas"
    echo "   • Permisos de escritura en $FTP_PATH"
    echo "   • Conexión a internet"
    echo "   • El servidor FTP está activo"
    echo ""
    echo "💡 Consejo: Prueba conectarte manualmente con:"
    echo "   lftp -u $FTP_USER $FTP_HOST"
    echo ""
    exit 1
fi

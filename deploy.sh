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
FTP_PATH="/public_html/"              # Ruta destino en el servidor (ajusta si es subdominio/subcarpeta)

# 📁 Configuración del proyecto
LOCAL_BUILD_DIR="./dist"              # Carpeta local del build
PROJECT_NAME="TaskFlow"               # Nombre del proyecto (solo para logs)

# ============================================================
# NO EDITAR DE AQUÍ EN ADELANTE (a menos que sepas lo que haces)
# ============================================================

echo ""
echo "🚀 ==========================================="
echo "   Desplegando $PROJECT_NAME a cPanel"
echo "🚀 ==========================================="
echo ""

# Verificar que lftp esté instalado
if ! command -v lftp &> /dev/null; then
    echo "❌ Error: lftp no está instalado."
    echo ""
    echo "📦 Instala lftp con uno de estos comandos:"
    echo "   • Ubuntu/Debian:  sudo apt-get install lftp"
    echo "   • CentOS/RHEL:    sudo yum install lftp"
    echo "   • macOS:          brew install lftp"
    echo "   • Windows:        Usa FileZilla (ver README.md)"
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
fi

echo "📦 Conectando a $FTP_HOST..."
echo "📂 Destino: $FTP_PATH"
echo ""

# Subir archivos usando lftp con mirror (sincronización inteligente)
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" <<EOF
set ftp:ssl-allow no
set ssl:verify-certificate no
set net:max-retries 3
set net:timeout 30

# Eliminar archivos antiguos del servidor (backup primero)
echo "🗑️  Limpiando archivos antiguos..."
mirror --reverse --delete --verbose \
    --exclude ".htaccess.bak" \
    "$LOCAL_BUILD_DIR/" "$FTP_PATH"

echo ""
echo "✅ ¡Despliegue completado!"
bye
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ==========================================="
    echo "   ¡Despliegue exitoso!"
    echo "🎉 ==========================================="
    echo ""
    echo "🌐 Visita tu sitio: https://$(echo $FTP_HOST | sed 's/ftp\.//')"
    echo ""
else
    echo ""
    echo "❌ Error durante el despliegue. Verifica:"
    echo "   • Credenciales FTP correctas"
    echo "   • Permisos de escritura en $FTP_PATH"
    echo "   • Conexión a internet"
    echo ""
    exit 1
fi

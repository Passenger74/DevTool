# 🚀 Guía Rápida de Instalación en cPanel

## ⚡ Método Express (5 minutos)

### 1️⃣ Compilar el proyecto
```bash
npm install
npm run build
```

### 2️⃣ Subir a cPanel

**Opción A: File Manager (Más fácil)**
1. Entra a cPanel → Administrador de archivos
2. Ve a `public_html/`
3. Sube TODO el contenido de `dist/` (NO la carpeta `dist/`)

**Opción B: FTP con FileZilla**
1. Conecta con tus datos FTP
2. Arrastra el contenido de `dist/` a `public_html/`

**Opción C: Script automático (Linux/macOS)**
```bash
# Edita deploy.sh con tus datos FTP
nano deploy.sh

# Ejecuta
bash deploy.sh
```

**Opción D: Script automático (Windows)**
```powershell
# Edita deploy.ps1 con tus datos FTP
notepad deploy.ps1

# Ejecuta
.\deploy.ps1
```

### 3️⃣ Verificar
Abre `https://tudominio.com` en tu navegador

---

## 🔑 Datos que necesitas de tu cPanel

Para cualquier método, necesitas:

- **Host FTP**: `ftp.tudominio.com` (o el que te indique tu hosting)
- **Usuario FTP**: Lo encuentras en cPanel → "Cuentas FTP"
- **Contraseña FTP**: La que configuraste al crear la cuenta FTP
- **Ruta destino**: Normalmente `/public_html/`

---

## 📁 Estructura correcta en el servidor

```
public_html/
├── .htaccess          ← ¡IMPORTANTE!
├── index.html
└── assets/
    ├── index-XXXXX.css
    └── index-XXXXX.js
```

⚠️ **NO subas la carpeta `dist/` completa**, sino su contenido.

---

## 🆘 Problemas comunes

| Problema | Solución |
|---|---|
| Pantalla en blanco | Verifica que `.htaccess` esté en la raíz |
| Error 404 al recargar | El `.htaccess` no funciona, contacta a tu hosting |
| CSS/JS no cargan | Revisa que subiste la carpeta `assets/` |
| Error 500 | Revisa logs en cPanel → "Errores" |

---

## 📚 Documentación completa

Para más detalles, subcarpetas, subdominios, SSL, etc., lee el **README.md** completo.

---

**¿Listo?** ¡Empieza con `npm run build` y sube los archivos! 🚀

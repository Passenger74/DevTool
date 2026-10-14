# 📋 Configuración .htaccess - TaskFlow

## ✅ Correcciones y Mejoras Aplicadas

### 🔒 Seguridad
- **Protección de archivos sensibles**: Bloquea acceso a archivos `.env`, `.git`, `.log`, `.sh`, `.ps1`, `.md`
- **Headers de seguridad**:
  - `X-Content-Type-Options: nosniff` - Previene MIME type sniffing
  - `X-Frame-Options: SAMEORIGIN` - Protección contra clickjacking
  - `X-XSS-Protection: 1; mode=block` - Protección XSS
  - `Referrer-Policy: strict-origin-when-cross-origin` - Control de referrers
  - `Permissions-Policy` - Restricción de APIs del navegador

### 🚀 Rendimiento
- **Cache optimizado**:
  - HTML: 1 hora (debe actualizarse frecuentemente)
  - CSS/JS: 1 año (Vite usa hashes en los nombres)
  - Imágenes: 1 año
  - Fuentes: 1 año
- **Compresión GZIP**: Para HTML, CSS, JS, JSON, SVG, fuentes
- **ETags habilitados**: Para validación eficiente de cache

### 🔄 SPA Routing
- **Reglas de rewrite mejoradas**:
  - No redirige archivos que existen
  - Redirige todo lo demás a `index.html`
  - Previene loops de redirección
  - Compatible con rutas dinámicas de React Router

### 📄 Páginas de Error
- **Error 404, 403, 500**: Redirigen a `index.html` para que React maneje las rutas

### 🛡️ Protección Adicional
- **Listado de directorios deshabilitado**: `Options -Indexes`
- **Charset UTF-8**: Por defecto para todos los archivos
- **Opciones comentadas**:
  - Redirección HTTP → HTTPS
  - Redirección www → non-www
  - Content Security Policy (CSP)

## 📝 Cómo Usar

### Instalación en cPanel
1. Sube el archivo `dist/.htaccess` a la raíz de tu dominio (`public_html/`)
2. Asegúrate de que el archivo tenga permisos 644
3. Verifica que `mod_rewrite` esté habilitado en tu servidor

### Habilitar HTTPS
Descomenta estas líneas en el `.htaccess`:
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Habilitar Redirección www → non-www
Descomenta estas líneas:
```apache
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [L,R=301]
```

### Habilitar Content Security Policy (CSP)
Descomenta y ajusta esta línea según tus necesidades:
```apache
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';"
```

## 🔍 Verificación

### Probar que funciona
1. Accede a tu dominio: `https://tudominio.com`
2. Prueba recargar la página en diferentes rutas
3. Verifica que no haya errores 404
4. Usa herramientas como:
   - [GTmetrix](https://gtmetrix.com/) - Para rendimiento
   - [Security Headers](https://securityheaders.com/) - Para seguridad
   - [Google PageSpeed Insights](https://pagespeed.web.dev/) - Para optimización

### Comandos útiles
```bash
# Verificar sintaxis del .htaccess (en servidor)
apachectl configtest

# Recargar Apache (si tienes acceso)
sudo systemctl reload apache2

# Ver headers de respuesta
curl -I https://tudominio.com
```

## 🐛 Solución de Problemas

### Error 500 Internal Server Error
- Verifica que `mod_rewrite` esté habilitado
- Revisa los logs de error de Apache
- Asegúrate de que la sintaxis del `.htaccess` sea correcta

### Las rutas no funcionan
- Verifica que `AllowOverride All` esté configurado en Apache
- Asegúrate de que el `.htaccess` esté en la raíz del dominio
- Revisa que no haya otro `.htaccess` interfiriendo

### Los assets no cargan
- Verifica que las rutas en `vite.config.js` sean correctas
- Revisa que los archivos estén en la carpeta `assets/`
- Limpia la cache del navegador

## 📊 Impacto en Performance

### Antes
- ❌ Sin compresión GZIP
- ❌ Sin cache optimizado
- ❌ Sin headers de seguridad
- ❌ Sin protección de archivos sensibles

### Después
- ✅ Compresión GZIP (~60-80% reducción)
- ✅ Cache optimizado para assets
- ✅ Headers de seguridad completos
- ✅ Protección de archivos sensibles
- ✅ SPA routing correcto
- ✅ Mejor SEO (sin errores 404)

## 🎯 Métricas Esperadas

- **TTFB (Time to First Byte)**: < 200ms
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Security Score**: A+ en Security Headers

## 📚 Recursos

- [Documentación Apache mod_rewrite](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)
- [Documentación Apache mod_expires](https://httpd.apache.org/docs/current/mod/mod_expires.html)
- [Documentación Apache mod_headers](https://httpd.apache.org/docs/current/mod/mod_headers.html)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**Última actualización**: 2026-02-04
**Versión**: 2.0
**Estado**: ✅ Producción

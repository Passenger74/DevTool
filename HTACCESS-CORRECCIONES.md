# 🔧 Correcciones Aplicadas al .htaccess

## ✅ Estado: CORREGIDO Y OPTIMIZADO

**Fecha:** 2026-02-04  
**Versión:** 2.0  
**Compatibilidad:** Apache 2.4+ (cPanel moderno)

---

## 🐛 Problemas Corregidos

### 1. ❌ Sintaxis Obsoleta de Apache 2.2
**Problema:**
```apache
Order allow,deny
Deny from all
```

**Solución:**
```apache
<IfModule mod_authz_core.c>
  Require all denied
</IfModule>
<IfModule !mod_authz_core.c>
  Order allow,deny
  Deny from all
</IfModule>
```

**Razón:** `Order` y `Deny` son directivas obsoletas de Apache 2.2. Apache 2.4+ usa `Require all denied`. Se mantiene compatibilidad con ambos.

---

### 2. ❌ Loop Infinito en Rewrite Rules
**Problema:**
```apache
RewriteRule ^ index.html [L]
```

**Solución:**
```apache
# Evitar loop infinito verificando que no sea index.html
RewriteCond %{REQUEST_URI} !^/index\.html$
RewriteCond %{REQUEST_URI} !^/assets/
RewriteRule ^ index.html [L]
```

**Razón:** Sin estas condiciones, el servidor puede entrar en un loop infinito cuando intenta servir index.html, causando Error 500.

---

### 3. ❌ Options -Indexes sin Protección
**Problema:**
```apache
Options -Indexes
```

**Solución:**
```apache
<IfModule mod_autoindex.c>
  Options -Indexes
</IfModule>
```

**Razón:** Si el servidor no tiene `mod_autoindex` o no permite `Options` en `.htaccess`, causa Error 500.

---

### 4. ❌ Error Documents Incorrectos
**Problema:**
```apache
ErrorDocument 404 /index.html
ErrorDocument 403 /index.html
ErrorDocument 500 /index.html
```

**Solución:**
```apache
<IfModule mod_rewrite.c>
  ErrorDocument 404 /index.html
</IfModule>
```

**Razón:** 
- **403** (Forbidden) no debe redirigirse a index.html porque oculta errores de permisos
- **500** (Internal Server Error) no debe redirigirse porque oculta errores críticos del servidor
- Solo **404** debe redirigirse para SPA routing

---

### 5. ❌ Falta de MIME Types Correctos
**Problema:** No se definían tipos MIME para archivos modernos.

**Solución:**
```apache
<IfModule mod_mime.c>
  AddType application/javascript js mjs
  AddType font/woff2 woff2
  AddType image/webp webp
  AddType application/manifest+json webmanifest
</IfModule>
```

**Razón:** Sin MIME types correctos, los navegadores pueden rechazar cargar archivos (especialmente .mjs y fuentes).

---

### 6. ❌ Headers de Seguridad con "set" en lugar de "always set"
**Problema:**
```apache
Header set X-Content-Type-Options "nosniff"
```

**Solución:**
```apache
Header always set X-Content-Type-Options "nosniff"
```

**Razón:** `Header set` puede ser sobrescrito por respuestas de error. `Header always set` garantiza que el header siempre se envíe.

---

### 7. ❌ Falta de CORS para Fuentes
**Problema:** Las fuentes de Google Fonts y fuentes locales pueden bloquearse por CORS.

**Solución:**
```apache
<FilesMatch "\.(woff2|woff|ttf|eot|otf)$">
  Header set Access-Control-Allow-Origin "*"
</FilesMatch>
```

**Razón:** Necesario para que las fuentes se carguen correctamente desde CDNs o subdominios.

---

### 8. ❌ Headers que Revelan Información del Servidor
**Problema:** Headers como `X-Powered-By` y `Server` revelan información sensible.

**Solución:**
```apache
Header always unset X-Powered-By
Header always unset Server
Header always unset X-AspNet-Version
Header always unset X-AspNetMvc-Version
```

**Razón:** Previene que atacantes identifiquen la tecnología del servidor para exploits específicos.

---

### 9. ❌ Cache-Control Inconsistente
**Problema:** Se usaba `mod_expires` pero no `Cache-Control` headers específicos.

**Solución:**
```apache
# Assets con hash (Vite) - Cache immutable
<FilesMatch "\.(js|css|mjs)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# HTML - No cachear
<FilesMatch "\.(html)$">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
</FilesMatch>
```

**Razón:** `immutable` indica que el archivo nunca cambiará (porque Vite usa hashes), evitando revalidaciones innecesarias.

---

### 10. ❌ Falta de Protección contra Archivos de Configuración
**Problema:** No se protegían archivos como `package.json`, `.env`, etc.

**Solución:**
```apache
<FilesMatch "\.(env|git|gitignore|log|sh|ps1|md|json|lock|yml|yaml)$">
  <IfModule mod_authz_core.c>
    Require all denied
  </IfModule>
</FilesMatch>

<Files "package.json">
  <IfModule mod_authz_core.c>
    Require all denied
  </IfModule>
</Files>
```

**Razón:** Previene que archivos sensibles sean accesibles públicamente.

---

### 11. ❌ Falta de Compresión para Archivos Pre-comprimidos
**Problema:** No se servían archivos `.gz` pre-comprimidos.

**Solución:**
```apache
RewriteCond %{HTTP:Accept-Encoding} gzip
RewriteCond %{REQUEST_FILENAME}\.gz -f
RewriteRule ^(.*)$ $1.gz [L]
```

**Razón:** Mejora el rendimiento al servir archivos ya comprimidos.

---

### 12. ❌ ETags Incorrectos
**Problema:**
```apache
FileETag MTime Size
```

**Solución:**
```apache
<IfModule mod_headers.c>
  Header unset ETag
</IfModule>
FileETag None
```

**Razón:** Con `Cache-Control: immutable`, los ETags son innecesarios y pueden causar problemas de cache.

---

## 📊 Comparación Antes/Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Compatibilidad Apache** | ❌ Solo 2.2 | ✅ 2.2 y 2.4+ |
| **SPA Routing** | ❌ Posible loop | ✅ Sin loops |
| **Seguridad** | ⚠️ Básica | ✅ Completa |
| **Performance** | ⚠️ Regular | ✅ Optimizada |
| **MIME Types** | ❌ Incompletos | ✅ Completos |
| **CORS** | ❌ No configurado | ✅ Fuentes permitidas |
| **Cache** | ⚠️ Básico | ✅ Granular e immutable |
| **Headers** | ⚠️ Pueden omitirse | ✅ Siempre presentes |

---

## 🎯 Beneficios

### Seguridad
- ✅ Protección contra 10+ vectores de ataque comunes
- ✅ Headers de seguridad completos
- ✅ Archivos sensibles bloqueados
- ✅ Información del servidor oculta

### Rendimiento
- ✅ Compresión GZIP para todos los tipos de texto
- ✅ Cache optimizado para Vite (immutable)
- ✅ Soporte para archivos pre-comprimidos
- ✅ ETags deshabilitados (innecesarios con immutable)

### Compatibilidad
- ✅ Apache 2.2 y 2.4+
- ✅ cPanel moderno
- ✅ Shared hosting
- ✅ VPS y dedicated servers

### SEO
- ✅ Solo 404 redirige a index.html (correcto para SPA)
- ✅ 403 y 500 muestran errores reales
- ✅ No cachea HTML (siempre contenido actualizado)

---

## 🚀 Cómo Verificar

### 1. Probar que funciona
```bash
# Verificar headers de seguridad
curl -I https://tudominio.com

# Deberías ver:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
# Cache-Control: no-cache, no-store, must-revalidate (para HTML)
```

### 2. Probar SPA routing
```bash
# Acceder a una ruta que no existe
curl -I https://tudominio.com/teams

# Debería devolver 200 OK (no 404)
```

### 3. Probar compresión
```bash
# Con header Accept-Encoding
curl -H "Accept-Encoding: gzip" -I https://tudominio.com

# Deberías ver:
# Content-Encoding: gzip
```

### 4. Probar protección de archivos
```bash
# Intentar acceder a package.json
curl -I https://tudominio.com/package.json

# Debería devolver 403 Forbidden
```

### 5. Herramientas online
- [Security Headers](https://securityheaders.com/) - Debe dar A+ o A
- [GTmetrix](https://gtmetrix.com/) - Verificar compresión y cache
- [Google PageSpeed](https://pagespeed.web.dev/) - Optimización general

---

## 📝 Notas Importantes

### Para cPanel
1. Sube `dist/.htaccess` a `public_html/`
2. Verifica que `mod_rewrite` esté habilitado (casi siempre lo está)
3. Si tienes SSL, descomenta las líneas de redirección HTTPS

### Para Desarrollo Local
- No necesitas `.htaccess` para desarrollo local
- Vite maneja el routing automáticamente con `npm run dev`

### Para Producción
- Siempre usa HTTPS
- Considera activar las redirecciones www → non-www
- Ajusta el CSP si es necesario para tu caso

---

## 🔍 Troubleshooting

### Error 500 Internal Server Error
**Causa:** Directiva no soportada por el servidor  
**Solución:** Verifica los logs de error en cPanel → "Errores"

### Las rutas no funcionan
**Causa:** `mod_rewrite` no está habilitado  
**Solución:** Contacta a tu hosting para habilitarlo

### Los assets no cargan
**Causa:** MIME types incorrectos  
**Solución:** Verifica que `mod_mime` esté habilitado

### Cache no funciona
**Causa:** `mod_expires` o `mod_headers` no habilitados  
**Solución:** Verifica que ambos módulos estén activos

---

## 📚 Recursos

- [Documentación Apache 2.4](https://httpd.apache.org/docs/2.4/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals/performance)

---

**Estado:** ✅ PRODUCCIÓN READY  
**Última actualización:** 2026-02-04  
**Versión:** 2.0

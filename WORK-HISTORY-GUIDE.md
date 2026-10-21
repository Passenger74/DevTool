# 📊 Guía de Exportación de Historial de Trabajos

## 🎯 Descripción

La funcionalidad de **Historial de Trabajos** permite registrar automáticamente todas las tareas completadas por los equipos y exportarlas en formato CSV para análisis externo o reportes.

## ✨ Características

### 📝 Registro Automático
- Se registra automáticamente cuando una tarea se marca como **Completada**
- Captura los siguientes datos:
  - **Miembro**: Nombre del asignado
  - **Espacio**: Nombre del espacio donde se completó
  - **Trabajo**: Título de la tarea
  - **Fecha**: Fecha de completado (dd/MM/yyyy)
  - **Hora**: Hora de completado (HH:mm)
  - **Etiquetas**: Tags asociados a la tarea

### 🔍 Filtros Avanzados
- **Por Espacio**: Filtra por espacios específicos o todos
- **Por Miembro**: Filtra por miembros del equipo
- **Por Rango de Fechas**: Define fecha desde y hasta

### 📤 Exportación CSV
- Exporta todos los registros filtrados
- Formato compatible con Excel, Google Sheets, etc.
- Nombre de archivo con fecha automática
- Codificación UTF-8 para caracteres especiales

## 🚀 Cómo Usar

### 1. Completar una Tarea
Cuando marcas una tarea como **Completada**, se registra automáticamente en el historial:
- La tarea debe estar asignada a un espacio
- Se captura el momento exacto de completado

### 2. Acceder al Historial
1. Ve al menú lateral
2. Click en **"Historial"** (icono de reloj)
3. Verás la tabla con todos los registros

### 3. Aplicar Filtros
```
Filtros disponibles:
├── Espacio: Selecciona un espacio específico o "Todos"
├── Miembro: Selecciona un miembro o "Todos"
├── Fecha desde: Define inicio del rango
└── Fecha hasta: Define fin del rango
```

### 4. Exportar a CSV
1. Aplica los filtros deseados
2. Click en **"Exportar CSV"**
3. El archivo se descargará automáticamente
4. Nombre del archivo: `historial_trabajos_YYYY-MM-DD.csv`

## 📋 Formato del CSV

El archivo CSV exportado tiene la siguiente estructura:

```csv
"Miembro","Espacio","Trabajo","Fecha","Hora","Etiquetas"
"Juan Pérez","Marketing","Rediseñar landing page","15/02/2026","14:30","diseño, urgente"
"María García","Desarrollo","Implementar API","16/02/2026","10:15","backend, API"
```

### Campos:
- **Miembro**: Nombre completo del asignado
- **Espacio**: Nombre del espacio donde se completó
- **Trabajo**: Título de la tarea
- **Fecha**: Formato dd/MM/yyyy
- **Hora**: Formato HH:mm (24 horas)
- **Etiquetas**: Lista separada por comas

## 💡 Casos de Uso

### 1. Reportes de Productividad
- Exporta el historial mensual
- Analiza la productividad por miembro
- Identifica espacios con mayor actividad

### 2. Auditoría de Trabajos
- Rastrea cuándo se completaron las tareas
- Verifica el cumplimiento de plazos
- Documenta el trabajo realizado

### 3. Análisis de Equipos
- Compara el rendimiento entre equipos
- Identifica cuellos de botella
- Optimiza la distribución de tareas

### 4. Facturación por Proyecto
- Exporta trabajos por cliente/proyecto
- Calcula horas trabajadas
- Genera reportes para clientes

## 🔧 Configuración

### Filtros Comunes

**Último mes:**
```
Fecha desde: 01/MM/AAAA
Fecha hasta: Fecha actual
```

**Por miembro específico:**
```
Miembro: Seleccionar nombre
Espacio: Todos
```

**Por espacio:**
```
Espacio: Seleccionar espacio
Miembro: Todos
```

### Ejemplos de Exportación

**Reporte mensual completo:**
1. Filtros: Todos los espacios, todos los miembros
2. Rango: Primer día del mes → Último día del mes
3. Exportar CSV

**Productividad por equipo:**
1. Filtros: Espacio específico
2. Rango: Últimos 30 días
3. Exportar CSV

**Trabajos de un miembro:**
1. Filtros: Miembro específico
2. Rango: Sin límite
3. Exportar CSV

## 📊 Análisis Post-Exportación

### En Excel/Google Sheets:

**1. Tablas dinámicas:**
- Agrupa por miembro
- Cuenta tareas por espacio
- Analiza tendencias por fecha

**2. Gráficos:**
- Tareas completadas por semana
- Distribución por espacio
- Productividad por miembro

**3. Fórmulas útiles:**
```excel
# Contar tareas por miembro
=CONTAR.SI(A:A, "Juan Pérez")

# Promedio de tareas por día
=CONTARA(A:A) / DIAS(F2, F1)

# Tareas por espacio
=CONTAR.SI(B:B, "Marketing")
```

## 🎨 Personalización

### Modificar el Formato de Fecha
Edita `src/components/WorkHistoryExport.tsx`:

```typescript
// Cambiar formato de fecha
format(new Date(entry.completedAt), 'yyyy-MM-dd', { locale: es })
```

### Agregar Campos Adicionales
Puedes agregar más campos al CSV modificando el array `headers` y `rows`:

```typescript
const headers = ['Miembro', 'Espacio', 'Trabajo', 'Fecha', 'Hora', 'Etiquetas', 'Prioridad'];
const rows = filteredHistory.map(entry => [
  entry.assignee,
  entry.spaceName,
  entry.taskTitle,
  format(new Date(entry.completedAt), 'dd/MM/yyyy', { locale: es }),
  format(new Date(entry.completedAt), 'HH:mm', { locale: es }),
  entry.tags.join(', '),
  entry.priority, // Nuevo campo
]);
```

## 🔍 Solución de Problemas

### No se registran tareas
**Causa:** La tarea no está asignada a un espacio
**Solución:** Asigna la tarea a un espacio antes de completarla

### El CSV tiene caracteres extraños
**Causa:** Problema de codificación
**Solución:** Abre el CSV con codificación UTF-8 en Excel

### No puedo filtrar por fechas
**Causa:** Formato de fecha incorrecto
**Solución:** Usa el formato YYYY-MM-DD en los inputs de fecha

### El historial está vacío
**Causa:** No hay tareas completadas
**Solución:** Completa algunas tareas y verifica que estén asignadas a espacios

## 📈 Mejoras Futuras

- [ ] Exportación a Excel (.xlsx)
- [ ] Gráficos integrados
- [ ] Filtros por etiquetas
- [ ] Exportación por correo electrónico
- [ ] Programación de exportaciones automáticas
- [ ] Integración con Google Sheets
- [ ] Análisis de tendencias
- [ ] Reportes personalizados

## 🛠️ Dependencias

- **date-fns**: Para formateo de fechas
- **React**: Para la interfaz de usuario
- **Tailwind CSS**: Para el diseño responsivo

## 📞 Soporte

Si encuentras problemas o tienes sugerencias:
1. Revisa la documentación en README.md
2. Verifica que las tareas estén asignadas a espacios
3. Asegúrate de que date-fns esté instalado correctamente

---

**Última actualización:** 2026-02-04  
**Versión:** 1.0

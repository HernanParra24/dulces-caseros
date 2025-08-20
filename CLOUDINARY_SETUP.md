# 🖼️ Configuración de Cloudinary para Gestión de Imágenes

## 📋 Información de tu cuenta Cloudinary

- **Cloud Name**: `dvmg30upu`
- **API Key**: `127969499813155`
- **API Secret**: [Necesitas proporcionar tu API Secret real]

## 🔧 Configuración Requerida

### 1. Obtener tu API Secret

1. Ve a [cloudinary.com](https://cloudinary.com) e inicia sesión
2. Ve a tu **Dashboard**
3. En la sección **Account Details**, copia tu **API Secret**
4. Reemplaza `'tu_api_secret_aqui'` en el archivo `backend/src/common/services/cloudinary.service.ts`

### 2. Configurar Variables de Entorno (Opcional)

Crea un archivo `.env` en la carpeta `backend/` con:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dvmg30upu
CLOUDINARY_API_KEY=127969499813155
CLOUDINARY_API_SECRET=tu_api_secret_real_aqui
```

## 🚀 Funcionalidades Implementadas

### ✅ Subida de Imágenes de Productos
- **Ubicación**: Admin Panel → Productos → Crear/Editar Producto
- **Formatos**: JPG, PNG, GIF, WEBP
- **Tamaño máximo**: 5MB
- **Optimización**: Automática (800x600px, calidad auto)

### ✅ Subida de Logo del Sitio
- **Ubicación**: Admin Panel → Configuración → Logo del Sitio
- **Formatos**: JPG, PNG, SVG
- **Tamaño máximo**: 2MB
- **Optimización**: Mantiene proporciones originales

### ✅ Características
- **Almacenamiento**: Carpeta `dulce-twilight` en Cloudinary
- **URLs seguras**: HTTPS automático
- **CDN global**: Imágenes se cargan rápido desde cualquier lugar
- **Optimización automática**: Redimensionamiento y compresión
- **Validación**: Tipos de archivo y tamaños

## 📁 Estructura de Carpetas en Cloudinary

```
dulce-twilight/
├── productos/
│   ├── producto1.jpg
│   ├── producto2.png
│   └── ...
├── logos/
│   └── logo-sitio.png
└── otros/
    └── ...
```

## 🔒 Seguridad

- **Autenticación**: Solo administradores pueden subir imágenes
- **Validación**: Tipos de archivo y tamaños verificados
- **Limpieza**: URLs seguras y optimizadas

## 💡 Consejos para Imágenes

### Para Productos:
- **Tamaño mínimo**: 800x600px
- **Formato recomendado**: JPG o PNG
- **Fondo**: Limpio y bien iluminado
- **Producto**: Debe ocupar al menos el 70% de la imagen

### Para Logo:
- **Formato recomendado**: PNG con fondo transparente
- **Tamaño mínimo**: 200x100px
- **Fondo**: Transparente para mejor integración

## 🛠️ Solución de Problemas

### Error: "Invalid API Secret"
- Verifica que el API Secret sea correcto
- Asegúrate de que no tenga espacios extra

### Error: "File too large"
- Reduce el tamaño de la imagen
- Comprime la imagen antes de subirla

### Error: "Invalid file type"
- Usa solo los formatos permitidos
- Verifica la extensión del archivo

## 📞 Soporte

Si tienes problemas con Cloudinary:
1. Verifica tu cuenta en [cloudinary.com](https://cloudinary.com)
2. Revisa los logs del backend
3. Contacta al administrador del sistema

---

**¡Listo!** Una vez configurado, podrás subir imágenes directamente desde el admin panel. 🎉

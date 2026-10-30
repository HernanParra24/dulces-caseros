# Google Maps Integration - Dulce Twilight

## 📍 Descripción

Se ha integrado un mapa interactivo de Google Maps en la sección "Nuestra Historia" de la página "Sobre Nosotros". El mapa muestra la ubicación de Dulce Twilight en Lavalle Costa de Araujo, Mendoza, Argentina.

## 🗺️ Características del Mapa

### ✅ Funcionalidades Implementadas

1. **Mapa Interactivo**: Muestra la ubicación exacta de la empresa
2. **Marcador Personalizado**: Ícono personalizado con los colores de Dulce Twilight
3. **Ventana de Información**: Al hacer clic en el marcador, muestra detalles de la empresa
4. **Botón de Acceso Directo**: Permite abrir la ubicación en Google Maps
5. **Estados de Carga**: Muestra un spinner mientras carga el mapa
6. **Manejo de Errores**: Muestra mensaje si no se puede cargar la ubicación
7. **Responsive**: Se adapta a diferentes tamaños de pantalla

### 🎨 Diseño

- **Colores**: Utiliza los colores corporativos (naranja #f97316 y púrpura)
- **Marcador**: Diseño personalizado con círculos concéntricos
- **Estilo**: Bordes redondeados y sombras para un look moderno
- **Tamaño**: 320px de altura en móviles, 400px en desktop

## 🔧 Configuración Técnica

### API Key de Google Maps

El componente utiliza una API key pública de Google Maps para desarrollo. Para producción, se recomienda:

1. Crear una API key personalizada en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar las APIs necesarias:
   - Maps JavaScript API
   - Geocoding API
   - Places API

### Ubicación Configurada

```javascript
address = "Lavalle Costa de Araujo, Mendoza, Argentina"
```

### Componente Principal

```typescript
// frontend/src/components/google-maps.tsx
export default function GoogleMaps({ 
  address = "Lavalle Costa de Araujo, Mendoza, Argentina",
  className = "w-full h-64 rounded-lg"
}: GoogleMapsProps)
```

## 📱 Uso del Mapa

### Para los Clientes

1. **Ver Ubicación**: El mapa muestra exactamente dónde está ubicada la empresa
2. **Obtener Direcciones**: Pueden hacer clic en "Abrir en Google Maps" para obtener rutas
3. **Información de Contacto**: La ventana de información incluye detalles de la empresa

### Para el Desarrollo

1. **Personalización**: Fácil cambio de ubicación modificando el prop `address`
2. **Estilos**: Personalizable a través de la prop `className`
3. **Funcionalidad**: Extensible para agregar más funcionalidades

## 🚀 Beneficios

### Para el Negocio

- **Visibilidad**: Los clientes pueden encontrar fácilmente la ubicación
- **Confianza**: Muestra que es un negocio real con ubicación física
- **Accesibilidad**: Facilita las visitas presenciales

### Para los Clientes

- **Conveniencia**: Pueden obtener direcciones directamente
- **Transparencia**: Saben exactamente dónde está ubicado el negocio
- **Planificación**: Pueden planificar visitas con anticipación

## 🔄 Mantenimiento

### Actualizar Ubicación

Para cambiar la ubicación, modificar en:
```typescript
// frontend/src/app/sobre-nosotros/page.tsx
<GoogleMaps 
  address="Nueva Dirección, Ciudad, País"
  className="w-full h-64 sm:h-80 rounded-2xl shadow-lg"
/>
```

### Personalizar Estilos

Los estilos se pueden personalizar modificando las clases CSS en el componente.

## 📞 Soporte

Si necesitas ayuda con la configuración del mapa o quieres agregar funcionalidades adicionales, contacta al equipo de desarrollo.

---

**Nota**: Esta implementación utiliza la API gratuita de Google Maps. Para uso comercial intensivo, considera obtener una API key personalizada.

# 🍰 Dulces Caseros - E-commerce

Una plataforma de e-commerce completa para la venta de dulces artesanales argentinos.

## 🚀 Características

- **Frontend**: Next.js con React y TypeScript
- **Backend**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT
- **Panel de Administración**: Gestión completa de productos, usuarios y pedidos
- **Sección "Próximamente"**: Para mostrar productos futuros
- **Sistema de Reseñas**: Calificaciones y comentarios de usuarios
- **Carrito de Compras**: Gestión de productos favoritos
- **Soporte al Cliente**: Sistema de tickets
- **Notificaciones**: Sistema de notificaciones en tiempo real

## 📁 Estructura del Proyecto

```
├── frontend/          # Aplicación Next.js
├── backend/           # API NestJS
└── README.md
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Framer Motion
- React Hot Toast

### Backend
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication
- Multer (File Upload)
- Cloudinary (Image Storage)

## 🚀 Deploy

### Frontend (Vercel)
- URL: [Tu URL de Vercel]
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

### Backend (Render)
- URL: [Tu URL de Render]
- Runtime: Node.js
- Build Command: `npm install && npm run build`
- Start Command: `npm run start:prod`

## 🔧 Variables de Entorno

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=tu-jwt-secret
CLOUDINARY_URL=tu-cloudinary-url
```

## 📝 Scripts Disponibles

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Iniciar en producción
```

### Backend
```bash
npm run start:dev    # Desarrollo
npm run build        # Build para producción
npm run start:prod   # Iniciar en producción
```

## 👥 Autores

- **Hernán Parra** - Desarrollo completo

## 📄 Licencia

Este proyecto es privado y está destinado para uso comercial.

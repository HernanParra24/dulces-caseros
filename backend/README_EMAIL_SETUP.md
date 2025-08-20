# Configuración de Email para Dulces Caseros

## Opción 1: Resend (Recomendado)

Resend es un servicio de email moderno y confiable que ofrece 3,000 emails gratis por mes.

### Pasos para configurar Resend:

1. **Crear cuenta en Resend:**
   - Ve a [resend.com](https://resend.com)
   - Regístrate con tu email
   - Verifica tu cuenta

2. **Obtener API Key:**
   - En el dashboard de Resend, ve a "API Keys"
   - Crea una nueva API key
   - Copia la key (empieza con `re_`)

3. **Configurar dominio (opcional pero recomendado):**
   - Ve a "Domains" en el dashboard
   - Agrega tu dominio (ej: `dulcescaseros.com`)
   - Sigue las instrucciones para configurar los registros DNS

4. **Configurar variables de entorno:**
   ```bash
   # En tu archivo .env del backend
   RESEND_API_KEY=re_tu_api_key_aqui
   FRONTEND_URL=http://localhost:3000
   ```

## Opción 2: Gmail (Fallback)

Si prefieres usar Gmail, necesitarás configurar una contraseña de aplicación.

### Pasos para configurar Gmail:

1. **Habilitar autenticación de 2 factores:**
   - Ve a tu cuenta de Google
   - Activa la verificación en 2 pasos

2. **Crear contraseña de aplicación:**
   - Ve a "Seguridad" > "Contraseñas de aplicación"
   - Selecciona "Otra" y dale un nombre (ej: "Dulces Caseros")
   - Copia la contraseña generada

3. **Configurar variables de entorno:**
   ```bash
   # En tu archivo .env del backend
   EMAIL_USER=dulcetwilightdc2609@gmail.com
   EMAIL_PASSWORD=tu-contraseña-de-aplicación
   FRONTEND_URL=http://localhost:3000
   ```

## Opción 3: Ethereal Email (Solo desarrollo)

Para desarrollo, si no configuras ninguna de las opciones anteriores, se usará Ethereal Email automáticamente.

- Los emails se envían a una bandeja de prueba
- Se muestra la URL de vista previa en la consola
- No se envían emails reales

## Variables de entorno necesarias:

```bash
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=dulces_caseros

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=1h

# Email (Resend - Recomendado)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Email (Gmail - Fallback)
EMAIL_USER=dulcetwilightdc2609@gmail.com
EMAIL_PASSWORD=tu-app-password

# Frontend
FRONTEND_URL=http://localhost:3000

# Servidor
PORT=3001
NODE_ENV=development
```

## Pruebas:

1. **Registra un nuevo usuario** en la aplicación
2. **Revisa la consola del backend** para ver los logs de envío
3. **Verifica el email** en tu bandeja de entrada (o spam)
4. **Haz clic en el enlace** para verificar la cuenta
5. **Inicia sesión** con las credenciales

## Solución de problemas:

### Error: "No se pudo enviar el email de verificación"
- Verifica que las variables de entorno estén configuradas correctamente
- Revisa los logs del backend para más detalles
- Asegúrate de que el email no esté en la carpeta de spam

### Error: "Token de verificación inválido"
- El token puede haber expirado
- Usa la opción "Re-enviar email" en la página de verificación

### Error con Gmail: "Invalid login"
- Verifica que estés usando una contraseña de aplicación, no tu contraseña normal
- Asegúrate de que la verificación en 2 pasos esté activada

### Error con Resend: "Unauthorized"
- Verifica que la API key sea correcta
- Asegúrate de que la cuenta esté verificada

// Función serverless de Vercel: delega todas las rutas en la app NestJS compilada en dist/
module.exports = require('../dist/serverless').default;

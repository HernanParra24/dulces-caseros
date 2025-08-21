const https = require('https');

// Configuración para Render
const RENDER_API_KEY = 'rnd_3bIjuvMuBHdX6340vVhKOCgmJVSZ';
const REPO_URL = 'https://github.com/HernanParra24/dulces-caseros';

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.render.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function createPostgreSQLDatabase() {
  console.log('🗄️ Creando base de datos PostgreSQL...');
  
  const dbData = {
    name: 'dulces-caseros-db',
    databaseName: 'dulces_caseros',
    user: 'postgres',
    plan: 'free'
  };

  try {
    const response = await makeRequest('/v1/databases', 'POST', dbData);
    console.log('✅ Base de datos creada:', response.id);
    return response;
  } catch (error) {
    console.error('❌ Error creando base de datos:', error);
    throw error;
  }
}

async function createWebService(dbId) {
  console.log('🌐 Creando servicio web...');
  
  const serviceData = {
    name: 'dulces-caseros-backend',
    type: 'web_service',
    plan: 'free',
    repoUrl: REPO_URL,
    branch: 'main',
    rootDir: 'backend',
    buildCommand: 'npm install && npm run build',
    startCommand: 'npm run start:prod',
    envVars: [
      {
        key: 'NODE_ENV',
        value: 'production'
      },
      {
        key: 'JWT_SECRET',
        value: '354bd5bf47ca9d0c35e79652553386a588e58a8820feb426090cab6c97b34a3d8bce97726ff3cbac0b00c47e3cdb1b88e6a4e9ab91f9c945bc6dcd229d528cad'
      },
      {
        key: 'PORT',
        value: '10000'
      }
    ]
  };

  if (dbId) {
    serviceData.envVars.push({
      key: 'DATABASE_URL',
      fromDatabase: {
        name: 'dulces-caseros-db',
        property: 'connectionString'
      }
    });
  }

  try {
    const response = await makeRequest('/v1/services', 'POST', serviceData);
    console.log('✅ Servicio web creado:', response.id);
    return response;
  } catch (error) {
    console.error('❌ Error creando servicio web:', error);
    throw error;
  }
}

async function deployToRender() {
  console.log('🚀 Iniciando despliegue automático en Render...');
  
  console.log('✅ API Key configurada correctamente');

  try {
    // Crear base de datos
    const db = await createPostgreSQLDatabase();
    
    // Crear servicio web
    const service = await createWebService(db.id);
    
    console.log('');
    console.log('🎉 ¡DESPLIEGUE COMPLETADO!');
    console.log('');
    console.log('📊 RESULTADOS:');
    console.log(`🗄️ Base de datos: ${db.id}`);
    console.log(`🌐 Servicio web: ${service.id}`);
    console.log(`🔗 URL del backend: ${service.serviceUrl || 'Se generará en unos minutos'}`);
    console.log('');
    console.log('⏳ El servicio estará disponible en unos 5-10 minutos');
    console.log('📱 Puedes monitorear el progreso en https://render.com/dashboard');
    
  } catch (error) {
    console.error('❌ Error en el despliegue:', error);
  }
}

deployToRender();

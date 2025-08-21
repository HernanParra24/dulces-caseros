const https = require('https');

const API_KEY = 'rnd_3bIjuvMuBHdX6340vVhKOCgmJVSZ';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.render.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
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
        console.log('Response status:', res.statusCode);
        console.log('Response body:', body);
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    if (data) {
      const jsonData = JSON.stringify(data);
      console.log('Sending data:', jsonData);
      req.write(jsonData);
    }
    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Probando conexión con la API de Render...');
  
  try {
    // Primero vamos a listar los servicios existentes
    const response = await makeRequest('/v1/services');
    console.log('✅ Conexión exitosa con la API de Render');
    console.log('📋 Servicios existentes:', response);
  } catch (error) {
    console.error('❌ Error conectando con la API:', error);
  }
}

async function createDatabase() {
  console.log('🗄️ Creando base de datos PostgreSQL...');
  
  const dbData = {
    name: 'dulces-caseros-db',
    databaseName: 'dulces_caseros',
    user: 'postgres',
    plan: 'free'
  };

  try {
    const response = await makeRequest('/v1/databases', 'POST', dbData);
    console.log('✅ Base de datos creada:', response);
    return response;
  } catch (error) {
    console.error('❌ Error creando base de datos:', error);
    throw error;
  }
}

async function createService() {
  console.log('🌐 Creando servicio web...');
  
  const serviceData = {
    name: 'dulces-caseros-backend',
    type: 'web_service',
    plan: 'free',
    repoUrl: 'https://github.com/HernanParra24/dulces-caseros',
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

  try {
    const response = await makeRequest('/v1/services', 'POST', serviceData);
    console.log('✅ Servicio web creado:', response);
    return response;
  } catch (error) {
    console.error('❌ Error creando servicio web:', error);
    throw error;
  }
}

async function deploy() {
  console.log('🚀 Iniciando despliegue en Render...');
  
  try {
    // Primero probar la API
    await testAPI();
    
    // Crear base de datos
    const db = await createDatabase();
    
    // Crear servicio web
    const service = await createService();
    
    console.log('');
    console.log('🎉 ¡DESPLIEGUE COMPLETADO!');
    console.log('');
    console.log('📊 RESULTADOS:');
    console.log('🗄️ Base de datos:', db);
    console.log('🌐 Servicio web:', service);
    console.log('');
    console.log('📱 Puedes monitorear el progreso en https://render.com/dashboard');
    
  } catch (error) {
    console.error('❌ Error en el despliegue:', error);
  }
}

deploy();

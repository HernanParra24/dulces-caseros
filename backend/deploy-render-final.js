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
        if (res.statusCode >= 400) {
          console.log('Error response:', body);
        }
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

async function getUserInfo() {
  console.log('👤 Obteniendo información del usuario...');
  
  try {
    const response = await makeRequest('/v1/user');
    console.log('✅ Información del usuario:', response);
    return response;
  } catch (error) {
    console.error('❌ Error obteniendo información del usuario:', error);
    throw error;
  }
}

async function createService(ownerId) {
  console.log('🌐 Creando servicio web...');
  
  const serviceData = {
    name: 'dulces-caseros-backend',
    type: 'web_service',
    plan: 'free',
    ownerId: ownerId,
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
    // Obtener información del usuario
    const userInfo = await getUserInfo();
    const ownerId = userInfo.id;
    
    console.log(`👤 Usuario: ${userInfo.email} (ID: ${ownerId})`);
    
    // Crear servicio web
    const service = await createService(ownerId);
    
    console.log('');
    console.log('🎉 ¡DESPLIEGUE COMPLETADO!');
    console.log('');
    console.log('📊 RESULTADOS:');
    console.log('🌐 Servicio web:', service);
    console.log('');
    console.log('📱 Puedes monitorear el progreso en https://render.com/dashboard');
    console.log('🔗 Una vez que esté listo, la URL será: https://dulces-caseros-backend.onrender.com');
    
  } catch (error) {
    console.error('❌ Error en el despliegue:', error);
  }
}

deploy();

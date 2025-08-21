const axios = require('axios');

async function deleteTestAdmin() {
  try {
    console.log('🔄 Eliminando cuenta de prueba...');
    
    // Hacer la petición DELETE al endpoint
    const response = await axios.delete('https://dulces-caseros.onrender.com/admin/delete-test-admin', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta del servidor:', response.data);
    console.log('✅ Cuenta de prueba eliminada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al eliminar cuenta de prueba:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

deleteTestAdmin();

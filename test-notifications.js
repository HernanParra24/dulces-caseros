const axios = require('axios');

const API_BASE_URL = 'https://dulces-artesanales-backend.onrender.com';

async function testNotifications() {
  try {
    console.log('🧪 Probando sistema de notificaciones...\n');

    // 1. Verificar productos con stock bajo
    console.log('1️⃣ Verificando productos con stock bajo...');
    const checkResponse = await axios.post(`${API_BASE_URL}/products/check-low-stock`);
    console.log('✅ Verificación completada:', checkResponse.data);

    // 2. Obtener todas las notificaciones
    console.log('\n2️⃣ Obteniendo todas las notificaciones...');
    const notificationsResponse = await axios.get(`${API_BASE_URL}/notifications`);
    console.log('📋 Notificaciones encontradas:', notificationsResponse.data.length);
    
    // Mostrar las notificaciones de stock bajo
    const lowStockNotifications = notificationsResponse.data.filter(n => n.type === 'low_stock');
    console.log('🔴 Notificaciones de stock bajo:', lowStockNotifications.length);
    
    lowStockNotifications.forEach((notification, index) => {
      console.log(`   ${index + 1}. ${notification.title}: ${notification.message}`);
      console.log(`      Creada: ${notification.createdAt}`);
      console.log(`      Leída: ${notification.isRead ? 'Sí' : 'No'}`);
    });

    // 3. Obtener estadísticas de notificaciones
    console.log('\n3️⃣ Obteniendo estadísticas...');
    const statsResponse = await axios.get(`${API_BASE_URL}/notifications/stats`);
    console.log('📊 Estadísticas:', statsResponse.data);

    // 4. Obtener productos para verificar cuáles tienen stock bajo
    console.log('\n4️⃣ Verificando productos con stock bajo...');
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    const lowStockProducts = productsResponse.data.filter(p => p.stock <= 5 && p.stock > 0);
    
    console.log('📦 Productos con stock bajo (≤5):', lowStockProducts.length);
    lowStockProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - Stock: ${product.stock}`);
    });

    console.log('\n🎯 Resumen:');
    console.log(`   - Productos con stock bajo: ${lowStockProducts.length}`);
    console.log(`   - Notificaciones de stock bajo: ${lowStockNotifications.length}`);
    console.log(`   - Total de notificaciones: ${notificationsResponse.data.length}`);

    if (lowStockProducts.length > 0 && lowStockNotifications.length === 0) {
      console.log('\n❌ PROBLEMA: Hay productos con stock bajo pero no hay notificaciones');
      console.log('🔧 Posibles causas:');
      console.log('   1. Las notificaciones ya existen (verificación de duplicados)');
      console.log('   2. Error en la creación de notificaciones');
      console.log('   3. Problema en la base de datos');
    } else if (lowStockProducts.length === 0) {
      console.log('\n✅ No hay productos con stock bajo');
    } else {
      console.log('\n✅ Sistema funcionando correctamente');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testNotifications();

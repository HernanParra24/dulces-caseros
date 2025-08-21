const { Pool } = require('pg');

// URL de la base de datos de Render
const connectionString = 'postgresql://postgre:e3cgeF6L3lPUu8jzWb8LtwGDUJmkL6jA@dpg-d2jatmvdiees73c0ded0-a.oregon-postgres.render.com/dulces_caseros';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function deleteTestAdmin() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    
    // Eliminar la cuenta de prueba
    const result = await pool.query(
      'DELETE FROM users WHERE email = $1',
      ['admin@dulcestwilight.com']
    );
    
    if (result.rowCount > 0) {
      console.log('✅ Cuenta de prueba eliminada exitosamente');
      console.log(`Se eliminaron ${result.rowCount} registros`);
    } else {
      console.log('⚠️ No se encontró la cuenta de prueba para eliminar');
    }
    
  } catch (error) {
    console.error('❌ Error al eliminar la cuenta de prueba:', error.message);
    
    // Si es error de autenticación, intentar con diferentes credenciales
    if (error.message.includes('password authentication failed')) {
      console.log('🔄 Intentando con credenciales alternativas...');
      
      // Intentar con diferentes variaciones de la URL
      const alternativeUrls = [
        'postgres://postgre:password123@dpg-d2jatmvdiees73c0ded0-a.oregon-postgres.render.com/dulces_caseros',
        'postgresql://postgre:password123@dpg-d2jatmvdiees73c0ded0-a.oregon-postgres.render.com/dulces_caseros',
        'postgres://postgre:password123@dpg-d2jatmvdiees73c0ded0-a.oregon-postgres.render.com:5432/dulces_caseros'
      ];
      
      for (const url of alternativeUrls) {
        try {
          const altPool = new Pool({
            connectionString: url,
            ssl: { rejectUnauthorized: false }
          });
          
          const altResult = await altPool.query(
            'DELETE FROM users WHERE email = $1',
            ['admin@dulcestwilight.com']
          );
          
          if (altResult.rowCount > 0) {
            console.log('✅ Cuenta de prueba eliminada exitosamente con URL alternativa');
            console.log(`Se eliminaron ${altResult.rowCount} registros`);
            await altPool.end();
            return;
          }
          
          await altPool.end();
        } catch (altError) {
          console.log(`❌ Error con URL alternativa: ${altError.message}`);
        }
      }
    }
  } finally {
    await pool.end();
  }
}

deleteTestAdmin();

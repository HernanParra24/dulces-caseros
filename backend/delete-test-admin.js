const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  connectionString: 'postgres://postgre:password123@dpg-d2jatmvdiees73c0ded0-a.oregon-postgres.render.com/dulces_caseros',
  ssl: { rejectUnauthorized: false }
});

async function deleteTestAdmin() {
  try {
    console.log('Conectando a la base de datos...');
    
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
    console.error('❌ Error al eliminar la cuenta de prueba:', error);
  } finally {
    await pool.end();
  }
}

deleteTestAdmin();

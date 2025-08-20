const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ConfigService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getSystemConfig() {
    const response = await fetch(`${API_BASE_URL}/config`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener configuración del sistema');
    }

    return await response.json();
  }

  async setMaintenanceMode(enabled: boolean) {
    const response = await fetch(`${API_BASE_URL}/config/maintenance`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ enabled }),
    });

    if (!response.ok) {
      throw new Error('Error al cambiar modo mantenimiento');
    }

    return await response.json();
  }

  async getMaintenanceMode() {
    const response = await fetch(`${API_BASE_URL}/config/maintenance`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener estado del modo mantenimiento');
    }

    return await response.json();
  }
}

export const configService = new ConfigService();

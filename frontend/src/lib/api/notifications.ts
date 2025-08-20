const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class NotificationsService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAllNotifications() {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones');
    }

    return await response.json();
  }

  async getUnreadNotifications() {
    const response = await fetch(`${API_BASE_URL}/notifications/unread`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones no leídas');
    }

    return await response.json();
  }

  async getNotificationStats() {
    const response = await fetch(`${API_BASE_URL}/notifications/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas de notificaciones');
    }

    return await response.json();
  }

  async markAsRead(id: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al marcar notificación como leída');
    }

    return await response.json();
  }

  async markAllAsRead() {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al marcar todas las notificaciones como leídas');
    }

    return await response.json();
  }

  async deleteNotification(id: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar notificación');
    }

    return await response.json();
  }
}

export const notificationsService = new NotificationsService();

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para renovar token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });

    const { token, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', newRefreshToken);
    
    return token;
  } catch (error) {
    // Si falla la renovación, limpiar tokens y redirigir al login
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw error;
  }
};

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores y renovar token automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (no autorizado) y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla la renovación, mostrar mensaje y redirigir
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        return Promise.reject(refreshError);
      }
    }

    // Solo mostrar toast para errores que no sean 400 (Bad Request)
    if (error.response?.status !== 400) {
      const message = error.response?.data?.message || 'Error en la solicitud';
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  sendVerificationEmail: async () => {
    const response = await api.post('/auth/send-verification-email');
    return response.data;
  },

  resetPassword: async (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  resendVerificationEmail: async (email: string) => {
    const response = await api.post('/auth/send-verification-email', { email });
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },
};

// Servicios de productos
export const productService = {
  getAll: async (filters?: any) => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  search: async (query: string) => {
    const response = await api.get('/products/search', { params: { q: query } });
    return response.data;
  },

  getByCategory: async (category: string) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },
};

// Servicios de productos próximamente
export const upcomingProductService = {
  getAll: async () => {
    const response = await api.get('/upcoming-products');
    return response.data;
  },

  getAllForAdmin: async () => {
    const response = await api.get('/upcoming-products/admin/all');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/upcoming-products/${id}`);
    return response.data;
  },

  create: async (productData: any) => {
    const response = await api.post('/upcoming-products', productData);
    return response.data;
  },

  update: async (id: string, productData: any) => {
    const response = await api.patch(`/upcoming-products/${id}`, productData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/upcoming-products/${id}`);
    return response.data;
  },

  toggleActive: async (id: string) => {
    const response = await api.patch(`/upcoming-products/${id}/toggle-active`);
    return response.data;
  },

  updateSortOrder: async (id: string, sortOrder: number) => {
    const response = await api.patch(`/upcoming-products/${id}/sort-order`, { sortOrder });
    return response.data;
  },
};

// Servicios de órdenes
export const orderService = {
  create: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getByOrderNumber: async (orderNumber: string) => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  updateStatus: async (id: string, statusData: { status: string }) => {
    const response = await api.patch(`/orders/${id}/status`, statusData);
    return response.data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: string, paymentId?: string) => {
    const response = await api.patch(`/orders/${id}/payment-status`, {
      paymentStatus,
      paymentId,
    });
    return response.data;
  },

  updatePaymentProof: async (id: string, paymentProof: string) => {
    const response = await api.patch(`/orders/${id}/payment-proof`, {
      paymentProof,
    });
    return response.data;
  },
};

// Servicios de usuarios
export const userService = {
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImage?: string;
  }) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },

  updateSettings: async (settings: any) => {
    const response = await api.patch('/users/settings', settings);
    return response.data;
  },
  getSettings: async () => {
    const response = await api.get('/users/settings');
    return response.data.settings;
  },
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await api.patch('/users/change-password', passwordData);
    return response.data;
  },
};

// Servicios de reseñas
export const reviewService = {
  getProductReviews: async (productId: string) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  createReview: async (data: { productId: string; rating: number; comment: string }) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  updateReview: async (reviewId: string, data: { rating: number; comment: string }) => {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  deleteReview: async (reviewId: string) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  getUserReview: async (productId: string) => {
    const response = await api.get(`/reviews/user/${productId}`);
    return response.data;
  },
};

export const favoriteService = {
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },
  addToFavorites: async (productId: string) => {
    const response = await api.post('/favorites', { productId });
    return response.data;
  },
  removeFromFavorites: async (productId: string) => {
    const response = await api.delete(`/favorites/${productId}`);
    return response.data;
  },
  removeFavoriteById: async (favoriteId: string) => {
    const response = await api.delete(`/favorites/id/${favoriteId}`);
    return response.data;
  },
  isFavorite: async (productId: string) => {
    const response = await api.get(`/favorites/${productId}/check`);
    return response.data;
  },
};

// Servicios de administración
export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // User Management
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id: string, role: 'user' | 'admin') => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  updateUserPassword: async (id: string, newPassword: string) => {
    const response = await api.put(`/admin/users/${id}/password`, { newPassword });
    return response.data;
  },

  updateUserEmail: async (id: string, newEmail: string) => {
    const response = await api.put(`/admin/users/${id}/email`, { newEmail });
    return response.data;
  },

  updateUserProfile: async (id: string, profileData: any) => {
    const response = await api.put(`/admin/users/${id}/profile`, profileData);
    return response.data;
  },

  resetUserEmailVerification: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/reset-email-verification`);
    return response.data;
  },

  getUserStats: async (id: string) => {
    const response = await api.get(`/admin/users/${id}/stats`);
    return response.data;
  },

  // Product Management
  getAllProducts: async () => {
    const response = await api.get('/admin/products');
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Order Management
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  updateOrderPaymentStatus: async (id: string, paymentStatus: string) => {
    const response = await api.patch(`/admin/orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  },

  deleteOrder: async (id: string) => {
    const response = await api.delete(`/admin/orders/${id}`);
    return response.data;
  },

  // Stock Management
  checkLowStock: async () => {
    const response = await api.post('/products/check-low-stock');
    return response.data;
  },

  // Email Management
  getAllUserEmails: async () => {
    const response = await api.get('/admin/emails/users');
    return response.data;
  },

  sendNewsletterToAllUsers: async (subject: string, content: string) => {
    const response = await api.post('/admin/emails/newsletter/all', { subject, content });
    return response.data;
  },

  sendNewsletterToSpecificUsers: async (emails: string[], subject: string, content: string) => {
    const response = await api.post('/admin/emails/newsletter/specific', { emails, subject, content });
    return response.data;
  },

  testEmailConnection: async () => {
    const response = await api.get('/admin/emails/test-connection');
    return response.data;
  },

  // Notification Preferences Management
  getUserNotificationPreferences: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}/notification-preferences`);
    return response.data;
  },

  getAllUsersNotificationPreferences: async () => {
    const response = await api.get('/admin/users/notification-preferences/all');
    return response.data;
  },

  getUsersByNotificationType: async (type: string) => {
    const response = await api.get(`/admin/users/notification-preferences/type/${type}`);
    return response.data;
  },

  // Review Management
  getAllReviews: async () => {
    const response = await api.get('/admin/reviews');
    return response.data;
  },

  deleteReview: async (id: string) => {
    const response = await api.delete(`/admin/reviews/${id}`);
    return response.data;
  },

  // Support Management
  getUsersNeedingSupport: async () => {
    const response = await api.get('/admin/support/users');
    return response.data;
  },
};

// Servicios de soporte
export const supportService = {
  createTicket: async (ticketData: any) => {
    const response = await api.post('/support', ticketData);
    return response.data;
  },

  createPublicTicket: async (ticketData: any) => {
    const response = await api.post('/support/public', ticketData);
    return response.data;
  },

  getMyTickets: async () => {
    const response = await api.get('/support/my-tickets');
    return response.data;
  },

  getTicketById: async (id: string) => {
    const response = await api.get(`/support/${id}`);
    return response.data;
  },

  updateTicket: async (id: string, ticketData: any) => {
    const response = await api.patch(`/support/${id}`, ticketData);
    return response.data;
  },

  deleteTicket: async (id: string) => {
    const response = await api.delete(`/support/${id}`);
    return response.data;
  },

  // Admin methods
  getAllTickets: async () => {
    const response = await api.get('/support');
    return response.data;
  },

  addAdminResponse: async (id: string, response: string) => {
    const apiResponse = await api.patch(`/support/${id}/admin-response`, { adminResponse: response });
    return apiResponse.data;
  },

  updateTicketStatus: async (id: string, status: string) => {
    const response = await api.patch(`/support/${id}/status`, { status });
    return response.data;
  },

  getTicketStats: async () => {
    const response = await api.get('/support/stats/overview');
    return response.data;
  },
};

// Servicios de contacto
export const contactService = {
  sendMessage: async (messageData: any) => {
    const response = await api.post('/contact', messageData);
    return response.data;
  },

  getMyMessages: async () => {
    const response = await api.get('/contact/my-messages');
    return response.data;
  },

  // Admin methods
  getAllMessages: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  getMessageById: async (id: string) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch(`/contact/${id}/read`);
    return response.data;
  },

  respond: async (id: string, respuesta: string) => {
    const response = await api.patch(`/contact/${id}/respond`, { respuesta });
    return response.data;
  },

  updateMessage: async (id: string, messageData: any) => {
    const response = await api.patch(`/contact/${id}`, messageData);
    return response.data;
  },

  deleteMessage: async (id: string) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/contact/stats');
    return response.data;
  },
};

// Servicios de notificaciones
export const notificationsService = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  getUnread: async () => {
    const response = await api.get('/notifications/unread');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/notifications/stats');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

// Servicios de configuración
export const configService = {
  getPublicConfig: async () => {
    const response = await api.get('/config/public');
    return response.data;
  },

  getSystemConfig: async () => {
    const response = await api.get('/config');
    return response.data;
  },

  updateSystemConfig: async (configData: any) => {
    const response = await api.put('/config', configData);
    return response.data;
  },

  setMaintenanceMode: async (enabled: boolean) => {
    const response = await api.post('/config/maintenance', { enabled });
    return response.data;
  },

  getMaintenanceMode: async () => {
    const response = await api.get('/config/maintenance');
    return response.data;
  },

  updateLogo: async (logoUrl: string) => {
    const response = await api.put('/config/logo', { logoUrl });
    return response.data;
  },

  getLogo: async () => {
    const response = await api.get('/config/logo');
    return response.data;
  },

  updateHeroImage: async (heroImageUrl: string) => {
    const response = await api.put('/config/hero-image', { heroImageUrl });
    return response.data;
  },

  getHeroImage: async () => {
    const response = await api.get('/config/hero-image');
    return response.data;
  },
};

// Servicios de reportes
export const reportsService = {
  getSalesReport: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get(`/reports/sales?${params.toString()}`);
    return response.data;
  },

  getInventoryReport: async () => {
    const response = await api.get('/reports/inventory');
    return response.data;
  },

  getCustomersReport: async () => {
    const response = await api.get('/reports/customers');
    return response.data;
  },

  getRevenueReport: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get(`/reports/revenue?${params.toString()}`);
    return response.data;
  },

  getGeneralReport: async () => {
    const response = await api.get('/reports/general');
    return response.data;
  },
};

import { toast } from 'react-hot-toast';

// Set para rastrear notificaciones activas
const activeNotifications = new Set<string>();

// Función para generar ID único para notificaciones
const generateNotificationId = (message: string, type: string, context?: string): string => {
  const base = context ? `${type}-${context}` : `${type}-${message}`;
  return `${base}-${Date.now()}`;
};

// Función para verificar si una notificación ya está activa
const isNotificationActive = (message: string, type: string, context?: string): boolean => {
  const baseId = context ? `${type}-${context}` : `${type}-${message}`;
  return activeNotifications.has(baseId);
};

// Función para agregar notificación al set de activas
const addActiveNotification = (message: string, type: string, context?: string): void => {
  const baseId = context ? `${type}-${context}` : `${type}-${message}`;
  activeNotifications.add(baseId);
  
  // Limpiar después de un tiempo
  setTimeout(() => {
    activeNotifications.delete(baseId);
  }, 3000);
};

// Función para mostrar toast de éxito
export const showSuccessToast = (message: string, context?: string): void => {
  if (isNotificationActive(message, 'success', context)) {
    return; // No mostrar duplicados
  }
  
  const notificationId = generateNotificationId(message, 'success', context);
  addActiveNotification(message, 'success', context);
  
  toast.success(message, {
    duration: 2500,
    id: notificationId,
  });
};

// Función para mostrar toast de error
export const showErrorToast = (message: string, context?: string): void => {
  if (isNotificationActive(message, 'error', context)) {
    return; // No mostrar duplicados
  }
  
  const notificationId = generateNotificationId(message, 'error', context);
  addActiveNotification(message, 'error', context);
  
  toast.error(message, {
    duration: 4000,
    id: notificationId,
  });
};

// Función para mostrar toast de carga
export const showLoadingToast = (message: string, context?: string): string => {
  const notificationId = generateNotificationId(message, 'loading', context);
  
  return toast.loading(message, {
    id: notificationId,
  });
};

// Función para actualizar toast de carga
export const updateLoadingToast = (toastId: string, message: string, type: 'success' | 'error'): void => {
  if (type === 'success') {
    toast.success(message, { id: toastId });
  } else {
    toast.error(message, { id: toastId });
  }
};

// Función para limpiar todas las notificaciones activas
export const clearActiveNotifications = (): void => {
  activeNotifications.clear();
};

// Función para mostrar toast con duración personalizada
export const showCustomToast = (
  message: string, 
  type: 'success' | 'error' | 'loading' = 'success', 
  duration?: number,
  context?: string
): string | void => {
  if (type === 'loading') {
    return showLoadingToast(message, context);
  }
  
  if (type === 'success') {
    showSuccessToast(message, context);
  } else {
    showErrorToast(message, context);
  }
};

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp.slice(-6)}-${random}`;
}

export function calculateShippingCost(subtotal: number): number {
  return subtotal >= 8000 ? 0 : 5000;
}

export function calculateTotal(subtotal: number): number {
  return subtotal + calculateShippingCost(subtotal);
}

export function getProductCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    chocolates: 'Chocolates',
    caramelos: 'Caramelos',
    galletas: 'Galletas',
    pasteles: 'Pasteles',
    bombones: 'Bombones',
    trufas: 'Trufas',
  };
  return labels[category] || category;
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
}

export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
  };
  return labels[status] || status;
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    mercado_pago: 'Mercado Pago',
    cash: 'Pago en Efectivo',
  };
  return labels[method] || method;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRandomImage(category: string): string {
  const images = {
    chocolates: 'https://images.unsplash.com/photo-1549007994-cb92beb7d96a?w=400&h=300&fit=crop',
    caramelos: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400&h=300&fit=crop',
    galletas: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
    pasteles: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    bombones: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop',
    trufas: 'https://images.unsplash.com/photo-1549007994-cb92beb7d96a?w=400&h=300&fit=crop',
  };
  return images[category as keyof typeof images] || images.chocolates;
}

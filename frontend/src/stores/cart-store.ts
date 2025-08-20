import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import { calculateShippingCost, calculateTotal } from '@/lib/utils';
import { toast } from 'react-hot-toast';

// Set para rastrear notificaciones activas
const activeNotifications = new Set<string>();

// Función para mostrar notificaciones con ID único para prevenir duplicados
const showNotification = (message: string, type: 'success' | 'error' = 'success', productId?: string) => {
  const baseId = productId ? `${type}-${productId}` : `${type}-${message}`;
  
  // Verificar si ya existe una notificación similar
  if (activeNotifications.has(baseId)) {
    return; // No mostrar duplicados
  }
  
  const notificationId = `${baseId}-${Date.now()}`;
  activeNotifications.add(baseId);
  
  // Limpiar el ID después de un tiempo
  setTimeout(() => {
    activeNotifications.delete(baseId);
  }, 2000);
  
  if (type === 'success') {
    toast.success(message, { 
      duration: 3000,
      id: notificationId
    });
  } else {
    toast.error(message, { 
      duration: 5000,
      id: notificationId
    });
  }
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (productId: string) => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stock) {
            showNotification(`Solo hay ${product.stock} unidades disponibles de ${product.name}`, 'error', product.id);
            return;
          }
          
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
          showNotification(`Cantidad actualizada: ${product.name}`, 'success', product.id);
        } else {
          if (quantity > product.stock) {
            showNotification(`Solo hay ${product.stock} unidades disponibles de ${product.name}`, 'error', product.id);
            return;
          }
          
          set({
            items: [...items, { product, quantity }],
          });
          showNotification(`${product.name} agregado al carrito`, 'success', product.id);
        }
      },

      removeItem: (productId: string) => {
        const { items } = get();
        const item = items.find(item => item.product.id === productId);
        
        set({
          items: items.filter(item => item.product.id !== productId),
        });
        
        if (item) {
          showNotification(`${item.product.name} removido del carrito`, 'success', productId);
        }
      },

      updateQuantity: (productId: string, quantity: number) => {
        const { items } = get();
        const item = items.find(item => item.product.id === productId);
        
        if (!item) return;

        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        if (quantity > item.product.stock) {
          showNotification(`Solo hay ${item.product.stock} unidades disponibles de ${item.product.name}`, 'error', productId);
          return;
        }

        set({
          items: items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
        showNotification('Carrito vaciado', 'success');
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getItemQuantity: (productId: string) => {
        const { items } = get();
        const item = items.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        return calculateShippingCost(subtotal);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return calculateTotal(subtotal);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

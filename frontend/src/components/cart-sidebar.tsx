'use client';

import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShippingCost,
    getTotal,
    clearCart,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Carrito de Compras</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-900 dark:text-gray-100" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Agrega algunos productos deliciosos para comenzar
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn btn-primary"
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <img
                        src={item.product.images?.[0] || '/images/default-product.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatPrice(item.product.price)}
                        </p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-900 dark:text-gray-100" />
                          </button>
                          <span className="w-8 text-center text-gray-900 dark:text-gray-100">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3 text-gray-900 dark:text-gray-100" />
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-900 dark:text-gray-100">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-900 dark:text-gray-100">
                    <span>Envío:</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                      {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Envío gratis en compras sobre $8.000
                    </p>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t border-gray-200 dark:border-gray-700 pt-2 text-gray-900 dark:text-gray-100">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="btn btn-primary w-full"
                  >
                    Finalizar Compra
                  </Link>
                  <button
                    onClick={clearCart}
                    className="btn btn-outline w-full"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

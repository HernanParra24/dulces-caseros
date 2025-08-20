'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { orderService } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  Eye
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface OrderHistoryProps {
  className?: string;
}

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: 'Pendiente',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: Clock,
    description: 'Tu pedido está siendo revisado'
  },
  [OrderStatus.CONFIRMED]: {
    label: 'Confirmado',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: CheckCircle,
    description: 'Tu pedido ha sido confirmado'
  },
  [OrderStatus.DELIVERED]: {
    label: 'Entregado',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    description: 'Tu pedido ha sido entregado'
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelado',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: XCircle,
    description: 'Tu pedido ha sido cancelado'
  }
};

export function OrderHistory({ className = '' }: OrderHistoryProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando pedidos para usuario:', user?.email);
      const data = await orderService.getMyOrders();
      console.log('📦 Datos recibidos del backend:', data);
      console.log('📋 Número de pedidos:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('📄 Primer pedido:', {
          id: data[0].id,
          orderNumber: data[0].orderNumber,
          itemsCount: data[0].items?.length || 0,
          items: data[0].items?.map(item => ({
            id: item.id,
            productName: item.productName,
            quantity: item.quantity
          }))
        });
      }
      setOrders(data || []);
    } catch (error) {
      console.error('❌ Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: OrderStatus) => {
    return statusConfig[status] || statusConfig[OrderStatus.PENDING];
  };

  const getStatusStep = (status: OrderStatus) => {
    const steps = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.DELIVERED
    ];
    return steps.indexOf(status) + 1;
  };

  if (!isAuthenticated) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Inicia sesión para ver tu historial de pedidos</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">No tienes pedidos aún</p>
        <p className="text-sm text-gray-400">¡Haz tu primer pedido para verlo aquí!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Mis Pedidos</h3>
        <span className="text-sm text-gray-500">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header del pedido */}
              <div className="bg-gray-50 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                    <div>
                      <p className="font-medium text-gray-900">Pedido #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido del pedido */}
              <div className="p-4">
                {/* Tracking visual */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso del pedido</span>
                    <span className="text-xs text-gray-500">{statusConfig.description}</span>
                  </div>
                  <div className="relative">
                    <div className="flex items-center">
                                             {[
                         { status: OrderStatus.PENDING, label: 'Pendiente' },
                         { status: OrderStatus.CONFIRMED, label: 'Confirmado' },
                         { status: OrderStatus.DELIVERED, label: 'Entregado' }
                       ].map((step, index) => {
                        const isCompleted = getStatusStep(order.status) > index;
                        const isCurrent = getStatusStep(order.status) === index + 1;
                        
                        return (
                          <div key={step.status} className="flex items-center flex-1">
                                                         <div className={`flex flex-col items-center ${index < 2 ? 'flex-1' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                isCompleted 
                                  ? 'bg-green-500 text-white' 
                                  : isCurrent 
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                              }`}>
                                {isCompleted ? '✓' : index + 1}
                              </div>
                              <span className={`text-xs mt-1 text-center ${
                                isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                                                         {index < 2 && (
                              <div className={`flex-1 h-0.5 mx-2 ${
                                isCompleted ? 'bg-green-500' : 'bg-gray-200'
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Información del pedido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Envío a: {order.shippingAddress}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Pago: {order.paymentMethod === 'mercado_pago' ? 'Mercado Pago' : 'Efectivo'}</span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Entrega estimada: {formatDate(order.estimatedDelivery)}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Envío:</span>
                      <span className="font-medium">{order.shippingCost === 0 ? 'Gratis' : formatPrice(order.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Productos del pedido */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Productos ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={item.productImage || '/placeholder-product.jpg'} 
                            alt={item.productName}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm">{item.productName}</p>
                            <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium text-sm">{formatPrice(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Factura disponible</span>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{selectedOrder?.id === order.id ? 'Ocultar detalles' : 'Ver detalles'}</span>
                  </button>
                </div>

                {/* Detalles expandibles */}
                <AnimatePresence>
                  {selectedOrder?.id === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t"
                    >
                      <div className="space-y-3">
                        {order.notes && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">Notas del pedido</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{order.notes}</p>
                          </div>
                        )}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Información adicional</h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>ID del pedido: {order.id}</p>
                            <p>Estado de pago: {order.paymentStatus}</p>
                            {order.deliveredAt && (
                              <p>Entregado el: {formatDate(order.deliveredAt)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


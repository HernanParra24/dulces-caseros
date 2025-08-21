'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { orderService } from '@/lib/api';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Package, 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Truck,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await orderService.getById(params.id as string);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case OrderStatus.CONFIRMED:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case OrderStatus.CANCELLED:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Pendiente';
      case OrderStatus.CONFIRMED:
        return 'Confirmado';
      case OrderStatus.DELIVERED:
        return 'Entregado';
      case OrderStatus.CANCELLED:
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'Pendiente';
      case PaymentStatus.PAID:
        return 'Pagado';
      case PaymentStatus.FAILED:
        return 'Fallido';
      case PaymentStatus.REFUNDED:
        return 'Reembolsado';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.MERCADO_PAGO:
        return 'Mercado Pago';
      case PaymentMethod.CASH:
        return 'Efectivo';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8">
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Cargando pedido...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8">
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pedido no encontrado</h3>
              <p className="text-gray-600 mb-4">El pedido que buscas no existe o no tienes permisos para verlo.</p>
              <button
                onClick={() => router.push('/')}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pedido #{order.orderNumber}</h1>
                <p className="text-gray-600 mt-2">Realizado el {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className="font-medium text-gray-900">{getStatusText(order.status)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Cliente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre</label>
                    <p className="text-gray-900">{order.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{order.customerEmail}</p>
                  </div>
                  {order.customerPhone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Teléfono</label>
                      <p className="text-gray-900">{order.customerPhone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Método de Pago</label>
                    <p className="text-gray-900">{getPaymentMethodText(order.paymentMethod)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600">Dirección de Envío</label>
                  <p className="text-gray-900">{order.shippingAddress}</p>
                </div>
                {order.billingAddress && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Dirección de Facturación</label>
                    <p className="text-gray-900">{order.billingAddress}</p>
                  </div>
                )}
                {order.notes && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Notas</label>
                    <p className="text-gray-900">{order.notes}</p>
                  </div>
                )}
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.productName}</h3>
                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Precio unitario: {formatPrice(item.unitPrice)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatPrice(item.totalPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Payment Proof */}
              {order.paymentProof && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Comprobante de Pago</h2>
                  <img
                    src={order.paymentProof}
                    alt="Comprobante de pago"
                    className="w-full max-w-md rounded-lg border"
                  />
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-6 sticky top-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span className={order.shippingCost === 0 ? 'text-green-600' : ''}>
                      {order.shippingCost === 0 ? 'Gratis' : formatPrice(order.shippingCost)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total:</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Estado del Pedido:</span>
                    <span className="text-sm font-medium text-gray-900">{getStatusText(order.status)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Estado del Pago:</span>
                    <span className={`text-sm font-medium ${
                      order.paymentStatus === PaymentStatus.PAID ? 'text-green-600' : 
                      order.paymentStatus === PaymentStatus.FAILED ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </div>
                  {order.paymentId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">ID de Pago:</span>
                      <span className="text-sm text-gray-900">{order.paymentId}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


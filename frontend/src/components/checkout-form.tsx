'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { orderService } from '@/lib/api';
import { PaymentMethod, PaymentStatus } from '@/types';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  CreditCard, 
  DollarSign, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: PaymentMethod;
  notes: string;
  paymentProof: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, getSubtotal, getShippingCost, getTotal, clearCart } = useCartStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    customerEmail: user?.email || '',
    customerPhone: '',
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: PaymentMethod.MERCADO_PAGO,
    notes: '',
    paymentProof: '',
  });

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const total = getTotal();

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // En un entorno real, aquí subirías el archivo a un servicio como Cloudinary
      // Por ahora, simulamos la subida
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, paymentProof: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para realizar el pedido');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await orderService.create(orderData);
      
      toast.success('¡Pedido creado exitosamente!');
      clearCart();
      router.push(`/pedido/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al crear el pedido. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Carrito vacío</h3>
        <p className="text-gray-600 mb-4">Agrega productos al carrito para continuar</p>
        <button
          onClick={() => router.push('/')}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          Ver productos
        </button>
      </div>
    );
  }

  return (
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
        <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
        <p className="text-gray-600 mt-2">Completa los datos para procesar tu pedido</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección de envío *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.shippingAddress}
                    onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Calle, número, comuna, ciudad..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección de facturación
                  </label>
                  <textarea
                    rows={3}
                    value={formData.billingAddress}
                    onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Opcional, si es diferente a la dirección de envío"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas adicionales
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Instrucciones especiales de entrega..."
                  />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Continuar
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold text-gray-900">Método de Pago</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={PaymentMethod.MERCADO_PAGO}
                      checked={formData.paymentMethod === PaymentMethod.MERCADO_PAGO}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium">Mercado Pago</div>
                        <div className="text-sm text-gray-600">Pago seguro con tarjeta o efectivo</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={PaymentMethod.CASH}
                      checked={formData.paymentMethod === PaymentMethod.CASH}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium">Efectivo</div>
                        <div className="text-sm text-gray-600">Pago al recibir el pedido</div>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

                         {/* Step 3: Payment Proof */}
             {currentStep === 3 && (
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="space-y-4"
               >
                 <h2 className="text-xl font-semibold text-gray-900">
                   {formData.paymentMethod === PaymentMethod.MERCADO_PAGO ? 'Comprobante de Pago' : 'Confirmación de Pedido'}
                 </h2>
                 
                 {formData.paymentMethod === PaymentMethod.MERCADO_PAGO && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium text-blue-900 mb-3">Instrucciones para Mercado Pago</h3>
                        
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <h4 className="font-medium text-blue-900 mb-2">Datos de Pago:</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">CVU:</span>
                                <div className="flex items-center space-x-2">
                                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">0000003100031082147848</code>
                                                                     <button
                                     type="button"
                                     onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       navigator.clipboard.writeText('0000003100031082147848');
                                       toast.success('CVU copiado al portapapeles');
                                     }}
                                     className="text-blue-600 hover:text-blue-800 text-sm"
                                   >
                                     Copiar
                                   </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Alias:</span>
                                <div className="flex items-center space-x-2">
                                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">mauri024.karo</code>
                                                                     <button
                                     type="button"
                                     onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       navigator.clipboard.writeText('mauri024.karo');
                                       toast.success('Alias copiado al portapapeles');
                                     }}
                                     className="text-blue-600 hover:text-blue-800 text-sm"
                                   >
                                     Copiar
                                   </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <h4 className="font-medium text-yellow-900 mb-2">Pasos a seguir:</h4>
                            <ol className="text-sm text-yellow-800 space-y-1">
                              <li>1. Abre tu aplicación de Mercado Pago</li>
                              <li>2. Selecciona "Enviar dinero" o "Transferir"</li>
                              <li>3. Ingresa el CVU o Alias proporcionado</li>
                              <li>4. Confirma que el destinatario sea "Dulces Caseros"</li>
                              <li>5. Ingresa el monto: <strong>{formatPrice(total)}</strong></li>
                              <li>6. Completa la transferencia</li>
                              <li>7. Toma una captura de pantalla del comprobante</li>
                              <li>8. Sube la imagen aquí para confirmar tu pago</li>
                            </ol>
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                              <p className="text-sm text-green-800">
                                <strong>Importante:</strong> Una vez que subas el comprobante, tu pedido será procesado y recibirás una confirmación por email.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                                     </div>
                 )}

                 {formData.paymentMethod === PaymentMethod.CASH && (
                   <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                     <div className="flex items-start">
                       <DollarSign className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                       <div className="flex-1">
                         <h3 className="font-medium text-green-900 mb-3">Pago en Efectivo</h3>
                         
                         <div className="space-y-4">
                           <div className="bg-white rounded-lg p-4 border border-green-100">
                             <h4 className="font-medium text-green-900 mb-2">Información importante:</h4>
                             <ul className="text-sm text-green-800 space-y-2">
                               <li>• El pago se realizará al momento de recibir tu pedido</li>
                               <li>• El monto a pagar será: <strong>{formatPrice(total)}</strong></li>
                               <li>• Asegúrate de tener el dinero exacto disponible</li>
                               <li>• El pedido será procesado una vez confirmado el pago</li>
                             </ul>
                           </div>
                           
                           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                             <h4 className="font-medium text-yellow-900 mb-2">Proceso de entrega:</h4>
                             <ol className="text-sm text-yellow-800 space-y-1">
                               <li>1. Recibirás una confirmación de tu pedido por email</li>
                               <li>2. Te contactaremos para coordinar la entrega</li>
                               <li>3. Al momento de la entrega, pagarás en efectivo</li>
                               <li>4. Recibirás tu pedido una vez confirmado el pago</li>
                             </ol>
                           </div>
                           
                           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                             <div className="flex items-start">
                               <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                               <p className="text-sm text-blue-800">
                                 <strong>Nota:</strong> No es necesario subir ningún comprobante para pago en efectivo. El pago se realizará de forma presencial al recibir tu pedido.
                               </p>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 {formData.paymentMethod === PaymentMethod.MERCADO_PAGO && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Subir comprobante de pago
                     </label>
                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                       <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handlePaymentProofChange}
                         className="hidden"
                         id="payment-proof"
                       />
                       <label
                         htmlFor="payment-proof"
                         className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
                       >
                         Seleccionar imagen
                       </label>
                       <p className="text-sm text-gray-500 mt-1">
                         JPG, PNG o GIF hasta 5MB
                       </p>
                     </div>
                     {formData.paymentProof && (
                       <div className="mt-4">
                         <img
                           src={formData.paymentProof}
                           alt="Comprobante"
                           className="w-full max-w-md rounded-lg border"
                         />
                       </div>
                     )}
                   </div>
                 )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Atrás
                  </button>
                                     <button
                     type="submit"
                     disabled={isSubmitting || (formData.paymentMethod === PaymentMethod.MERCADO_PAGO && !formData.paymentProof)}
                     className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isSubmitting ? (
                       <div className="flex items-center justify-center">
                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                         Procesando...
                       </div>
                     ) : (
                       'Confirmar Pedido'
                     )}
                   </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.product.name}</div>
                    <div className="text-sm text-gray-600">Cantidad: {item.quantity}</div>
                  </div>
                  <div className="text-gray-900 font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío:</span>
                <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                  {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-gray-500">
                  Envío gratis en compras sobre $8.000
                </p>
              )}
              <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Copy, CreditCard, DollarSign, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function PaymentInfoPage() {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Información de Pago</h1>
          <p className="text-gray-600 mt-2">
            Datos para realizar pagos a través de Mercado Pago
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mercado Pago Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center mb-6">
              <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Mercado Pago</h2>
            </div>

            <div className="space-y-6">
              {/* CVU */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-3">CVU (Clave Virtual Uniforme)</h3>
                <div className="flex items-center justify-between">
                  <code className="bg-white px-3 py-2 rounded text-lg font-mono border">
                    0000003100031082147848
                  </code>
                  <button
                    onClick={() => handleCopy('0000003100031082147848', 'CVU')}
                    className="ml-3 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar
                  </button>
                </div>
              </div>

              {/* Alias */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-3">Alias</h3>
                <div className="flex items-center justify-between">
                  <code className="bg-white px-3 py-2 rounded text-lg font-mono border">
                    mauri024.karo
                  </code>
                  <button
                    onClick={() => handleCopy('mauri024.karo', 'Alias')}
                    className="ml-3 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-3">Cómo realizar el pago:</h3>
                <ol className="text-sm text-yellow-800 space-y-2">
                  <li>1. Abre tu aplicación de Mercado Pago</li>
                  <li>2. Selecciona "Enviar dinero" o "Transferir"</li>
                  <li>3. Ingresa el CVU o Alias proporcionado</li>
                  <li>4. Confirma que el destinatario sea "Dulces Caseros"</li>
                  <li>5. Ingresa el monto de tu pedido</li>
                  <li>6. Completa la transferencia</li>
                  <li>7. Guarda el comprobante de pago</li>
                </ol>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Security Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Pago Seguro</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Todas las transacciones son procesadas por Mercado Pago</p>
                <p>• Tus datos están protegidos con encriptación SSL</p>
                <p>• No almacenamos información de tarjetas</p>
                <p>• Recibirás confirmación por email</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Necesitas ayuda?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Si tienes problemas con el pago, contáctanos</p>
                <p>• WhatsApp: +54 9 11 1234-5678</p>
                <p>• Email: info@dulcescaseros.com</p>
                <p>• Horario: Lunes a Viernes 9:00 - 18:00</p>
              </div>
            </div>

            {/* Other Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Otros Métodos de Pago</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Efectivo:</strong> Pago al recibir el pedido</p>
                <p>• <strong>Transferencia bancaria:</strong> Consultar datos</p>
                <p>• <strong>Tarjeta de débito/crédito:</strong> En el local</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            ¿Listo para hacer tu pedido?
          </h3>
          <p className="text-orange-800 mb-4">
            Una vez que tengas los datos de pago, puedes proceder con tu compra
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Ver Productos
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

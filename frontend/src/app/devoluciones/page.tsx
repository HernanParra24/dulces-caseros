'use client';

import { BackButton } from '@/components/back-button';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Phone, Mail } from 'lucide-react';

export default function DevolucionesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <BackButton className="mb-6" />
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Política de Devoluciones
          </h1>
          
          <div className="space-y-8">
            {/* Política General */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <RefreshCw className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Nuestra Política
                </h2>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 leading-relaxed">
                  En Dulce Twilight nos comprometemos a ofrecer productos de la más alta calidad. 
                  Sin embargo, entendemos que pueden surgir situaciones donde necesites realizar 
                  una devolución. Nuestra política está diseñada para ser justa tanto para nuestros 
                  clientes como para nuestro negocio artesanal.
                </p>
              </div>
            </section>
            
            {/* Condiciones de Devolución */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Condiciones de Devolución
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-green-800">
                      Aceptamos Devoluciones
                    </h3>
                  </div>
                  <ul className="text-green-700 space-y-2 text-sm">
                    <li>• Productos con defectos de fabricación</li>
                    <li>• Errores en el pedido (producto incorrecto)</li>
                    <li>• Productos en mal estado al momento de la entrega</li>
                    <li>• Alergias no comunicadas previamente</li>
                    <li>• Cancelación antes de la preparación</li>
                  </ul>
                </div>
                
                <div className="border border-red-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold text-red-800">
                      No Aceptamos Devoluciones
                    </h3>
                  </div>
                  <ul className="text-red-700 space-y-2 text-sm">
                    <li>• Cambio de opinión sobre el sabor</li>
                    <li>• Productos ya consumidos</li>
                    <li>• Productos no refrigerados correctamente</li>
                    <li>• Cancelación después de iniciada la preparación</li>
                    <li>• Productos personalizados ya elaborados</li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Proceso de Devolución */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Proceso de Devolución
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Contacto Inmediato
                    </h3>
                    <p className="text-gray-600">
                      Comunícate con nosotros dentro de las primeras 24 horas después de recibir 
                      el producto. Puedes contactarnos por WhatsApp, teléfono o email.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Evaluación del Caso
                    </h3>
                    <p className="text-gray-600">
                      Evaluaremos tu solicitud de devolución considerando las circunstancias 
                      específicas y nuestras políticas. Te responderemos en el menor tiempo posible.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Resolución
                    </h3>
                    <p className="text-gray-600">
                      Si la devolución es aprobada, te ofreceremos las siguientes opciones: 
                      reembolso, reemplazo del producto, o crédito para futuras compras.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Tiempos y Condiciones */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Tiempos y Condiciones
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500 mb-2">24h</div>
                  <h3 className="font-medium text-gray-900 mb-2">Notificación</h3>
                  <p className="text-gray-600 text-sm">
                    Tiempo máximo para reportar un problema
                  </p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500 mb-2">48h</div>
                  <h3 className="font-medium text-gray-900 mb-2">Evaluación</h3>
                  <p className="text-gray-600 text-sm">
                    Tiempo para evaluar y responder tu solicitud
                  </p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500 mb-2">3-5 días</div>
                  <h3 className="font-medium text-gray-900 mb-2">Resolución</h3>
                  <p className="text-gray-600 text-sm">
                    Tiempo para completar la devolución o reemplazo
                  </p>
                </div>
              </div>
            </section>
            
            {/* Información Importante */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Información Importante
                </h2>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <ul className="text-yellow-800 space-y-3">
                  <li className="flex items-start space-x-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Productos personalizados:</strong> No se pueden devolver una vez 
                      iniciada la elaboración, ya que están hechos específicamente para ti.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Conservación:</strong> Es responsabilidad del cliente mantener 
                      los productos refrigerados según las instrucciones proporcionadas. 
                      Los productos se mantienen sin abrir aproximadamente 1 año, y una vez 
                      abiertos y refrigerados aproximadamente 1 mes y medio.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Alergias:</strong> Es fundamental comunicar cualquier alergia 
                      al momento de realizar el pedido.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold">•</span>
                    <span>
                      <strong>Reembolsos:</strong> Los reembolsos se procesarán en el mismo 
                      método de pago utilizado originalmente.
                    </span>
                  </li>
                </ul>
              </div>
            </section>
            
            {/* Contacto para Devoluciones */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Contacto para Devoluciones
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Teléfono</h3>
                    <p className="text-gray-600">+54 261 563-2310</p>
                    <p className="text-sm text-gray-500">Lunes a Domingo 9:00-20:00</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">dulcetwilightdc2609@gmail.com</p>
                    <p className="text-sm text-gray-500">Respuesta en 24-48 horas</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-700 text-sm">
                  <strong>Nota:</strong> Para agilizar el proceso de devolución, por favor 
                  ten a mano el número de pedido, fecha de entrega y descripción detallada 
                  del problema.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

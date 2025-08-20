'use client';

import { BackButton } from '@/components/back-button';
import { Truck, MapPin, Clock, Package, Phone, Mail } from 'lucide-react';

export default function EnviosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <BackButton className="mb-6" />
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Envíos y Entregas
          </h1>
          
          <div className="space-y-8">
            {/* Zonas de Entrega */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Zonas de Entrega
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-800 mb-3">
                    🟢 Entrega Gratuita
                  </h3>
                  <ul className="text-green-700 space-y-2">
                    <li>• Lavalle Costa de Araujo (centro)</li>
                    <li>• Zona céntrica de Lavalle</li>
                    <li>• Pedidos superiores a $8,000</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="font-semibold text-orange-800 mb-3">
                    🟡 Entrega con Cargo
                  </h3>
                  <ul className="text-orange-700 space-y-2">
                    <li>• Zonas periféricas de Lavalle</li>
                    <li>• Localidades cercanas</li>
                    <li>• Pedidos menores a $8,000</li>
                    <li>• Cargo de $5,000 por envío</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Nota:</strong> Para entregas fuera de estas zonas, consultanos 
                  la disponibilidad y el costo adicional. También ofrecemos puntos de 
                  encuentro para mayor comodidad.
                </p>
              </div>
            </section>
            
            {/* Tiempos de Entrega */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Tiempos de Entrega
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500 mb-2">24-48h</div>
                  <h3 className="font-medium text-gray-900 mb-2">Pedidos Estándar</h3>
                  <p className="text-gray-600 text-sm">
                    Dulces regulares y pedidos pequeños
                  </p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500 mb-2">3-5 días</div>
                  <h3 className="font-medium text-gray-900 mb-2">Pedidos Grandes</h3>
                  <p className="text-gray-600 text-sm">
                    Grandes cantidades y pedidos especiales
                  </p>
                </div>
              </div>
            </section>
            
            {/* Proceso de Entrega */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Truck className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Proceso de Entrega
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Confirmación del Pedido
                    </h3>
                    <p className="text-gray-600">
                      Una vez realizado el pedido, te confirmaremos la fecha y hora de entrega 
                      por WhatsApp o teléfono.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Preparación y Empaque
                    </h3>
                    <p className="text-gray-600">
                      Los dulces se preparan frescos y se empacan cuidadosamente para 
                      mantener su calidad durante el transporte.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Entrega a Domicilio
                    </h3>
                    <p className="text-gray-600">
                      Realizamos la entrega en la dirección especificada, en el horario 
                      acordado. Puedes pagar en efectivo al momento de la entrega.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Cuidado de los Productos */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Package className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Cuidado de los Productos
                </h2>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-800 mb-3">
                  Recomendaciones de Conservación
                </h3>
                <ul className="text-yellow-700 space-y-2">
                  <li>• Mantener refrigerado entre 2°C y 8°C</li>
                  <li>• <strong>Sin abrir:</strong> Se mantiene aproximadamente 1 año</li>
                  <li>• <strong>Una vez abierto y refrigerado:</strong> Aproximadamente 1 mes y medio</li>
                  <li>• Evitar exposición directa al sol</li>
                  <li>• No congelar (puede afectar la textura)</li>
                  <li>• Mantener en su empaque original hasta el consumo</li>
                </ul>
              </div>
            </section>
            
            {/* Información de Contacto */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                ¿Necesitas Ayuda con tu Entrega?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Teléfono</h3>
                    <p className="text-gray-600">+54 261 563-2310</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">dulcetwilightdc2609@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-700 text-sm">
                  <strong>Importante:</strong> Si necesitas modificar la dirección de entrega 
                  o la fecha/hora, contáctanos con al menos 24 horas de anticipación. 
                  Para cambios de última hora, consultanos la disponibilidad.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

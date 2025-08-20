'use client';

import { useState } from 'react';
import { Shield, Users, Package, ShoppingCart, Star, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';

export function AdminInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: 'Acceso Seguro',
      description: 'Solo usuarios con rol de administrador pueden acceder al panel',
      status: 'active'
    },
    {
      icon: Users,
      title: 'Gestión de Usuarios',
      description: 'Ver, editar y gestionar todos los usuarios registrados',
      status: 'active'
    },
    {
      icon: Package,
      title: 'Gestión de Productos',
      description: 'Agregar, editar y eliminar productos del catálogo',
      status: 'active'
    },
    {
      icon: ShoppingCart,
      title: 'Control de Pedidos',
      description: 'Gestionar estados de pedidos y confirmar entregas',
      status: 'active'
    },
    {
      icon: Star,
      title: 'Gestión de Reseñas',
      description: 'Moderar y gestionar las reseñas de productos',
      status: 'active'
    },
    {
      icon: HelpCircle,
      title: 'Soporte Técnico',
      description: 'Identificar y ayudar a usuarios que necesitan soporte',
      status: 'active'
    }
  ];

  const credentials = [
    {
      email: 'parrahernan94@gmail.com',
      password: 'admin123',
      role: 'Administrador',
      description: 'Acceso completo al panel de administración'
    },
    {
      email: 'montenegroh0426@gmail.com',
      password: 'user123',
      role: 'Usuario',
      description: 'Acceso normal a la tienda (sin panel de admin)'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">Panel de Administración</h2>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          {isOpen ? 'Ocultar detalles' : 'Ver detalles'}
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        El panel de administración está completamente funcional y permite gestionar todos los aspectos del negocio de forma profesional y segura.
      </p>

      {isOpen && (
        <div className="space-y-6">
          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Funcionalidades Implementadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Credentials */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Credenciales de Prueba</h3>
            <div className="space-y-4">
              {credentials.map((credential, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{credential.role}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      credential.role === 'Administrador' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {credential.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{credential.description}</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Email:</span> {credential.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Contraseña:</span> {credential.password}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900 mb-2">Instrucciones de Uso</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Inicia sesión con las credenciales de administrador</li>
                  <li>• Accede al panel desde el enlace "Admin" en el header</li>
                  <li>• Navega por las diferentes secciones del dashboard</li>
                  <li>• Gestiona usuarios, productos, pedidos y reseñas</li>
                  <li>• Los nuevos usuarios registrados tendrán rol "Usuario" por defecto</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

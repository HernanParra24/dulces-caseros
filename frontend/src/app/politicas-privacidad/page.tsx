'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';

export default function PoliticasPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Políticas de Privacidad
            </h1>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  1. Información que Recopilamos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, 
                  realizas un pedido o te comunicas con nosotros. Esta información puede incluir:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 ml-4">
                  <li>Nombre y apellidos</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Información de pedidos y preferencias</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  2. Cómo Utilizamos tu Información
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Utilizamos la información que recopilamos para:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 ml-4">
                  <li>Procesar y gestionar tus pedidos</li>
                  <li>Comunicarnos contigo sobre tu cuenta y pedidos</li>
                  <li>Enviar información sobre productos y ofertas especiales</li>
                  <li>Mejorar nuestros servicios y experiencia del usuario</li>
                  <li>Cumplir con obligaciones legales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  3. Compartir Información
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No vendemos, alquilamos ni compartimos tu información personal con terceros, 
                  excepto en las siguientes circunstancias:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 ml-4">
                  <li>Con tu consentimiento explícito</li>
                  <li>Para cumplir con obligaciones legales</li>
                  <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  4. Seguridad de Datos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Implementamos medidas de seguridad técnicas y organizativas apropiadas para 
                  proteger tu información personal contra acceso no autorizado, alteración, 
                  divulgación o destrucción.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  5. Tus Derechos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Tienes derecho a:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 ml-4">
                  <li>Acceder a tu información personal</li>
                  <li>Corregir información inexacta</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Retirar tu consentimiento en cualquier momento</li>
                  <li>Oponerte al procesamiento de tus datos</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  6. Contacto
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Si tienes preguntas sobre estas políticas de privacidad o sobre el tratamiento 
                  de tus datos personales, puedes contactarnos a través de:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 ml-4">
                  <li>Email: privacidad@dulcescaseros.com</li>
                  <li>Teléfono: +56 9 XXXX XXXX</li>
                  <li>Formulario de contacto en nuestra página web</li>
                </ul>
              </section>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

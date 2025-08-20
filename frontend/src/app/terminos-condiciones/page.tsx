'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';

export default function TerminosCondicionesPage() {
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
              Términos y Condiciones
            </h1>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  1. Aceptación de los Términos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Al acceder y utilizar nuestro sitio web y servicios, aceptas estar sujeto a estos 
                  términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, 
                  no debes utilizar nuestros servicios.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  2. Descripción del Servicio
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Dulces Caseros es una tienda en línea especializada en la venta de dulces artesanales 
                  y productos de repostería. Nuestros servicios incluyen:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 ml-4">
                  <li>Venta de productos de dulces artesanales</li>
                  <li>Gestión de pedidos y entregas</li>
                  <li>Atención al cliente y soporte</li>
                  <li>Información sobre productos y recetas</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  3. Cuenta de Usuario
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Para realizar pedidos, debes crear una cuenta proporcionando información precisa y actualizada. 
                  Eres responsable de:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 ml-4">
                  <li>Mantener la confidencialidad de tu contraseña</li>
                  <li>Todas las actividades que ocurran bajo tu cuenta</li>
                  <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
                  <li>Verificar tu dirección de email para activar tu cuenta</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  4. Pedidos y Pagos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Al realizar un pedido, aceptas que:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 ml-4">
                  <li>Toda la información proporcionada es precisa y completa</li>
                  <li>Tienes autorización para realizar el pago</li>
                  <li>Aceptas los precios y condiciones de entrega</li>
                  <li>Los pedidos están sujetos a disponibilidad de productos</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  <strong>Métodos de pago aceptados:</strong> Transferencia por Mercado Pago y pago en efectivo al momento de la entrega.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  5. Entregas
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Nos esforzamos por entregar tus pedidos en el tiempo estimado, pero no garantizamos 
                  fechas específicas de entrega. Factores como el clima, tráfico o eventos especiales 
                  pueden afectar los tiempos de entrega.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  6. Cancelaciones y Devoluciones
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Los pedidos pueden cancelarse hasta 24 horas antes de la fecha de entrega programada. 
                  No se aceptan devoluciones de productos alimenticios por razones de seguridad e higiene, 
                  excepto en casos de productos defectuosos o incorrectos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  7. Propiedad Intelectual
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Todo el contenido de nuestro sitio web, incluyendo textos, imágenes, logos y diseño, 
                  está protegido por derechos de autor y otras leyes de propiedad intelectual. 
                  No está permitido copiar, distribuir o modificar este contenido sin autorización.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  8. Limitación de Responsabilidad
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  En ningún caso seremos responsables por daños indirectos, incidentales o consecuentes 
                  que resulten del uso de nuestros servicios, incluyendo pero no limitado a pérdida de 
                  beneficios, datos o uso.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  9. Modificaciones
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                  Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. 
                  Es tu responsabilidad revisar periódicamente estos términos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  10. Contacto
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos a través de:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 ml-4">
                  <li>Email: legal@dulcescaseros.com</li>
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

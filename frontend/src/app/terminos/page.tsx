import type { Metadata } from 'next';
import { BackButton } from '@/components/back-button';

export const metadata: Metadata = {
  title: 'Términos y Condiciones - Dulce Twilight',
  description: 'Términos y condiciones de uso de Dulce Twilight',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Términos y Condiciones</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última actualización:</strong> 18 de agosto de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
              <p className="text-gray-700 mb-4">
                Al acceder y utilizar el sitio web de Dulce Twilight, usted acepta estar sujeto a estos términos y condiciones de uso. 
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descripción del Servicio</h2>
              <p className="text-gray-700 mb-4">
                Dulce Twilight es una tienda online especializada en la venta de dulces artesanales. 
                Ofrecemos productos elaborados con ingredientes naturales y técnicas tradicionales.
              </p>
              <p className="text-gray-700 mb-4">
                Nuestro sitio web incluye las siguientes funcionalidades:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Registro y gestión de cuentas de usuario</li>
                <li>Catálogo de productos con búsqueda y filtros</li>
                <li>Carrito de compras y sistema de favoritos</li>
                <li>Proceso de compra con múltiples métodos de pago</li>
                <li>Sistema de reseñas y calificaciones</li>
                <li>Soporte al cliente y tickets de ayuda</li>
                <li>Newsletter y notificaciones por email</li>
                <li>Panel de administración para gestión del negocio</li>
                <li>Verificación opcional de email</li>
                <li>Sistema de notificaciones de stock bajo</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Registro de Usuario</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Para realizar compras, debe crear una cuenta con información veraz y actualizada.</li>
                <li>Es responsable de mantener la confidencialidad de su contraseña.</li>
                <li>La verificación de email es opcional y no afecta la funcionalidad básica.</li>
                <li>Puede gestionar sus preferencias de notificaciones desde su perfil.</li>
                <li>Puede eliminar su cuenta en cualquier momento desde la configuración.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Productos y Catálogo</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Los productos se muestran con imágenes, descripciones y precios actualizados.</li>
                <li>La disponibilidad de stock se actualiza en tiempo real.</li>
                <li>Puede agregar productos a favoritos para acceso rápido.</li>
                <li>Los productos pueden ser calificados y reseñados por usuarios.</li>
                <li>Nos reservamos el derecho de modificar precios y disponibilidad sin previo aviso.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Pedidos y Pagos</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Los precios están expresados en pesos argentinos y no incluyen IVA.</li>
                <li>Los pedidos se procesan una vez confirmado el pago.</li>
                <li>Aceptamos pagos únicamente a través de Mercado Pago y en efectivo.</li>
                <li>Para pagos en efectivo, el pago se realiza al momento de la entrega.</li>
                <li>Para pagos a través de Mercado Pago, se debe completar la transacción antes de la entrega.</li>
                <li>Nos reservamos el derecho de cancelar pedidos en caso de errores en precios o disponibilidad.</li>
                <li>Puede realizar seguimiento de sus pedidos desde su perfil de usuario.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Envíos y Entregas</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Realizamos envíos a toda la provincia de Mendoza.</li>
                <li>Los tiempos de entrega varían según la ubicación (1-3 días hábiles).</li>
                <li>Envío gratis en compras superiores a $8.000.</li>
                <li>Los productos se entregan en perfectas condiciones de conservación.</li>
                <li>Recibirá notificaciones sobre el estado de su pedido si tiene habilitadas las notificaciones.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Reseñas y Calificaciones</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Puede dejar reseñas y calificaciones de productos que haya comprado.</li>
                <li>Las reseñas deben ser objetivas y respetuosas.</li>
                <li>Nos reservamos el derecho de moderar y eliminar reseñas inapropiadas.</li>
                <li>Las reseñas ayudan a otros usuarios a tomar decisiones de compra.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Soporte al Cliente</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Ofrecemos sistema de tickets de soporte para resolver consultas.</li>
                <li>Puede crear tickets desde su perfil o desde la página de soporte.</li>
                <li>Respondemos a las consultas en un plazo máximo de 24 horas.</li>
                <li>También puede contactarnos a través del formulario de contacto.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Notificaciones y Newsletter</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Puede configurar sus preferencias de notificaciones por email.</li>
                <li>Los tipos de notificaciones incluyen: newsletter, estado de pedidos, promociones y actualizaciones importantes.</li>
                <li>Puede cancelar las notificaciones en cualquier momento desde su perfil.</li>
                <li>El newsletter incluye ofertas especiales y novedades de productos.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Política de Devoluciones</h2>
              <p className="text-gray-700 mb-4">
                Aceptamos devoluciones dentro de las 24 horas posteriores a la entrega, siempre que el producto 
                mantenga su empaque original y no haya sido consumido. Los gastos de devolución corren por cuenta del cliente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Privacidad y Datos Personales</h2>
              <p className="text-gray-700 mb-4">
                Sus datos personales serán tratados de acuerdo con nuestra Política de Privacidad. 
                No compartimos información personal con terceros sin su consentimiento.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Recopilamos información necesaria para procesar pedidos y mejorar el servicio.</li>
                <li>Puede gestionar sus preferencias de privacidad desde su perfil.</li>
                <li>Utilizamos cookies para mejorar la experiencia de navegación.</li>
                <li>Sus datos están protegidos con medidas de seguridad apropiadas.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Propiedad Intelectual</h2>
              <p className="text-gray-700 mb-4">
                Todo el contenido de este sitio web, incluyendo textos, imágenes, logos y diseño, 
                es propiedad de Dulce Twilight y está protegido por las leyes de propiedad intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Limitación de Responsabilidad</h2>
              <p className="text-gray-700 mb-4">
                Dulce Twilight no se hace responsable por daños indirectos, incidentales o consecuentes 
                que puedan resultar del uso de nuestros productos o servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Modificaciones</h2>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Para cualquier consulta sobre estos términos y condiciones, puede contactarnos a través de:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Email: dulcetwilightdc@gmail.com</li>
                <li>Formulario de contacto en nuestro sitio web</li>
                <li>Sistema de tickets de soporte</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

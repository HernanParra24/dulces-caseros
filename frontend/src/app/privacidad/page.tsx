import type { Metadata } from 'next';
import { BackButton } from '@/components/back-button';

export const metadata: Metadata = {
  title: 'Política de Privacidad - Dulce Twilight',
  description: 'Política de privacidad y protección de datos de Dulce Twilight',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidad</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última actualización:</strong> 18 de agosto de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Información que Recopilamos</h2>
              <p className="text-gray-700 mb-4">
                Recopilamos la siguiente información cuando utiliza nuestro sitio web:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Información personal:</strong> Nombre, apellido, dirección de email, teléfono y dirección de entrega.</li>
                <li><strong>Información de cuenta:</strong> Contraseña (encriptada), preferencias de notificaciones, configuración de privacidad.</li>
                <li><strong>Información de pedidos:</strong> Historial de compras, productos adquiridos, direcciones de entrega y preferencias.</li>
                <li><strong>Información de interacción:</strong> Productos favoritos, reseñas y calificaciones, tickets de soporte.</li>
                <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, páginas visitadas, tiempo de navegación y cookies.</li>
                <li><strong>Información de verificación:</strong> Estado de verificación de email (opcional).</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Cómo Utilizamos su Información</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos su información para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Crear y gestionar su cuenta de usuario</li>
                <li>Procesar y entregar sus pedidos</li>
                <li>Comunicarnos con usted sobre su cuenta y pedidos</li>
                <li>Enviar notificaciones según sus preferencias (newsletter, promociones, actualizaciones)</li>
                <li>Gestionar el sistema de reseñas y calificaciones</li>
                <li>Proporcionar soporte al cliente a través de tickets</li>
                <li>Mejorar nuestros productos y servicios</li>
                <li>Analizar el uso del sitio web para optimizar la experiencia</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
                <li>Gestionar el sistema de favoritos y preferencias</li>
                <li>Enviar notificaciones de stock bajo a administradores</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Preferencias de Notificaciones</h2>
              <p className="text-gray-700 mb-4">
                Usted puede controlar qué tipos de notificaciones recibe:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Newsletter y novedades:</strong> Ofertas especiales y actualizaciones de productos</li>
                <li><strong>Estado de pedidos:</strong> Notificaciones sobre el progreso de sus compras</li>
                <li><strong>Promociones y descuentos:</strong> Ofertas exclusivas y cupones de descuento</li>
                <li><strong>Actualizaciones importantes:</strong> Cambios en políticas, términos y condiciones</li>
                <li>Puede modificar estas preferencias en cualquier momento desde su perfil</li>
                <li>Los administradores pueden ver sus preferencias para enviar comunicaciones apropiadas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Compartir Información</h2>
              <p className="text-gray-700 mb-4">
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Con proveedores de servicios de entrega para completar su pedido</li>
                <li>Con Mercado Pago para procesar transacciones de pago</li>
                <li>Con administradores del sistema para gestionar el negocio y enviar comunicaciones</li>
                <li>Cuando sea requerido por ley o para proteger nuestros derechos</li>
                <li>Con su consentimiento explícito</li>
                <li>Para análisis internos y mejora del servicio (datos anonimizados)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Seguridad de Datos</h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encriptación SSL para transmisiones seguras</li>
                <li>Encriptación de contraseñas con bcrypt</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo regular de sistemas de seguridad</li>
                <li>Actualizaciones regulares de software de seguridad</li>
                <li>Autenticación JWT para sesiones seguras</li>
                <li>Validación de datos en frontend y backend</li>
                <li>Backups regulares de la base de datos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies y Tecnologías Similares</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Recordar sus preferencias y configuraciones</li>
                <li>Mantener su sesión activa</li>
                <li>Analizar el uso del sitio web</li>
                <li>Mejorar la funcionalidad del sitio</li>
                <li>Proporcionar contenido personalizado</li>
                <li>Gestionar el carrito de compras</li>
                <li>Recordar productos favoritos</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Verificación de Email</h2>
              <p className="text-gray-700 mb-4">
                Ofrecemos verificación opcional de email:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>La verificación de email es completamente opcional</li>
                <li>No afecta la funcionalidad básica de su cuenta</li>
                <li>Puede solicitar verificación en cualquier momento desde su perfil</li>
                <li>Los tokens de verificación expiran después de 24 horas</li>
                <li>Utilizamos Gmail SMTP para enviar emails de verificación</li>
                <li>Puede cancelar la verificación en cualquier momento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Sus Derechos</h2>
              <p className="text-gray-700 mb-4">
                Usted tiene los siguientes derechos respecto a su información personal:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Acceso:</strong> Solicitar una copia de su información personal</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de su cuenta y datos</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
                <li><strong>Limitación:</strong> Restringir el procesamiento de sus datos</li>
                <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
                <li><strong>Control de notificaciones:</strong> Gestionar preferencias de email</li>
                <li><strong>Acceso a su perfil:</strong> Ver y modificar su información desde su cuenta</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Retención de Datos</h2>
              <p className="text-gray-700 mb-4">
                Conservamos su información personal durante el tiempo necesario para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Proporcionar nuestros servicios</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Resolver disputas</li>
                <li>Hacer cumplir nuestros acuerdos</li>
                <li>Mejorar nuestros servicios</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Los datos se eliminan automáticamente cuando elimina su cuenta o después de un período de inactividad prolongado.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Menores de Edad</h2>
              <p className="text-gray-700 mb-4">
                Nuestro sitio web no está dirigido a menores de 18 años. No recopilamos intencionalmente información personal de menores de edad. 
                Si es menor de edad, debe obtener el consentimiento de sus padres o tutores antes de utilizar nuestros servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Transferencias Internacionales</h2>
              <p className="text-gray-700 mb-4">
                Sus datos se procesan y almacenan en servidores ubicados en Argentina. 
                No realizamos transferencias internacionales de datos personales sin su consentimiento explícito.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Cambios en esta Política</h2>
              <p className="text-gray-700 mb-4">
                Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cualquier cambio significativo:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Publicando la nueva política en nuestro sitio web</li>
                <li>Enviando una notificación por email (si tiene habilitadas las actualizaciones importantes)</li>
                <li>Mostrando un aviso en el sitio web</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Si tiene preguntas sobre esta política de privacidad o sobre el tratamiento de sus datos personales, puede contactarnos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Email:</strong> dulcetwilightdc@gmail.com</li>
                <li><strong>Formulario de contacto:</strong> A través de nuestro sitio web</li>
                <li><strong>Sistema de tickets:</strong> Desde su perfil de usuario</li>
                <li><strong>Dirección:</strong> Lavalle Costa de Araujo, Mendoza, Argentina</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Autoridad de Control</h2>
              <p className="text-gray-700 mb-4">
                Si considera que el tratamiento de sus datos personales no cumple con la normativa vigente, 
                tiene derecho a presentar una reclamación ante la autoridad de control competente en Argentina.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}



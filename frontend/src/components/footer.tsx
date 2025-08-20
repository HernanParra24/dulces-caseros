import Link from 'next/link';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
         <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-serif text-xl font-bold text-white">Dulce Twilight</span>
            </div>
            <p className="text-gray-400 text-sm">
              Los mejores Dulce Twilight artesanales elaborados con ingredientes naturales 
              y técnicas tradicionales.
            </p>
                         <div className="flex space-x-4">
               <a href="#" className="text-gray-400 hover:text-white transition-colors">
                 <Instagram className="w-5 h-5" />
               </a>
             </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-400 hover:text-white transition-colors">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors">
                  Quiénes Somos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Atención al Cliente</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-gray-400 hover:text-white transition-colors">
                  Envíos y Entregas
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-gray-400 hover:text-white transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="text-gray-400 hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Contacto</h3>
            <div className="space-y-3 text-sm">
                             <div className="flex items-center space-x-3">
                 <MapPin className="w-4 h-4 text-orange-400" />
                                  <span className="text-gray-400">
                    Lavalle Costa de Araujo<br />
                    Mendoza, Argentina
                  </span>
               </div>
               <div className="flex items-center space-x-3">
                 <Phone className="w-4 h-4 text-orange-400" />
                                  <span className="text-gray-400">+54 261 563-2310</span>
               </div>
               <div className="flex items-center space-x-3">
                 <Mail className="w-4 h-4 text-orange-400" />
                                  <span className="text-gray-400">dulcetwilightdc2609@gmail.com</span>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                                   <p className="text-gray-400 text-sm">
                © 2025 Dulce Twilight. Todos los derechos reservados.
              </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

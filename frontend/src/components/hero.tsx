'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { ShoppingBag, Star, Truck } from 'lucide-react';
import { scrollToSection } from '@/lib/scroll-utils';
import { useSiteConfig } from '@/hooks/use-site-config';

export function Hero() {
  const { config, isLoading, refetch } = useSiteConfig();
  
  // Imagen por defecto si no hay configuración
  const defaultImage = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop&crop=center";
  const heroImage = config?.heroImageUrl || defaultImage;

  // Actualizar la configuración cuando cambie
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, [refetch]);

  return (
         <section className="relative bg-gradient-to-br from-orange-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
                                     <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl mb-6">
              Los Mejores{' '}
              <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">Dulce Twilight</span>
              <br />
              Artesanales
            </h1>
            
                         <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
               Descubre el sabor auténtico de Dulce Twilight, elaborados con ingredientes naturales 
               y técnicas tradicionales. Cada bocado es una experiencia única.
             </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button 
                onClick={() => scrollToSection('productos')} 
                className="btn btn-primary btn-lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Ver Productos
              </button>
              <button 
                onClick={() => scrollToSection('sobre-nosotros')} 
                className="btn btn-outline btn-lg"
              >
                Conoce Nuestra Historia
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                             <div className="flex items-center justify-center lg:justify-start space-x-2">
                 <Star className="w-5 h-5 text-yellow-500" />
                 <span className="text-gray-700 dark:text-gray-300">100% Artesanal</span>
               </div>
               <div className="flex items-center justify-center lg:justify-start space-x-2">
                 <Truck className="w-5 h-5 text-green-500" />
                 <span className="text-gray-700 dark:text-gray-300">Envío Gratis +$8.000</span>
               </div>
               <div className="flex items-center justify-center lg:justify-start space-x-2">
                 <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                 <span className="text-gray-700 dark:text-gray-300">Ingredientes Naturales</span>
               </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Dulces artesanales argentinos"
                className="rounded-2xl shadow-strong w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-medium"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍫</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-medium"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍰</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-auto"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-white"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-white"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
}

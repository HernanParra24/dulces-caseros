'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Star, Truck } from 'lucide-react';
import GoogleMaps from '@/components/google-maps';

export function About() {
  return (
    <section id="sobre-nosotros" className="section">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-6">Nuestra Historia</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Dulce Twilight nació en julio de 2025 como un sueño personal convertido en realidad. 
              Este emprendimiento surgió de la pasión por la repostería artesanal y el deseo de 
              compartir dulces únicos y deliciosos con nuestra comunidad.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Aunque somos un proyecto reciente, cada dulce que elaboramos está hecho con dedicación 
              y amor, utilizando ingredientes naturales de la más alta calidad. Nuestro compromiso 
              es ofrecer productos artesanales que no solo deleiten el paladar, sino que también 
              transmitan la calidez y autenticidad de un emprendimiento familiar.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Hecho con Amor</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cada dulce elaborado artesanalmente</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Calidad Premium</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ingredientes naturales seleccionados</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Sabor Único</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recetas originales y creativas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Envío a Mendoza</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Llegamos a toda la provincia</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <GoogleMaps 
              address="Lavalle Costa de Araujo, Mendoza, Argentina"
              coordinates={{ lat: -32.5667, lng: -68.3333 }}
              className="w-full h-[400px] rounded-2xl shadow-strong"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

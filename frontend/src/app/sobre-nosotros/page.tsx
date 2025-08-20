'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Clock, MapPin, Phone, Mail, Star } from 'lucide-react';
import { BackButton } from '@/components/back-button';

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <BackButton />
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Quiénes Somos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Somos una empresa familiar dedicada a crear los dulces más deliciosos y artesanales, 
              manteniendo la tradición y el amor en cada preparación.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Todo comenzó con la visión de Mauricio Parra, un joven emprendedor de 16 años 
                  que soñaba con crear dulces caseros que llevaran el sabor del amor y la amistad 
                  a cada hogar.
                </p>
                <p>
                  Con el apoyo de su familia, decidimos convertir esta pasión en un negocio 
                  que no solo ofrezca dulces deliciosos, sino que también transmita los valores 
                  familiares y la calidez humana en cada producto.
                </p>
                <p>
                  Hoy, seguimos utilizando ingredientes frescos y naturales, sin conservantes 
                  artificiales, para mantener la autenticidad y el sabor que nos caracteriza.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-orange-400 to-purple-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <Heart className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Nuestro Slogan</h3>
                  <p className="text-lg font-medium">
                    "DULCES CASEROS CON EL SABOR DE LA AMISTAD Y EL AMOR SIN CONDICIÓN"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estos principios guían cada decisión que tomamos y cada dulce que preparamos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Calidad Premium</h3>
              <p className="text-gray-600">
                Utilizamos solo los mejores ingredientes naturales, sin conservantes 
                artificiales, para garantizar la máxima calidad en cada producto.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Amor y Amistad</h3>
              <p className="text-gray-600">
                Cada dulce está preparado con el mismo amor y dedicación que ponemos 
                en todo lo que hacemos, transmitiendo calidez y amistad.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Artesanía</h3>
              <p className="text-gray-600">
                Cada dulce es preparado a mano, con técnicas artesanales que 
                requieren tiempo y dedicación para lograr la perfección.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Una familia unida por la pasión de crear dulces deliciosos y compartir momentos especiales.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6 text-center"
            >
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">M</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mauricio Parra</h3>
              <p className="text-orange-600 font-medium mb-3">Fundador</p>
              <p className="text-gray-600 text-sm">
                Con solo 16 años, Mauricio tuvo la visión de crear este emprendimiento 
                familiar, demostrando que la edad no es límite para los sueños.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6 text-center"
            >
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">A</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aníbal Parra</h3>
              <p className="text-purple-600 font-medium mb-3">Proveedor</p>
              <p className="text-gray-600 text-sm">
                Como padre de familia, Aníbal se encarga de conseguir los mejores 
                ingredientes para que nuestros dulces tengan la calidad que merecen.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-sm p-6 text-center"
            >
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">G</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gloria Montenegro</h3>
              <p className="text-orange-600 font-medium mb-3">Producción</p>
              <p className="text-gray-600 text-sm">
                Gloria, la madre de la familia, ayuda a Mauricio en la preparación 
                de los dulces y el embazado, aportando su experiencia y amor.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-lg shadow-sm p-6 text-center"
            >
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">H</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hernán Parra</h3>
              <p className="text-purple-600 font-medium mb-3">Desarrollo Web</p>
              <p className="text-gray-600 text-sm">
                Como hermano mayor, Hernán se encarga de crear y mantener esta página web, 
                conectando la tradición familiar con la tecnología moderna.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
              <p className="text-gray-600 leading-relaxed">
                Crear dulces caseros que no solo deleiten el paladar, sino que también 
                transmitan el amor, la amistad y los valores familiares que nos caracterizan. 
                Queremos que cada bocado sea una experiencia que conecte corazones.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center lg:text-left"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser reconocidos como la empresa familiar que lleva el sabor del amor 
                y la amistad a cada hogar, manteniendo la calidad artesanal y los 
                valores que nos hacen únicos en el mercado de dulces caseros.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contáctanos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ¿Tienes alguna pregunta o quieres hacer un pedido especial? 
              Estamos aquí para ayudarte.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dirección</h3>
              <p className="text-gray-600">
                Lavalle Costa de Araujo<br />
                Mendoza, Argentina
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600">
                +54 261 563-2310<br />
                Lunes a Domingo<br />
                9:00 - 20:00
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                dulcetwilightdc@gmail.com<br />
                Respondemos en 24h
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

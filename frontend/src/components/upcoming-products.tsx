'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Star } from 'lucide-react';
import { upcomingProductService } from '@/lib/api';

interface UpcomingProduct {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  estimatedReleaseMonth?: number;
  estimatedReleaseYear?: number;
  sortOrder: number;
}

export function UpcomingProducts() {
  const [products, setProducts] = useState<UpcomingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUpcomingProducts = async () => {
      try {
        const data = await upcomingProductService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error loading upcoming products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUpcomingProducts();
  }, []);

  const getMonthName = (month: number) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1] || '';
  };

  const getEstimatedRelease = (product: UpcomingProduct) => {
    if (product.estimatedReleaseMonth && product.estimatedReleaseYear) {
      return `${getMonthName(product.estimatedReleaseMonth)} ${product.estimatedReleaseYear}`;
    }
    return 'Próximamente';
  };

  if (isLoading) {
    return (
      <section id="proximamente" className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Próximamente</h2>
            <p className="text-lg text-gray-600">Nuevos productos que estamos preparando para ti</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // No mostrar la sección si no hay productos
  }

  return (
    <section id="proximamente" className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Próximamente</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nuevos productos que estamos preparando especialmente para ti. 
            ¡Mantente atento a nuestras novedades!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-orange-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Star className="w-16 h-16 text-purple-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Próximo
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-purple-600 font-medium">
                    {getEstimatedRelease(product)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {product.category && (
                  <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            ¿Quieres ser el primero en saber cuando estos productos estén disponibles?
          </p>
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-primary"
          >
            Suscríbete a nuestras novedades
          </button>
        </motion.div>
      </div>
    </section>
  );
}

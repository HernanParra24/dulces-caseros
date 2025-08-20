'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { productService } from '@/lib/api';
import { ProductCard } from './product-card';
import { motion } from 'framer-motion';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await productService.getFeatured();
        // El backend devuelve directamente un array de productos
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">Productos Destacados</h2>
            <p className="text-gray-600 text-lg">Nuestros Dulce Twilight más populares</p>
          </div>
          <div className="flex justify-center px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex justify-center">
                  <div className="max-w-sm">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">Productos Destacados</h2>
          <p className="text-gray-600 text-lg">Nuestros Dulce Twilight más populares</p>
        </motion.div>

        <div className="flex justify-center px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex justify-center"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProductCategoryLabel, getRandomImage } from '@/lib/utils';

const categories = [
  { id: 'chocolates', name: 'Chocolates', icon: '🍫' },
  { id: 'trufas', name: 'Trufas', icon: '🍫' },
  { id: 'bombones', name: 'Bombones', icon: '🍬' },
  { id: 'galletas', name: 'Galletas', icon: '🍪' },
  { id: 'pasteles', name: 'Pasteles', icon: '🍰' },
  { id: 'caramelos', name: 'Caramelos', icon: '🍭' },
];

export function Categories() {
  return (
    <section className="section bg-gray-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Explora por Categorías</h2>
          <p className="text-gray-600">Encuentra tus dulces favoritos</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={`/categorias/${category.id}`}
                className="block group"
              >
                <div className="card text-center p-6 hover:shadow-medium transition-all duration-300 group-hover:scale-105">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

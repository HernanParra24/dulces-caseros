'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { productService } from '@/lib/api';
import { ProductCard } from './product-card';
import { Loader2, Filter, Search } from 'lucide-react';

export function AllProducts() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener el término de búsqueda de la URL
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(decodeURIComponent(urlSearch));
    }
  }, [searchParams]);

  // También verificar si hay un parámetro search en la URL actual
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const searchParam = currentUrl.searchParams.get('search');
    if (searchParam && !searchTerm) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          productService.getCategories(),
        ]);

        const productsArray = productsData.products || productsData || [];
        setProducts(productsArray);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Realizar búsqueda en el backend cuando el término de búsqueda cambie
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        try {
          const results = await productService.search(searchTerm.trim());
          setSearchResults(Array.isArray(results) ? results : []);
        } catch (error) {
          console.error('Error searching products:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    // Debounce para evitar demasiadas llamadas a la API
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredProducts = searchTerm.trim() 
    ? searchResults.filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    : products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <section id="productos" className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Nuestros Productos</h2>
            <p className="text-gray-600 dark:text-gray-300">Explora nuestra amplia selección de Dulce Twilight artesanales</p>
          </div>
          <div className="flex justify-center px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl w-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse flex justify-center">
                  <div className="max-w-sm">
                    <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
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
    <section id="productos" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">Nuestros Productos</h2>
          <p className="text-gray-600 dark:text-gray-300">Explora nuestra amplia selección de Dulce Twilight artesanales</p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          {/* Búsqueda */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              {isSearching ? (
                <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              )}
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            {searchTerm.trim() && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {isSearching ? 'Buscando...' : `Encontrados ${filteredProducts.length} productos`}
              </p>
            )}
          </div>

          {/* Filtros de categorías */}
                     <div className="flex items-center justify-center mb-6">
             <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Filtrar por categoría:</h3>
           </div>
          
          <div className="flex flex-wrap justify-center gap-3">
                         <button
               onClick={() => setSelectedCategory('all')}
               className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                 selectedCategory === 'all'
                   ? 'bg-orange-600 text-white'
                   : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-gray-200 dark:border-gray-600'
               }`}
             >
               Todas las categorías
             </button>
            
            {categories.map((category) => (
                             <button
                 key={category}
                 onClick={() => setSelectedCategory(category)}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                   selectedCategory === category
                     ? 'bg-orange-600 text-white'
                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-gray-200 dark:border-gray-600'
                 }`}
               >
                 {category}
               </button>
            ))}
          </div>
        </motion.div>

        {/* Resultados */}
                 <div className="mb-6">
           <p className="text-center text-gray-600 dark:text-gray-400">
             {selectedCategory === 'all' 
               ? `Mostrando todos los productos (${filteredProducts.length})`
               : `Mostrando productos de ${selectedCategory} (${filteredProducts.length})`
             }
           </p>
         </div>

        {/* Grid de productos */}
        {filteredProducts.length > 0 ? (
          <div className="flex justify-center px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl w-full"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-center"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              {searchTerm.trim() ? (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-600 mb-4">
                    No encontramos productos que coincidan con "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Ver todos los productos
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-600">
                    {selectedCategory === 'all' 
                      ? 'No hay productos disponibles en este momento.'
                      : `No hay productos en la categoría "${selectedCategory}".`
                    }
                  </p>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Ver todas las categorías
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

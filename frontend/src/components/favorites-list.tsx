'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, Star, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { favoriteService } from '@/lib/api';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface Favorite {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    rating: number;
    reviewCount: number;
  };
  createdAt: string;
}

export function FavoritesList() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await favoriteService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Error al cargar favoritos');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      await favoriteService.removeFromFavorites(productId);
      setFavorites(prev => prev.filter(fav => fav.product.id !== productId));
      toast.success('Producto removido de favoritos');
    } catch (error) {
      toast.error('Error al remover de favoritos');
    }
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      stock: product.stock || 10,
      category: product.category,
      description: product.description,
      ingredients: product.ingredients,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      rating: product.rating,
      reviewCount: product.reviewCount,
      weight: product.weight,
      allergens: product.allergens,
      nutritionalInfo: product.nutritionalInfo,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
    toast.success('Producto agregado al carrito');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes favoritos</h3>
        <p className="text-gray-600 mb-6">
          Guarda tus productos favoritos para encontrarlos fácilmente más tarde.
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Heart className="w-6 h-6 text-orange-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Mis Favoritos ({favorites.length})
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {favorites.map((favorite, index) => (
            <motion.div
              key={favorite.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Imagen */}
              <div className="relative mb-3">
                <img
                  src={favorite.product.images?.[0] || '/placeholder-product.jpg'}
                  alt={favorite.product.name}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.jpg';
                  }}
                />
                <button
                  onClick={() => removeFromFavorites(favorite.product.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remover de favoritos"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Información del producto */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                    {favorite.product.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">
                      {favorite.product.rating} ({favorite.product.reviewCount})
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                  {favorite.product.name}
                </h3>
                
                <p className="text-gray-600 text-xs line-clamp-2">
                  {favorite.product.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-orange-600">
                    {formatPrice(favorite.product.price)}
                  </span>
                  
                  <div className="flex space-x-1">
                    <Link
                      href={`/productos/${favorite.product.id}`}
                      className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                      title="Ver producto"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleAddToCart(favorite.product)}
                      className="p-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                      title="Agregar al carrito"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}


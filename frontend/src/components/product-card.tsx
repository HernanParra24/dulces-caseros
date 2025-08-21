'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice, getProductCategoryLabel, getRandomImage } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { favoriteService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { StockIndicator } from './stock-indicator';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const currentQuantity = getItemQuantity(product.id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, product.id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await favoriteService.isFavorite(product.id);
      setIsFavorite(response.isFavorite);
    } catch (error) {
      setIsFavorite(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar favoritos', { duration: 3000 });
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await favoriteService.removeFromFavorites(product.id);
        setIsFavorite(false);
        toast.success('Removido de favoritos', { duration: 2000 });
      } else {
        await favoriteService.addToFavorites(product.id);
        setIsFavorite(true);
        toast.success('Agregado a favoritos', { duration: 2000 });
      }
    } catch (error) {
      toast.error('Error al actualizar favoritos', { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group h-full hover:-translate-y-1 transition-transform duration-300">
      <Link href={`/productos/${product.id}`} className="block h-full">
        <div className="rounded-lg border bg-white text-gray-900 shadow-sm overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300 h-full flex flex-col">
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={product.images?.[0] || getRandomImage(product.category)}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 space-y-2">
              {product.isFeatured && (
                <span className="badge badge-default">Destacado</span>
              )}
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300">
                {getProductCategoryLabel(product.category)}
              </span>
            </div>

            {/* Stock indicator */}
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">Agotado</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute bottom-3 right-3 flex space-x-2">
              {/* Favorite button */}
              <button
                onClick={handleToggleFavorite}
                disabled={isLoading}
                className={`p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFavorite 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Quick add button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col h-full">
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">
                {product.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* Rating - siempre ocupa espacio */}
              <div className="h-6 mb-3">
                {product.rating && product.rating > 0 ? (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {Number(product.rating).toFixed(1)} ({product.reviewCount || 0})
                    </span>
                  </div>
                ) : (
                  <div className="h-4"></div>
                )}
              </div>
            </div>

            {/* Price and stock - siempre al final */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-orange-600">
                  {formatPrice(product.price)}
                </span>
                <StockIndicator 
                  stock={product.stock} 
                  productName={product.name}
                  className="text-xs"
                />
              </div>
              
              {currentQuantity > 0 && (
                <span className="text-sm text-orange-600 font-medium">
                  {currentQuantity} en carrito
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

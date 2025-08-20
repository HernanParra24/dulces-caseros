'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { productService } from '@/lib/api';
import { useCartStore } from '@/stores/cart-store';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartSidebar } from '@/components/cart-sidebar';
import { ProductReviews } from '@/components/product-reviews';
import { formatPrice, getProductCategoryLabel, getRandomImage } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Clock,
  Truck,
  Shield
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem, getItemQuantity } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
    }
  };

  const currentQuantity = product ? getItemQuantity(product.id) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando producto...</p>
          </div>
        </main>
        <Footer />
        <CartSidebar />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
              <p className="text-gray-600 mb-8">El producto que buscas no existe o ha sido eliminado. Te invitamos a explorar nuestros otros productos.</p>
            </div>
            
            <div className="space-y-4">
              <a 
                href="/productos" 
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
              >
                Ver todos los productos
              </a>
              <div className="text-sm text-gray-500">
                <a href="/" className="hover:text-orange-600">← Volver al inicio</a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <CartSidebar />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [getRandomImage(product.category)];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><a href="/" className="hover:text-orange-600">Inicio</a></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li><a href="/productos" className="hover:text-orange-600">Productos</a></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image with Decorative Frame */}
              <div className="relative">
                {/* Decorative outer frame */}
                <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl shadow-xl">
                  {/* Inner frame with pattern */}
                  <div className="relative bg-white p-4 rounded-xl shadow-inner border border-orange-200">
                    {/* Image container */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden group">
                      <img
                        src={images[selectedImage]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Overlay for sold out */}
                      {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-white text-2xl">×</span>
                            </div>
                            <span className="text-white font-bold text-xl">Agotado</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Decorative corner elements */}
                      <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-orange-400 rounded-tl-lg"></div>
                      <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-orange-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-orange-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-orange-400 rounded-br-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Images with Enhanced Design */}
              {images.length > 1 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Vista previa:</h4>
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 relative group ${
                          selectedImage === index 
                            ? 'ring-2 ring-orange-500 ring-offset-2' 
                            : 'ring-1 ring-gray-200 hover:ring-orange-300'
                        }`}
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-200">
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                          />
                        </div>
                        
                        {/* Selected indicator */}
                        {selectedImage === index && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header with Rating */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                
                {/* Rating and Reviews */}
                {product.rating && product.rating > 0 && product.reviewCount && product.reviewCount > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Number(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                      {Number(product.rating).toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({product.reviewCount} reseñas)
                    </span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-4xl font-bold text-orange-600">
                      {formatPrice(product.price)}
                    </span>
                    <p className="text-sm text-orange-700 mt-1">Precio final</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Stock disponible</div>
                    <div className={`text-lg font-semibold ${
                      product.stock > 10 ? 'text-green-600' : 
                      product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  Descripción
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Ingredientes
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{product.ingredients}</p>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="bg-gradient-to-r from-gray-50 to-orange-50 border border-orange-200 rounded-xl p-6 space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 text-center">Agregar al carrito</h3>
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-center space-x-4">
                  <label className="text-lg font-medium text-gray-700">Cantidad:</label>
                  <div className="flex items-center bg-white border-2 border-orange-200 rounded-xl shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-orange-50 transition-colors rounded-l-lg disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <span className="text-xl font-bold text-orange-600">−</span>
                    </button>
                    <span className="px-6 py-3 border-x border-orange-200 text-xl font-bold text-gray-900 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 hover:bg-orange-50 transition-colors rounded-r-lg disabled:opacity-50"
                      disabled={product.stock <= 0}
                    >
                      <span className="text-xl font-bold text-orange-600">+</span>
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>
                    {product.stock <= 0 ? 'Producto Agotado' : `Agregar al carrito (${quantity})`}
                  </span>
                </button>

                {currentQuantity > 0 && (
                  <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 text-center">
                    <p className="text-orange-800 font-medium">
                      ✓ Ya tienes {currentQuantity} en tu carrito
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  Información adicional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Envío gratis</div>
                      <div className="text-sm text-gray-600">Desde $8,000</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Entrega rápida</div>
                      <div className="text-sm text-gray-600">24-48 horas</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Cobertura</div>
                      <div className="text-sm text-gray-600">Toda Mendoza</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Garantía</div>
                      <div className="text-sm text-gray-600">Calidad asegurada</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Reseñas */}
          <div className="mt-16">
            <ProductReviews productId={product.id} productName={product.name} />
          </div>
        </motion.div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Review, CreateReviewDto } from '@/types';
import { reviewService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { Star, MessageCircle, Edit, Trash2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState<CreateReviewDto>({
    productId,
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      
      // Cargar reseñas del producto
      const reviewsData = await reviewService.getProductReviews(productId);
      setReviews(reviewsData || []);
      
      // Cargar reseña del usuario si está autenticado
      if (isAuthenticated) {
        try {
          const userReviewData = await reviewService.getUserReview(productId);
          setUserReview(userReviewData || null);
        } catch (error) {
          console.error('Error loading user review:', error);
          setUserReview(null);
        }
      } else {
        setUserReview(null);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
      setUserReview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      toast.error('Por favor, escribe un comentario');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editing && userReview) {
        await reviewService.updateReview(userReview.id, {
          rating: formData.rating,
          comment: formData.comment,
        });
        toast.success('Reseña actualizada exitosamente');
      } else {
        await reviewService.createReview(formData);
        toast.success('Reseña publicada exitosamente');
      }
      
      setShowForm(false);
      setEditing(false);
      setFormData({ productId, rating: 5, comment: '' });
      await loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;
    
    if (!confirm('¿Estás seguro de que quieres eliminar tu reseña?')) {
      return;
    }

    try {
      await reviewService.deleteReview(userReview.id);
      toast.success('Reseña eliminada exitosamente');
      setUserReview(null);
      await loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEdit = () => {
    if (!userReview) return;
    
    setFormData({
      productId,
      rating: userReview.rating,
      comment: userReview.comment,
    });
    setEditing(true);
    setShowForm(true);
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onChange?.(star) : undefined}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            }`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Reseñas ({reviews.length})
          </h3>
        </div>
        
        {isAuthenticated && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{userReview ? 'Editar reseña' : 'Escribir reseña'}</span>
          </button>
        )}
        

      </div>

      {/* Formulario de reseña */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-6 bg-gray-50"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {editing ? 'Editar reseña' : 'Escribir reseña'}
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación
                </label>
                {renderStars(formData.rating, true, (rating) =>
                  setFormData({ ...formData, rating })
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Comparte tu experiencia con este producto..."
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Guardando...' : editing ? 'Actualizar' : 'Publicar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(false);
                    setFormData({ productId, rating: 5, comment: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reseña del usuario actual */}
      {userReview && !showForm && (
        <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Tu reseña</p>
                <p className="text-sm text-gray-500">
                  {formatDate(userReview.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="mb-2">
            {renderStars(userReview.rating)}
          </div>
          
          <p className="text-gray-700">{userReview.comment}</p>
        </div>
      )}

      {/* Lista de reseñas */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                                         <p className="font-medium text-gray-900">
                       Usuario
                     </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                {review.isVerified && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Compra verificada
                  </span>
                )}
              </div>
              
              <div className="mb-2">
                {renderStars(review.rating)}
              </div>
              
              <p className="text-gray-700">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No hay reseñas para este producto aún.
            {isAuthenticated && !userReview && ' ¡Sé el primero en opinar!'}
          </p>
        </div>
      )}

      {/* Mensaje para usuarios no autenticados */}
      {!isAuthenticated && (
        <div className="border rounded-lg p-4 bg-blue-50">
          <p className="text-blue-800 text-sm">
            <strong>¿Compraste este producto?</strong> Inicia sesión para dejar tu reseña y ayudar a otros clientes.
          </p>
        </div>
      )}
    </div>
  );
}

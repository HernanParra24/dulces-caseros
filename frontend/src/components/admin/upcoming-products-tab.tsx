'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { upcomingProductService } from '@/lib/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  Image as ImageIcon,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UpcomingProduct {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  estimatedReleaseMonth?: number;
  estimatedReleaseYear?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function UpcomingProductsTab() {
  const [products, setProducts] = useState<UpcomingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<UpcomingProduct | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    category: '',
    estimatedReleaseMonth: '',
    estimatedReleaseYear: '',
    sortOrder: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await upcomingProductService.getAllForAdmin();
      setProducts(data);
    } catch (error) {
      console.error('Error loading upcoming products:', error);
      toast.error('Error al cargar productos próximamente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        estimatedReleaseMonth: formData.estimatedReleaseMonth ? parseInt(formData.estimatedReleaseMonth) : null,
        estimatedReleaseYear: formData.estimatedReleaseYear ? parseInt(formData.estimatedReleaseYear) : null,
        sortOrder: parseInt(formData.sortOrder.toString())
      };

      if (editingProduct) {
        await upcomingProductService.update(editingProduct.id, productData);
        toast.success('Producto próximo actualizado exitosamente');
      } else {
        await upcomingProductService.create(productData);
        toast.success('Producto próximo creado exitosamente');
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error saving upcoming product:', error);
      toast.error('Error al guardar el producto próximo');
    }
  };

  const handleEdit = (product: UpcomingProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      category: product.category || '',
      estimatedReleaseMonth: product.estimatedReleaseMonth?.toString() || '',
      estimatedReleaseYear: product.estimatedReleaseYear?.toString() || '',
      sortOrder: product.sortOrder
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto próximo?')) {
      return;
    }

    try {
      await upcomingProductService.delete(id);
      toast.success('Producto próximo eliminado exitosamente');
      loadProducts();
    } catch (error) {
      console.error('Error deleting upcoming product:', error);
      toast.error('Error al eliminar el producto próximo');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await upcomingProductService.toggleActive(id);
      toast.success('Estado del producto actualizado');
      loadProducts();
    } catch (error) {
      console.error('Error toggling product active:', error);
      toast.error('Error al cambiar el estado del producto');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      category: '',
      estimatedReleaseMonth: '',
      estimatedReleaseYear: '',
      sortOrder: 0
    });
  };

  const openModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const getMonthName = (month: number) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1] || '';
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Productos Próximamente</h2>
          <p className="text-gray-600">Gestiona los productos que estarán disponibles próximamente</p>
        </div>
        <button
          onClick={openModal}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
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
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleToggleActive(product.id)}
                  className={`p-1 rounded-full ${
                    product.isActive 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-600 font-medium">
                  {product.estimatedReleaseMonth && product.estimatedReleaseYear
                    ? `${getMonthName(product.estimatedReleaseMonth)} ${product.estimatedReleaseYear}`
                    : 'Próximamente'
                  }
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>

              {product.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              {product.category && (
                <div className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mb-3">
                  {product.category}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="btn btn-outline btn-sm flex-1"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos próximamente</h3>
          <p className="text-gray-600 mb-4">
            Comienza agregando productos que estarán disponibles próximamente
          </p>
          <button onClick={openModal} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Producto
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de la imagen
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: Dulces, Postres, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mes estimado
                    </label>
                    <select
                      value={formData.estimatedReleaseMonth}
                      onChange={(e) => setFormData({ ...formData, estimatedReleaseMonth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>
                          {getMonthName(month)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año estimado
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedReleaseYear}
                      onChange={(e) => setFormData({ ...formData, estimatedReleaseYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min={new Date().getFullYear()}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orden de aparición
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-outline flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingProduct ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Edit, Trash2, LogOut, ShoppingBag, Heart, Settings, Camera, Upload, Package, Star, BarChart3, Shield, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { OrderHistory } from '@/components/order-history';
import { FavoritesList } from '@/components/favorites-list';
import { UserSettings } from '@/components/user-settings';
import { UserStats } from '@/components/user-stats';
import { BackButton } from '@/components/back-button';
// EmailVerificationStatus component removed - email verification is now optional

import Link from 'next/link';

type TabType = 'profile' | 'orders' | 'favorites' | 'settings' | 'stats';

function PerfilContent() {
  const { user, isAuthenticated, logout, updateProfile, deleteAccount, checkAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    profileImage: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Verificar autenticación y obtener información actualizada del usuario
    checkAuth();
  }, [isAuthenticated, router, checkAuth]);

  // Procesar hash después de que el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['profile', 'orders', 'favorites', 'settings', 'stats'].includes(hash)) {
        setActiveTab(hash as TabType);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '',
      });
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'orders', 'favorites', 'settings', 'stats'].includes(tabParam)) {
      setActiveTab(tabParam as TabType);
    }
  }, [searchParams]);

  // Manejar hash fragments para navegación directa a pestañas
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['profile', 'orders', 'favorites', 'settings', 'stats'].includes(hash)) {
        setActiveTab(hash as TabType);
      }
    };

    // Verificar hash inicial con un pequeño delay para asegurar que el componente esté montado
    const timer = setTimeout(() => {
      handleHashChange();
    }, 100);

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones (máximo 200x200 para reducir más el tamaño)
        const maxSize = 200;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con calidad 0.6 para reducir más el tamaño
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen es demasiado grande. Máximo 5MB');
        return;
      }
      
      setProfileImage(file);
      
      try {
        // Comprimir imagen
        const compressedImage = await compressImage(file);
        setImagePreview(compressedImage);
      } catch (error) {
        toast.error('Error al procesar la imagen');
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData = { ...formData };
      
      // Si hay una nueva imagen, usar la imagen comprimida
      if (imagePreview && imagePreview !== user.profileImage) {
        updateData.profileImage = imagePreview;
      }
      
      await updateProfile(updateData);
      setIsEditing(false);
      setProfileImage(null); // Clear the temporary file
      toast.success('Perfil actualizado exitosamente');
      // Force an authentication check to update the state
      await checkAuth();
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteAccount();
      toast.success('Cuenta eliminada exitosamente');
      router.push('/');
    } catch (error) {
      toast.error('Error al eliminar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Sesión cerrada exitosamente');
  };

  const renderTabContent = () => {
    // Para admins, solo mostrar información personal y configuración
    if (user?.role === 'admin') {
      switch (activeTab) {
        case 'profile':
          return (
            <div className="space-y-6">
              {/* Información Personal */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Información Personal</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </button>
                </div>

                {/* Imagen de Perfil */}
                <div className="text-center mb-6">
                  <div className="relative inline-block group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mx-auto mb-4 border-4 border-gray-200 shadow-sm">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Perfil" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="absolute bottom-0 right-0">
                        <label className="bg-orange-600 text-white p-2 rounded-full cursor-pointer hover:bg-orange-700">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Máximo 5MB, se redimensionará automáticamente
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.phone || 'No especificado'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol
                    </label>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-orange-600 mr-2" />
                      <span className="text-gray-900 font-medium">Administrador</span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setProfileImage(null);
                        if (user?.profileImage) {
                          setImagePreview(user.profileImage);
                        } else {
                          setImagePreview(null);
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                )}
              </div>

              {/* Acciones de Cuenta */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones de Cuenta</h2>
                
                <div className="space-y-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isLoading ? 'Eliminando...' : 'Eliminar Cuenta'}
                  </button>
                </div>
              </div>
            </div>
          );

        case 'settings':
          return (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <UserSettings />
            </div>
          );

        default:
          return (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center py-8">
                <Shield className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Panel de Administración</h3>
                <p className="text-gray-600 mb-4">Como administrador, puedes gestionar tu información personal y configuración desde aquí.</p>
                <Link
                  href="/admin"
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Ir al Panel Admin
                </Link>
              </div>
            </div>
          );
      }
    }

    // Para usuarios regulares, mostrar todas las funcionalidades
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Información Personal */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Información Personal</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              {/* Imagen de Perfil */}
              <div className="text-center mb-6">
                <div className="relative inline-block group">
                  {/* Contenedor principal de la imagen */}
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    {/* Imagen de perfil */}
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-orange-200 shadow-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-2xl transition-all duration-300">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Perfil" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-16 h-16 text-orange-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Overlay con botón de cambio de imagen */}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <label className="bg-white text-orange-600 p-3 rounded-full cursor-pointer hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 flex flex-col items-center">
                          <Camera className="w-5 h-5 mb-1" />
                          <span className="text-xs font-medium">Cambiar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {/* Información de ayuda mejorada */}
                  {isEditing && (
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Camera className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Cambiar foto de perfil</span>
                      </div>
                      <div className="text-xs text-orange-700 space-y-1">
                        <p>• Haz clic en la imagen para seleccionar una nueva foto</p>
                        <p>• Formatos soportados: JPG, PNG, GIF</p>
                        <p>• Tamaño máximo: 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Botón alternativo para móviles mejorado */}
                {isEditing && (
                  <div className="md:hidden mt-4">
                    <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105">
                      <Camera className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Cambiar foto de perfil</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.phone || 'No especificado'}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setProfileImage(null);
                      if (user?.profileImage) {
                        setImagePreview(user.profileImage);
                      } else {
                        setImagePreview(null);
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </div>



            {/* Acciones de Cuenta */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones de Cuenta</h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </button>

                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isLoading ? 'Eliminando...' : 'Eliminar Cuenta'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <OrderHistory />
          </div>
        );

      case 'favorites':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <FavoritesList />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* Configuración de Usuario */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <UserSettings />
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <UserStats />
          </div>
        );

      default:
        return null;
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-orange-100 mx-auto mb-4 border-4 border-orange-200 shadow-sm">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <User className="w-10 h-10 text-orange-600" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4 mr-3" />
                  Información Personal
                </button>
                
                {user?.role !== 'admin' && (
                  <>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'orders'
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 mr-3" />
                      Mis Pedidos
                    </button>
                    <button
                      onClick={() => setActiveTab('favorites')}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'favorites'
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className="w-4 h-4 mr-3" />
                      Favoritos
                    </button>
                    <button
                      onClick={() => setActiveTab('stats')}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'stats'
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 mr-3" />
                      Estadísticas
                    </button>
                    
                    <Link
                      href="/mis-mensajes"
                      className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:bg-gray-50"
                    >
                      <MessageCircle className="w-4 h-4 mr-3" />
                      Mis Mensajes
                    </Link>
                  </>
                )}
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Configuración
                </button>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PerfilContent />
    </Suspense>
  );
}

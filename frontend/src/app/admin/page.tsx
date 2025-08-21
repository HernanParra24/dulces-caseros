'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { adminService, supportService, notificationsService, configService, reportsService } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Star, 
  DollarSign, 
  TrendingUp,
  Settings,
  HelpCircle,
  BarChart3,
  Shield,
  FileText,
  Bell,
  Clock,
  CheckCircle,
  X,
  Mail,
  Send
} from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { AdminContactMessages } from '@/components/admin-contact-messages';
import { AdminNotificationPreferences } from '@/components/admin-notification-preferences';
import { UpcomingProductsTab } from '@/components/admin/upcoming-products-tab';
import ImageUpload from '@/components/image-upload';
import LogoUpload from '@/components/logo-upload';
import HeroImageUpload from '@/components/hero-image-upload';

type TabType = 'dashboard' | 'users' | 'products' | 'upcoming-products' | 'orders' | 'reviews' | 'support' | 'contact' | 'analytics' | 'reports' | 'settings' | 'notifications' | 'newsletter' | 'notification-preferences';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      toast.error('Acceso denegado. Solo administradores pueden acceder a esta página.');
      router.push('/');
      return;
    }

    loadDashboardStats();
    loadNotifications();
    checkLowStock();
  }, [isAuthenticated, user, router]);

  const loadDashboardStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const checkLowStock = async () => {
    try {
      // Verificar productos con stock bajo
      await adminService.checkLowStock();
      
      // Cargar productos con stock bajo
      const products = await adminService.getAllProducts();
      const lowStock = products.filter((product: any) => product.stock <= 5 && product.stock > 0);
      setLowStockProducts(lowStock);
      
      // Recargar notificaciones después de verificar
      await loadNotifications();
    } catch (error) {
      console.error('Error checking low stock:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'upcoming-products', label: 'Próximamente', icon: Clock },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'reviews', label: 'Reseñas', icon: Star },
    { id: 'support', label: 'Soporte', icon: HelpCircle },
    { id: 'contact', label: 'Contacto', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'newsletter', label: 'Newsletter', icon: Send },
    { id: 'notification-preferences', label: 'Pref. Notificaciones', icon: Bell },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab stats={stats} isLoading={isLoading} setActiveTab={setActiveTab} />;
      case 'users':
        return <UsersTab />;
      case 'products':
        return <ProductsTab />;
      case 'upcoming-products':
        return <UpcomingProductsTab />;
      case 'orders':
        return <OrdersTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'support':
        return <SupportTab />;
      case 'contact':
        return <ContactTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'reports':
        return <ReportsTab />;
      case 'settings':
        return <SettingsTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'newsletter':
        return <NewsletterTab />;
      case 'notification-preferences':
        return <NotificationPreferencesTab />;
      default:
        return <DashboardTab stats={stats} isLoading={isLoading} setActiveTab={setActiveTab} />;
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-orange-600" />
              <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <BackButton href="/" className="text-sm" />
              <span className="text-sm text-gray-600">
                Bienvenido, {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Sidebar */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <nav className="flex flex-wrap lg:flex-col space-y-1 lg:space-y-1 space-x-2 lg:space-x-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center space-x-2 px-3 py-2 text-left rounded-md transition-colors text-sm ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ stats, isLoading, setActiveTab }: { 
  stats: any; 
  isLoading: boolean; 
  setActiveTab: (tab: TabType) => void;
}) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
    loadLowStockProducts();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadLowStockProducts = async () => {
    try {
      const products = await adminService.getAllProducts();
      const lowStock = products.filter((product: any) => product.stock <= 5 && product.stock > 0);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error loading low stock products:', error);
    }
  };
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <p className="text-gray-500">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Productos',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Pedidos',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Ingresos Totales',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  // Agregar tarjeta de stock bajo si hay productos con stock bajo
  if (lowStockProducts.length > 0) {
    statCards.push({
      title: 'Stock Bajo',
      value: lowStockProducts.length,
      icon: Package,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    });
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${lowStockProducts.length > 0 ? '5' : '4'} gap-4 mb-6`}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alertas y Notificaciones */}
      {(lowStockProducts.length > 0 || notifications.length > 0) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas y Notificaciones</h3>
          
          {/* Productos con Stock Bajo */}
          {lowStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <Package className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="text-sm font-semibold text-red-800">Productos con Stock Bajo</h4>
              </div>
              <div className="space-y-2">
                {lowStockProducts.map((product: any) => (
                  <div key={product.id} className="flex justify-between items-center text-sm">
                    <span className="text-red-700">{product.name}</span>
                    <span className="font-semibold text-red-800">{product.stock} unidades</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('products')}
                className="mt-3 text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Ver todos los productos →
              </button>
            </div>
          )}

          {/* Notificaciones Recientes */}
          {notifications.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Bell className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="text-sm font-semibold text-blue-800">Notificaciones Recientes</h4>
              </div>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification: any) => (
                  <div key={notification.id} className="text-sm text-blue-700">
                    {notification.message}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('notifications')}
                className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todas las notificaciones →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Estado de Pedidos</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pendientes</span>
              <span className="font-semibold text-yellow-600">{stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completados</span>
              <span className="font-semibold text-green-600">{stats.completedOrders}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Acciones Rápidas</h3>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('orders')}
              className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              Ver pedidos pendientes
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              Agregar nuevo producto
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              Revisar reseñas
            </button>
            {lowStockProducts.length > 0 && (
              <button 
                onClick={() => setActiveTab('products')}
                className="w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors font-medium"
              >
                ⚠️ Revisar stock bajo ({lowStockProducts.length})
              </button>
            )}
            <button 
              onClick={async () => {
                try {
                  await adminService.checkLowStock();
                  await loadLowStockProducts();
                  await loadNotifications();
                  toast.success('Verificación de stock bajo completada');
                } catch (error) {
                  toast.error('Error al verificar stock bajo');
                }
              }}
              className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              🔄 Verificar stock bajo
            </button>
            <button 
              onClick={async () => {
                try {
                  await adminService.forceLowStockCheck();
                  await loadLowStockProducts();
                  await loadNotifications();
                  toast.success('Verificación forzada de stock bajo completada');
                } catch (error) {
                  toast.error('Error al forzar verificación de stock bajo');
                }
              }}
              className="w-full text-left px-2 py-1 text-xs text-orange-600 hover:bg-orange-50 rounded transition-colors font-medium"
            >
              🧹 Forzar verificación (limpia notificaciones)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalType, setModalType] = useState<'role' | 'password' | 'email' | 'profile' | 'stats'>('role');
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const openUserModal = (user: any, type: 'role' | 'password' | 'email' | 'profile' | 'stats') => {
    setSelectedUser(user);
    setModalType(type);
    setFormData({});
    setUserStats(null);
    
    if (type === 'profile') {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
      });
    }
    
    setShowUserModal(true);
  };

  const handleRoleChange = async () => {
    try {
      setIsSubmitting(true);
      await adminService.updateUserRole(selectedUser.id, formData.role);
      toast.success('Rol de usuario actualizado exitosamente');
      setShowUserModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error al actualizar el rol del usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!formData.newPassword || formData.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setIsSubmitting(true);
      await adminService.updateUserPassword(selectedUser.id, formData.newPassword);
      toast.success('Contraseña actualizada exitosamente');
      setShowUserModal(false);
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error al actualizar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = async () => {
    if (!formData.newEmail || !formData.newEmail.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    try {
      setIsSubmitting(true);
      await adminService.updateUserEmail(selectedUser.id, formData.newEmail);
      toast.success('Email actualizado exitosamente');
      setShowUserModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Error al actualizar el email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('Nombre y apellido son obligatorios');
      return;
    }

    try {
      setIsSubmitting(true);
      await adminService.updateUserProfile(selectedUser.id, formData);
      toast.success('Perfil actualizado exitosamente');
      setShowUserModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetEmailVerification = async () => {
    try {
      setIsSubmitting(true);
      await adminService.resetUserEmailVerification(selectedUser.id);
      toast.success('Verificación de email reseteada exitosamente');
      setShowUserModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error resetting email verification:', error);
      toast.error('Error al resetear la verificación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await adminService.getUserStats(selectedUser.id);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
      toast.error('Error al cargar estadísticas del usuario');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await adminService.deleteUser(userId);
        toast.success('Usuario eliminado exitosamente');
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error al eliminar el usuario');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Gestión de Usuarios</h2>
        <div className="text-sm text-gray-500">
          Total: {users.length} usuarios
        </div>
      </div>

      {/* Users Table - Responsive Design */}
      <div className="bg-white rounded-lg shadow">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Teléfono
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.profileImage ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profileImage}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-orange-600">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 truncate" title={user.email}>
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {user.phone || 'No especificado'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.emailVerified ? 'Verificado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => openUserModal(user, 'stats')}
                        className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded bg-blue-50 hover:bg-blue-100"
                        title="Ver estadísticas"
                      >
                        📊
                      </button>
                      <button
                        onClick={() => openUserModal(user, 'profile')}
                        className="text-green-600 hover:text-green-900 text-xs px-2 py-1 rounded bg-green-50 hover:bg-green-100"
                        title="Editar perfil"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => openUserModal(user, 'email')}
                        className="text-purple-600 hover:text-purple-900 text-xs px-2 py-1 rounded bg-purple-50 hover:bg-purple-100"
                        title="Cambiar email"
                      >
                        📧
                      </button>
                      <button
                        onClick={() => openUserModal(user, 'password')}
                        className="text-orange-600 hover:text-orange-900 text-xs px-2 py-1 rounded bg-orange-50 hover:bg-orange-100"
                        title="Cambiar contraseña"
                      >
                        🔒
                      </button>
                      <button
                        onClick={() => openUserModal(user, 'role')}
                        className="text-indigo-600 hover:text-indigo-900 text-xs px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100"
                        title="Cambiar rol"
                      >
                        👤
                      </button>
                      {!user.emailVerified && (
                        <button
                          onClick={handleResetEmailVerification}
                          className="text-yellow-600 hover:text-yellow-900 text-xs px-2 py-1 rounded bg-yellow-50 hover:bg-yellow-100"
                          title="Resetear verificación"
                        >
                          🔄
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                        disabled={user.role === 'admin'}
                        title="Eliminar usuario"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          <div className="space-y-4 p-4">
            {users.map((user) => (
              <div key={user.id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      {user.profileImage ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={user.profileImage}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-600">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.emailVerified ? 'Verificado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Teléfono:</span> {user.phone || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Fecha:</span> {new Date(user.createdAt).toLocaleDateString('es-AR')}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => openUserModal(user, 'stats')}
                    className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded bg-blue-50 hover:bg-blue-100"
                    title="Ver estadísticas"
                  >
                    📊
                  </button>
                  <button
                    onClick={() => openUserModal(user, 'profile')}
                    className="text-green-600 hover:text-green-900 text-xs px-2 py-1 rounded bg-green-50 hover:bg-green-100"
                    title="Editar perfil"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => openUserModal(user, 'email')}
                    className="text-purple-600 hover:text-purple-900 text-xs px-2 py-1 rounded bg-purple-50 hover:bg-purple-100"
                    title="Cambiar email"
                  >
                    📧
                  </button>
                  <button
                    onClick={() => openUserModal(user, 'password')}
                    className="text-orange-600 hover:text-orange-900 text-xs px-2 py-1 rounded bg-orange-50 hover:bg-orange-100"
                    title="Cambiar contraseña"
                  >
                    🔒
                  </button>
                  <button
                    onClick={() => openUserModal(user, 'role')}
                    className="text-indigo-600 hover:text-indigo-900 text-xs px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100"
                    title="Cambiar rol"
                  >
                    👤
                  </button>
                  {!user.emailVerified && (
                    <button
                      onClick={handleResetEmailVerification}
                      className="text-yellow-600 hover:text-yellow-900 text-xs px-2 py-1 rounded bg-yellow-50 hover:bg-yellow-100"
                      title="Resetear verificación"
                    >
                      🔄
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                    disabled={user.role === 'admin'}
                    title="Eliminar usuario"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalType === 'role' && 'Cambiar Rol de Usuario'}
                  {modalType === 'password' && 'Cambiar Contraseña'}
                  {modalType === 'email' && 'Cambiar Email'}
                  {modalType === 'profile' && 'Editar Perfil'}
                  {modalType === 'stats' && 'Estadísticas del Usuario'}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* User Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Usuario:</strong> {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Rol:</strong> {selectedUser.role === 'admin' ? 'Administrador' : 'Usuario'}
                </p>
              </div>

              {/* Modal Content */}
              {modalType === 'role' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo Rol</label>
                  <select
                    value={formData.role || selectedUser.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              )}

              {modalType === 'password' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={formData.newPassword || ''}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    La nueva contraseña será enviada al usuario por email
                  </p>
                </div>
              )}

              {modalType === 'email' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo Email</label>
                  <input
                    type="email"
                    value={formData.newEmail || ''}
                    onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="nuevo@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El usuario deberá verificar el nuevo email
                  </p>
                </div>
              )}

              {modalType === 'profile' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                    <input
                      type="text"
                      value={formData.lastName || ''}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="+54 9 261 123-4567"
                    />
                  </div>
                </div>
              )}

              {modalType === 'stats' && (
                <div>
                  {!userStats ? (
                    <button
                      onClick={loadUserStats}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Cargar Estadísticas
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">Total Pedidos</p>
                          <p className="text-lg font-bold text-blue-900">{userStats.stats.totalOrders}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-green-800">Total Gastado</p>
                          <p className="text-lg font-bold text-green-900">{formatCurrency(userStats.stats.totalSpent)}</p>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">Total Reseñas</p>
                        <p className="text-lg font-bold text-purple-900">{userStats.stats.totalReviews}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              {modalType !== 'stats' && (
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (modalType === 'role') handleRoleChange();
                      if (modalType === 'password') handlePasswordChange();
                      if (modalType === 'email') handleEmailChange();
                      if (modalType === 'profile') handleProfileUpdate();
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Products Tab Component
function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'dulces',
    images: [''],
    ingredients: '',
    weight: '',
    allergens: '',
    nutritionalInfo: '',
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== '')
      };
      
      await adminService.createProduct(productData);
      toast.success('Producto agregado exitosamente');
      setShowAddModal(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al agregar el producto');
    }
  };

  const handleEditProduct = async () => {
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== '')
      };
      
      await adminService.updateProduct(selectedProduct.id, productData);
      toast.success('Producto actualizado exitosamente');
      setShowEditModal(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await adminService.deleteProduct(productId);
        toast.success('Producto eliminado exitosamente');
        loadProducts();
      } catch (error: any) {
        console.error('Error deleting product:', error);
        
        // Mostrar el mensaje de error específico del backend
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Error al eliminar el producto');
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'dulces',
      images: [''],
      ingredients: '',
      weight: '',
      allergens: '',
      nutritionalInfo: '',
      isActive: true,
      isFeatured: false
    });
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      images: product.images.length > 0 ? product.images : [''],
      ingredients: product.ingredients || '',
      weight: product.weight || '',
      allergens: product.allergens || '',
      nutritionalInfo: product.nutritionalInfo || '',
      isActive: product.isActive,
      isFeatured: product.isFeatured
    });
    setShowEditModal(true);
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImageField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Gestión de Productos</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 text-white px-3 py-1.5 rounded-md hover:bg-orange-700 transition-colors flex items-center space-x-2 text-sm"
        >
          <Package className="w-4 h-4" />
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-lg object-cover"
                        src={product.images?.[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.description.substring(0, 40)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  ${product.price}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {product.stock}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-orange-600 hover:text-orange-900 text-xs"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900 text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Nuevo Producto</h3>
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                addImageField={addImageField}
                removeImageField={removeImageField}
                updateImageField={updateImageField}
                onSubmit={handleAddProduct}
                onCancel={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Producto</h3>
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                addImageField={addImageField}
                removeImageField={removeImageField}
                updateImageField={updateImageField}
                onSubmit={handleEditProduct}
                onCancel={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Product Form Component
function ProductForm({ 
  formData, 
  setFormData, 
  addImageField, 
  removeImageField, 
  updateImageField, 
  onSubmit, 
  onCancel 
}: {
  formData: any;
  setFormData: (data: any) => void;
  addImageField: () => void;
  removeImageField: (index: number) => void;
  updateImageField: (index: number, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="dulces">Dulces</option>
            <option value="postres">Postres</option>
            <option value="bebidas">Bebidas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
        <textarea
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Peso</label>
          <input
            type="text"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="ej: 250g"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alérgenos</label>
          <input
            type="text"
            value={formData.allergens}
            onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="ej: Gluten, Lactosa"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Información Nutricional</label>
        <textarea
          value={formData.nutritionalInfo}
          onChange={(e) => setFormData({ ...formData, nutritionalInfo: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Información nutricional del producto"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes del Producto</label>
        <div className="space-y-4">
          {formData.images.map((image: string, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Imagen {index + 1}</span>
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              
              {image ? (
                <div className="space-y-3">
                  <img
                    src={image}
                    alt={`Producto ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateImageField(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="URL de la imagen"
                  />
                </div>
              ) : (
                <ImageUpload
                  onImageUploaded={(imageUrl) => updateImageField(index, imageUrl)}
                  label={`Subir imagen ${index + 1}`}
                />
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addImageField}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors"
          >
            + Agregar otra imagen
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="ml-2 text-sm text-gray-700">Producto Activo</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="ml-2 text-sm text-gray-700">Producto Destacado</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

// Orders Tab Component
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedProof, setSelectedProof] = useState<string>('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Error al cargar los pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success('Estado del pedido actualizado exitosamente');
      setShowStatusModal(false);
      loadOrders();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el estado del pedido';
      toast.error(errorMessage);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.')) {
      try {
        await adminService.deleteOrder(orderId);
        toast.success('Pedido eliminado exitosamente');
        loadOrders();
      } catch (error: any) {
        console.error('Error deleting order:', error);
        const errorMessage = error.response?.data?.message || 'Error al eliminar el pedido';
        toast.error(errorMessage);
      }
    }
  };

  const openStatusModal = (order: any) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const openProofModal = (proofUrl: string) => {
    setSelectedProof(proofUrl);
    setShowProofModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
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
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Gestión de Pedidos</h2>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Número
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Cliente
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Pago
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.orderNumber}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.user?.firstName} {order.user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email}
                  </div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${order.total}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus === 'paid' ? 'Pagado' :
                     order.paymentStatus === 'failed' ? 'Fallido' :
                     'Pendiente'}
                  </span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openStatusModal(order)}
                      className="text-orange-600 hover:text-orange-900 text-xs"
                    >
                      Estado
                    </button>
                    {order.paymentProof && (
                      <button
                        onClick={() => openProofModal(order.paymentProof)}
                        className="text-blue-600 hover:text-blue-900 text-xs"
                        title="Ver comprobante de pago"
                      >
                        Comprobante
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-red-600 hover:text-red-900 text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Cambiar Estado</h3>
              <div className="mb-3 text-sm text-gray-600">
                <p>Pedido: <span className="font-medium">#{selectedOrder.orderNumber}</span></p>
                <p>Total: <span className="font-medium">${selectedOrder.total}</span></p>
              </div>
              <div className="mb-4">
                <select
                  defaultValue={selectedOrder.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    try {
                      await handleStatusChange(selectedOrder.id, newStatus);
                      // Si el estado es "confirmed" y hay comprobante, marcar pago como pagado
                      if (newStatus === 'confirmed' && selectedOrder.paymentProof && selectedOrder.paymentStatus === 'pending') {
                        await adminService.updateOrderPaymentStatus(selectedOrder.id, 'paid');
                        toast.success('Estado y pago actualizados exitosamente');
                      }
                    } catch (error) {
                      console.error('Error updating order:', error);
                    }
                  }}
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-3 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      {showProofModal && selectedProof && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Comprobante de Pago</h3>
                <button
                  onClick={() => setShowProofModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src={selectedProof}
                  alt="Comprobante de pago"
                  className="max-w-full max-h-96 rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';
                  }}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowProofModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reviews Tab Component
function ReviewsTab() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Error al cargar las reseñas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer.')) {
      try {
        await adminService.deleteReview(reviewId);
        toast.success('Reseña eliminada exitosamente');
        loadReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Error al eliminar la reseña');
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Gestión de Reseñas</h2>

      {/* Reviews Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calificación
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comentario
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      {review.user?.profileImage ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={review.user.profileImage}
                          alt={`${review.user.firstName} ${review.user.lastName}`}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-orange-600">
                            {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {review.user?.firstName} {review.user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {review.user?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-lg object-cover"
                        src={review.product?.images?.[0] || '/placeholder-product.jpg'}
                        alt={review.product?.name}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {review.product?.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="text-xs text-gray-900">({review.rating}/5)</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {review.comment}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {new Date(review.createdAt).toLocaleDateString('es-AR')}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-600 hover:text-red-900 text-xs"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8">
          <Star className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reseñas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aún no se han publicado reseñas en la plataforma.
          </p>
        </div>
      )}
    </div>
  );
}

// Support Tab Component
function SupportTab() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'active'>('active');

  useEffect(() => {
    loadTickets();
    loadStats();
  }, []);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await supportService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Error al cargar tickets de soporte');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await supportService.getTicketStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await supportService.updateTicketStatus(ticketId, newStatus);
      toast.success('Estado actualizado exitosamente');
      loadTickets();
      loadStats();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const handleAddResponse = async () => {
    if (!selectedTicket || !responseText.trim()) return;
    
    try {
      await supportService.addAdminResponse(selectedTicket.id, responseText);
      toast.success('Respuesta agregada exitosamente');
      setShowResponseModal(false);
      setResponseText('');
      setSelectedTicket(null);
      loadTickets();
    } catch (error) {
      console.error('Error adding response:', error);
      toast.error('Error al agregar respuesta');
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ticket? Esta acción no se puede deshacer.')) {
      try {
        await supportService.deleteTicket(ticketId);
        toast.success('Ticket eliminado exitosamente');
        loadTickets();
        loadStats();
      } catch (error) {
        console.error('Error deleting ticket:', error);
        toast.error('Error al eliminar el ticket');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'urgent': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'active') {
      return ticket.status === 'open' || ticket.status === 'in_progress';
    }
    return true; // 'all' - mostrar todos
  });



  if (isLoading) {
    return (
      <div className="p-4">
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
    <div className="p-4 max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Gestión de Soporte</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filtro:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active')}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="active">Activos</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Total Tickets</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Abiertos</p>
                <p className="text-lg font-bold text-blue-600">{stats.open}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">En Progreso</p>
                <p className="text-lg font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Resueltos</p>
                <p className="text-lg font-bold text-green-600">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tickets Table - Responsive Design */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Tickets de Soporte</h3>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título/Descripción
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Prioridad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {ticket.user?.profileImage ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={ticket.user.profileImage}
                            alt={ticket.userName || 'Usuario'}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {ticket.userName?.[0] || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {ticket.userName || `${ticket.user?.firstName} ${ticket.user?.lastName}`}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {ticket.userEmail || ticket.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 font-medium line-clamp-2">{ticket.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{ticket.description}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs text-gray-600 capitalize">
                      {ticket.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(ticket.status)}`}
                    >
                      <option value="open">Abierto</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="closed">Cerrado</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowResponseModal(true);
                        }}
                        className="text-orange-600 hover:text-orange-900 text-xs"
                      >
                        Responder
                      </button>
                      <a
                        href={`mailto:${ticket.userEmail || ticket.user?.email}?subject=Re: ${ticket.title}`}
                        className="text-blue-600 hover:text-blue-900 text-xs"
                      >
                        Email
                      </a>
                      <button
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="text-red-600 hover:text-red-900 text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-shrink-0 h-8 w-8">
                    {ticket.user?.profileImage ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={ticket.user.profileImage}
                        alt={ticket.userName || 'Usuario'}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {ticket.userName?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {ticket.userName || `${ticket.user?.firstName} ${ticket.user?.lastName}`}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {ticket.userEmail || ticket.user?.email}
                    </div>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-900 mb-1">{ticket.title}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{ticket.description}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-600 capitalize">
                    {ticket.category.replace('_', ' ')}
                  </span>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                    className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(ticket.status)}`}
                  >
                    <option value="open">Abierto</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="resolved">Resuelto</option>
                    <option value="closed">Cerrado</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowResponseModal(true);
                    }}
                    className="text-orange-600 hover:text-orange-900 text-xs"
                  >
                    Responder
                  </button>
                  <a
                    href={`mailto:${ticket.userEmail || ticket.user?.email}?subject=Re: ${ticket.title}`}
                    className="text-blue-600 hover:text-blue-900 text-xs"
                  >
                    Email
                  </a>
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="text-red-600 hover:text-red-900 text-xs"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                {new Date(ticket.createdAt).toLocaleDateString('es-AR')}
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* No tickets message */}
      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {filter === 'active' ? 'No hay tickets activos' : 'No hay tickets'}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {filter === 'active' 
              ? 'Todos los tickets están resueltos o cerrados.'
              : 'No se han creado tickets de soporte aún.'
            }
          </p>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Responder Ticket</h3>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseText('');
                    setSelectedTicket(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{selectedTicket.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{selectedTicket.description}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu Respuesta
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Escribe tu respuesta aquí..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseText('');
                    setSelectedTicket(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddResponse}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Enviar Respuesta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Contact Tab Component
function ContactTab() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Mensajes de Contacto</h2>
      </div>
      
      <AdminContactMessages />
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
      </div>

      {/* Estado de la Página */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Página en Desarrollo
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Los analytics estarán disponibles una vez que la página esté activa y comience a recibir tráfico real.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Principales - Vacías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Tasa de Conversión</p>
              <p className="text-lg font-bold text-gray-400">--</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Valor Promedio</p>
              <p className="text-lg font-bold text-gray-400">--</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Retención</p>
              <p className="text-lg font-bold text-gray-400">--</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Ventas Totales</p>
              <p className="text-lg font-bold text-gray-400">--</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <ShoppingCart className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y Tablas - Vacíos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos Más Vendidos */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Productos Más Vendidos</h3>
          <div className="text-center py-8">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sin datos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Los productos más vendidos aparecerán aquí una vez que comiences a recibir pedidos.
            </p>
          </div>
        </div>

        {/* Crecimiento de Usuarios */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Crecimiento de Usuarios</h3>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sin datos</h3>
            <p className="mt-1 text-sm text-gray-500">
              El crecimiento de usuarios se mostrará aquí una vez que tengas usuarios registrados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reports Tab Component
function ReportsTab() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const generateReport = async (reportType: string) => {
    setIsLoading(true);
    setActiveReport(reportType);
    
    try {
      let data;
      switch (reportType) {
        case 'sales':
          data = await reportsService.getSalesReport(dateRange.startDate, dateRange.endDate);
          break;
        case 'inventory':
          data = await reportsService.getInventoryReport();
          break;
        case 'customers':
          data = await reportsService.getCustomersReport();
          break;
        case 'revenue':
          data = await reportsService.getRevenueReport(dateRange.startDate, dateRange.endDate);
          break;
        case 'general':
          data = await reportsService.getGeneralReport();
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }
      setReportData(data);
      toast.success('Reporte generado exitosamente');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error al generar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-AR');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">📊 Reportes y Analytics</h2>
            <p className="text-gray-600">Genera reportes detallados para tomar decisiones informadas</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Desde:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Hasta:</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold text-gray-900">Reporte de Ventas</h3>
              <p className="text-sm text-gray-600">Análisis detallado de ventas por período</p>
            </div>
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Disponible
            </span>
          </div>
          <button
            onClick={() => generateReport('sales')}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 font-medium shadow-md hover:shadow-lg"
          >
            {isLoading && activeReport === 'sales' ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </div>
            ) : (
              'Generar Reporte'
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold text-gray-900">Reporte de Inventario</h3>
              <p className="text-sm text-gray-600">Estado actual del inventario y productos</p>
            </div>
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Disponible
            </span>
          </div>
          <button
            onClick={() => generateReport('inventory')}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 font-medium shadow-md hover:shadow-lg"
          >
            {isLoading && activeReport === 'inventory' ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </div>
            ) : (
              'Generar Reporte'
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold text-gray-900">Reporte de Clientes</h3>
              <p className="text-sm text-gray-600">Análisis de comportamiento de clientes</p>
            </div>
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              Disponible
            </span>
          </div>
          <button
            onClick={() => generateReport('customers')}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 font-medium shadow-md hover:shadow-lg"
          >
            {isLoading && activeReport === 'customers' ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </div>
            ) : (
              'Generar Reporte'
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold text-gray-900">Reporte de Ingresos</h3>
              <p className="text-sm text-gray-600">Análisis de ingresos y rentabilidad</p>
            </div>
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
              Disponible
            </span>
          </div>
          <button
            onClick={() => generateReport('revenue')}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 disabled:opacity-50 font-medium shadow-md hover:shadow-lg"
          >
            {isLoading && activeReport === 'revenue' ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </div>
            ) : (
              'Generar Reporte'
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold text-gray-900">Reporte General</h3>
              <p className="text-sm text-gray-600">Resumen completo de todos los datos</p>
            </div>
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
              Disponible
            </span>
          </div>
          <button
            onClick={() => generateReport('general')}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 font-medium shadow-md hover:shadow-lg"
          >
            {isLoading && activeReport === 'general' ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </div>
            ) : (
              'Generar Reporte'
            )}
          </button>
        </div>
      </div>

      {/* Resultados del Reporte */}
      {reportData && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {activeReport === 'sales' && '📈 Reporte de Ventas'}
                {activeReport === 'inventory' && '📦 Reporte de Inventario'}
                {activeReport === 'customers' && '👥 Reporte de Clientes'}
                {activeReport === 'revenue' && '💰 Reporte de Ingresos'}
                {activeReport === 'general' && '📊 Reporte General'}
              </h3>
              <p className="text-gray-600">
                Generado el {new Date().toLocaleDateString('es-AR')} a las {new Date().toLocaleTimeString('es-AR')}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                🖨️ Imprimir
              </button>
              <button
                onClick={() => setReportData(null)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                ✕ Cerrar
              </button>
            </div>
          </div>

          {/* Reporte de Ventas */}
          {activeReport === 'sales' && reportData.summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Total Ventas</h4>
                      <p className="text-3xl font-bold text-blue-900">{formatCurrency(reportData.summary.totalSales)}</p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-green-800 mb-1">Total Pedidos</h4>
                      <p className="text-3xl font-bold text-green-900">{reportData.summary.totalOrders}</p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">Pedidos Completados</h4>
                      <p className="text-3xl font-bold text-yellow-900">{reportData.summary.completedOrders}</p>
                    </div>
                    <div className="p-3 bg-yellow-500 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-red-800 mb-1">Pedidos Pendientes</h4>
                      <p className="text-3xl font-bold text-red-900">{reportData.summary.pendingOrders}</p>
                    </div>
                    <div className="p-3 bg-red-500 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {reportData.topProducts && reportData.topProducts.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900">🏆 Productos Más Vendidos</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.topProducts.map((product: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reporte de Inventario */}
          {activeReport === 'inventory' && reportData.summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800">Total Productos</h4>
                  <p className="text-2xl font-bold text-blue-900">{reportData.summary.totalProducts}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800">Stock Bajo</h4>
                  <p className="text-2xl font-bold text-red-900">{reportData.summary.lowStockProducts}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-orange-800">Sin Stock</h4>
                  <p className="text-2xl font-bold text-orange-900">{reportData.summary.outOfStockProducts}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800">Valor Total</h4>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(reportData.summary.totalStockValue)}</p>
                </div>
              </div>

              {reportData.lowStockProducts && reportData.lowStockProducts.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Productos con Stock Bajo</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.lowStockProducts.map((product: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reporte de Clientes */}
          {activeReport === 'customers' && reportData.summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800">Total Clientes</h4>
                  <p className="text-2xl font-bold text-blue-900">{reportData.summary.totalCustomers}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800">Clientes Activos</h4>
                  <p className="text-2xl font-bold text-green-900">{reportData.summary.activeCustomers}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-800">Nuevos Este Mes</h4>
                  <p className="text-2xl font-bold text-purple-900">{reportData.summary.newCustomersThisMonth}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-800">Promedio Pedidos</h4>
                  <p className="text-2xl font-bold text-yellow-900">{reportData.summary.averageOrdersPerCustomer.toFixed(1)}</p>
                </div>
              </div>

              {reportData.topCustomers && reportData.topCustomers.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Mejores Clientes</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gastado</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.topCustomers.map((customer: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.totalOrders}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(customer.totalSpent)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reporte de Ingresos */}
          {activeReport === 'revenue' && reportData.summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800">Total Ingresos</h4>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(reportData.summary.totalRevenue)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800">Total Pedidos</h4>
                  <p className="text-2xl font-bold text-blue-900">{reportData.summary.totalOrders}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-800">Promedio por Pedido</h4>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(reportData.summary.averageOrderValue)}</p>
                </div>
              </div>

              {reportData.paymentMethodRevenue && reportData.paymentMethodRevenue.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Ingresos por Método de Pago</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.paymentMethodRevenue.map((method: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {method.method === 'mercado_pago' ? 'Mercado Pago' : 'Efectivo'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(method.revenue)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{method.orders}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{method.percentage.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reporte General */}
          {activeReport === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ventas */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-blue-900 mb-3">Resumen de Ventas</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-800">Total: {formatCurrency(reportData.sales.summary.totalSales)}</p>
                    <p className="text-sm text-blue-800">Pedidos: {reportData.sales.summary.totalOrders}</p>
                    <p className="text-sm text-blue-800">Completados: {reportData.sales.summary.completedOrders}</p>
                  </div>
                </div>

                {/* Inventario */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-green-900 mb-3">Resumen de Inventario</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-green-800">Productos: {reportData.inventory.summary.totalProducts}</p>
                    <p className="text-sm text-green-800">Stock Bajo: {reportData.inventory.summary.lowStockProducts}</p>
                    <p className="text-sm text-green-800">Valor: {formatCurrency(reportData.inventory.summary.totalStockValue)}</p>
                  </div>
                </div>

                {/* Clientes */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-purple-900 mb-3">Resumen de Clientes</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-purple-800">Total: {reportData.customers.summary.totalCustomers}</p>
                    <p className="text-sm text-purple-800">Activos: {reportData.customers.summary.activeCustomers}</p>
                    <p className="text-sm text-purple-800">Nuevos: {reportData.customers.summary.newCustomersThisMonth}</p>
                  </div>
                </div>

                {/* Ingresos */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-orange-900 mb-3">Resumen de Ingresos</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-orange-800">Total: {formatCurrency(reportData.revenue.summary.totalRevenue)}</p>
                    <p className="text-sm text-orange-800">Pedidos: {reportData.revenue.summary.totalOrders}</p>
                    <p className="text-sm text-orange-800">Promedio: {formatCurrency(reportData.revenue.summary.averageOrderValue)}</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 text-center">
                Reporte generado el {formatDate(reportData.generatedAt)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estado vacío */}
      {!reportData && !isLoading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un reporte</h3>
          <p className="text-gray-600">Elige uno de los reportes disponibles arriba para comenzar a analizar tus datos</p>
        </div>
      )}
    </div>
  );
}

// Settings Tab Component
function SettingsTab() {
  const [settings, setSettings] = useState({
    storeName: 'Dulce Twilight',
    storeEmail: 'dulcetwilightdc2609@gmail.com',
    storePhone: '+54 9 261 123-4567',
    storeAddress: 'Mendoza, Argentina',
    currency: 'ARS',
    timezone: 'America/Argentina/Mendoza',
    logoUrl: '',
    heroImageUrl: '',
    notifications: {
      newOrders: true,
      lowStock: true,
      customerReviews: true,
      systemAlerts: true
    },
    maintenance: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  useEffect(() => {
    loadSystemConfig();
  }, []);

  const loadSystemConfig = async () => {
    try {
      setIsLoadingConfig(true);
      const config = await configService.getSystemConfig();
      setSettings(prev => ({
        ...prev,
        storeName: config.storeName,
        storeEmail: config.storeEmail,
        storePhone: config.storePhone,
        storeAddress: config.storeAddress,
        currency: config.currency,
        timezone: config.timezone,
        logoUrl: config.logoUrl || '',
        heroImageUrl: config.heroImageUrl || '',
        maintenance: config.maintenanceMode
      }));
    } catch (error) {
      console.error('Error loading system config:', error);
      toast.error('Error al cargar la configuración del sistema');
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handleMaintenanceModeChange = async (enabled: boolean) => {
    try {
      setIsLoading(true);
      await configService.setMaintenanceMode(enabled);
      setSettings(prev => ({ ...prev, maintenance: enabled }));
      toast.success(`Modo mantenimiento ${enabled ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      console.error('Error changing maintenance mode:', error);
      toast.error('Error al cambiar el modo mantenimiento');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      await configService.updateSystemConfig({
        storeName: settings.storeName,
        storeEmail: settings.storeEmail,
        storePhone: settings.storePhone,
        storeAddress: settings.storeAddress,
        currency: settings.currency,
        timezone: settings.timezone,
        logoUrl: settings.logoUrl,
      });
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingConfig) {
    return (
      <div className="p-4">
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
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Configuración del Sistema</h2>

      <div className="space-y-6">
        {/* Información de la Tienda */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Información de la Tienda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de la Tienda</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => handleSettingChange('storeName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleSettingChange('storeEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={settings.storePhone}
                onChange={(e) => handleSettingChange('storePhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                value={settings.storeAddress}
                onChange={(e) => handleSettingChange('storeAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Logo del Sitio */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Logo del Sitio</h3>
          <LogoUpload
            onLogoUploaded={(logoUrl) => {
              handleSettingChange('logoUrl', logoUrl);
              toast.success('Logo actualizado. Recuerda guardar la configuración.');
            }}
            currentLogo={settings.logoUrl || ''}
            label=""
            className="max-w-md"
          />
        </div>

        {/* Imagen Principal del Sitio */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Imagen Principal del Sitio</h3>
          <HeroImageUpload
            onImageUploaded={(heroImageUrl) => {
              handleSettingChange('heroImageUrl', heroImageUrl);
              toast.success('Imagen principal actualizada exitosamente.');
            }}
            currentImage={settings.heroImageUrl || ''}
            label=""
            className="max-w-md"
          />
        </div>

        {/* Configuración del Sistema */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Configuración del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Moneda</label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled
              >
                <option value="ARS">Peso Argentino (ARS)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Solo se trabaja con pesos argentinos</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Zona Horaria</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="America/Argentina/Mendoza">Mendoza (GMT-3)</option>
                <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Notificaciones</h3>
          <div className="space-y-3">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleNotificationChange(key, e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {key === 'newOrders' && 'Nuevos pedidos'}
                  {key === 'lowStock' && 'Stock bajo'}
                  {key === 'customerReviews' && 'Reseñas de clientes'}
                  {key === 'systemAlerts' && 'Alertas del sistema'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Modo Mantenimiento */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Modo Mantenimiento</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Activar modo mantenimiento</p>
              <p className="text-xs text-gray-500">La tienda no estará disponible para los clientes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenance}
                onChange={(e) => handleMaintenanceModeChange(e.target.checked)}
                disabled={isLoading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 disabled:opacity-50"></div>
            </label>
          </div>
          {isLoading && (
            <p className="text-xs text-gray-500 mt-2">Actualizando...</p>
          )}
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Notifications Tab Component
function NotificationsTab() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    loadStats();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Error al cargar las notificaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await notificationsService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading notification stats:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      toast.success('Notificación marcada como leída');
      loadNotifications();
      loadStats();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Error al marcar notificación como leída');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      toast.success('Todas las notificaciones marcadas como leídas');
      loadNotifications();
      loadStats();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Error al marcar todas las notificaciones como leídas');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
      try {
        await notificationsService.delete(id);
        toast.success('Notificación eliminada');
        loadNotifications();
        loadStats();
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error('Error al eliminar la notificación');
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Package className="w-5 h-5 text-yellow-500" />;
      case 'new_order':
        return <ShoppingCart className="w-5 h-5 text-blue-500" />;
      case 'new_review':
        return <Star className="w-5 h-5 text-green-500" />;
      case 'maintenance_mode':
        return <Settings className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'new_order':
        return 'border-l-blue-500 bg-blue-50';
      case 'new_review':
        return 'border-l-green-500 bg-green-50';
      case 'maintenance_mode':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Notificaciones</h2>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-orange-600 hover:text-orange-800"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">No Leídas</p>
                <p className="text-lg font-bold text-yellow-600">{stats.unread}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Leídas</p>
                <p className="text-lg font-bold text-green-600">{stats.read}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-l-4 p-4 rounded-r-lg ${getNotificationColor(notification.type)} ${
                !notification.isRead ? 'border-l-4' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-orange-600 hover:text-orange-800"
                    >
                      Marcar como leída
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bell className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Sin notificaciones</h3>
          <p className="mt-2 text-sm text-gray-500">
            No hay notificaciones pendientes. Las notificaciones aparecerán automáticamente cuando:
          </p>
          <div className="mt-4 max-w-md mx-auto">
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 mr-2 text-blue-500" />
                Recibas nuevos pedidos
              </li>
              <li className="flex items-center justify-center">
                <Package className="w-4 h-4 mr-2 text-yellow-500" />
                Tengas productos con stock bajo
              </li>
              <li className="flex items-center justify-center">
                <Star className="w-4 h-4 mr-2 text-green-500" />
                Recibas nuevas reseñas
              </li>
              <li className="flex items-center justify-center">
                <Settings className="w-4 h-4 mr-2 text-gray-500" />
                Ocurran eventos del sistema
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Newsletter Tab Component
function NewsletterTab() {
  const [emails, setEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);

  useEffect(() => {
    loadEmails();
    testConnection();
  }, []);

  const loadEmails = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllUserEmails();
      setEmails(data);
    } catch (error) {
      console.error('Error loading emails:', error);
      toast.error('Error al cargar los emails');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const result = await adminService.testEmailConnection();
      setConnectionStatus(result.connected);
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus(false);
    }
  };

  const handleSendToAll = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error('Por favor completa el asunto y contenido');
      return;
    }

    setIsSending(true);
    try {
      const result = await adminService.sendNewsletterToAllUsers(subject, content);
      toast.success(`Newsletter enviado: ${result.successCount} exitosos, ${result.failedCount} fallidos`);
      
      if (result.failedCount > 0) {
        console.log('Emails fallidos:', result.failedEmails);
      }
      
      setSubject('');
      setContent('');
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Error al enviar el newsletter');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendToSpecific = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error('Por favor completa el asunto y contenido');
      return;
    }

    if (selectedEmails.length === 0) {
      toast.error('Por favor selecciona al menos un email');
      return;
    }

    setIsSending(true);
    try {
      const result = await adminService.sendNewsletterToSpecificUsers(selectedEmails, subject, content);
      toast.success(`Newsletter enviado: ${result.successCount} exitosos, ${result.failedCount} fallidos`);
      
      if (result.failedCount > 0) {
        console.log('Emails fallidos:', result.failedEmails);
      }
      
      setSubject('');
      setContent('');
      setSelectedEmails([]);
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Error al enviar el newsletter');
    } finally {
      setIsSending(false);
    }
  };

  const handleEmailToggle = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleSelectAll = () => {
    setSelectedEmails(emails);
  };

  const handleDeselectAll = () => {
    setSelectedEmails([]);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Newsletter</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${connectionStatus === true ? 'bg-green-500' : connectionStatus === false ? 'bg-red-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {connectionStatus === true ? 'Conexión OK' : connectionStatus === false ? 'Error de conexión' : 'Verificando...'}
          </span>
        </div>
      </div>

      {/* Email Connection Status */}
      {connectionStatus === false && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error de conexión de email</h3>
              <p className="text-sm text-red-700 mt-1">
                No se puede conectar con el servidor de email. Verifica la configuración de Gmail.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email List */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Emails de Usuarios ({emails.length})</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSelectAll}
              className="text-sm text-orange-600 hover:text-orange-800"
            >
              Seleccionar todos
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Deseleccionar todos
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : emails.length > 0 ? (
          <div className="max-h-60 overflow-y-auto space-y-2">
            {emails.map((email) => (
              <label key={email} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(email)}
                  onChange={() => handleEmailToggle(email)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">{email}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay usuarios registrados</p>
        )}
      </div>

      {/* Newsletter Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Componer Newsletter</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Asunto del newsletter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Contenido del newsletter (HTML permitido)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes usar HTML básico para formatear el contenido
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSendToAll}
              disabled={isSending || !subject.trim() || !content.trim() || connectionStatus === false}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar a todos ({emails.length})
                </>
              )}
            </button>

            <button
              onClick={handleSendToSpecific}
              disabled={isSending || !subject.trim() || !content.trim() || selectedEmails.length === 0 || connectionStatus === false}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar a seleccionados ({selectedEmails.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Preferences Tab Component
function NotificationPreferencesTab() {
  return (
    <div className="p-6">
      <AdminNotificationPreferences />
    </div>
  );
}


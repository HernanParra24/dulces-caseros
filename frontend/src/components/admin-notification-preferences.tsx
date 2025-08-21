'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Users, Filter, Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminService } from '@/lib/api';

interface UserNotificationPreferences {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  notificationPreferences: {
    emailNewsletter: boolean;
    emailOrders: boolean;
    emailPromotions: boolean;
    emailUpdates: boolean;
  };
}

export function AdminNotificationPreferences() {
  const [users, setUsers] = useState<UserNotificationPreferences[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserNotificationPreferences[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserNotificationPreferences | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterType]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsersNotificationPreferences();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar las preferencias de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo de notificación
    if (filterType !== 'all') {
      filtered = filtered.filter(user => {
        const preferences = user.notificationPreferences as any;
        return preferences[filterType] === true;
      });
    }

    setFilteredUsers(filtered);
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      emailNewsletter: 'Newsletter',
      emailOrders: 'Pedidos',
      emailPromotions: 'Promociones',
      emailUpdates: 'Actualizaciones',
    };
    return labels[type] || type;
  };

  const getNotificationTypeIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      emailNewsletter: Mail,
      emailOrders: Bell,
      emailPromotions: Mail,
      emailUpdates: Bell,
    };
    return icons[type] || Bell;
  };

  const getNotificationTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      emailNewsletter: 'text-blue-600',
      emailOrders: 'text-green-600',
      emailPromotions: 'text-purple-600',
      emailUpdates: 'text-orange-600',
    };
    return colors[type] || 'text-gray-600';
  };

  const getUsersByType = async (type: string) => {
    try {
      const data = await adminService.getUsersByNotificationType(type);
      toast.success(`${data.length} usuarios tienen ${getNotificationTypeLabel(type)} habilitado`);
      return data;
    } catch (error) {
      console.error('Error getting users by type:', error);
      toast.error('Error al obtener usuarios por tipo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Preferencias de Notificaciones</h3>
          <p className="text-sm text-gray-600">
            Gestiona las preferencias de notificaciones por email de los usuarios
          </p>
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Filter by notification type */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos los usuarios</option>
              <option value="emailNewsletter">Newsletter habilitado</option>
              <option value="emailOrders">Pedidos habilitado</option>
              <option value="emailPromotions">Promociones habilitado</option>
              <option value="emailUpdates">Actualizaciones habilitado</option>
            </select>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button
              onClick={() => getUsersByType('emailNewsletter')}
              className="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              Newsletter
            </button>
            <button
              onClick={() => getUsersByType('emailPromotions')}
              className="px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
            >
              Promociones
            </button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Newsletter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promociones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actualizaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.notificationPreferences.emailNewsletter ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.notificationPreferences.emailOrders ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.notificationPreferences.emailPromotions ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.notificationPreferences.emailUpdates ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-orange-600 hover:text-orange-900 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalles
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Preferencias de {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <span className="text-sm text-gray-600">{selectedUser.email}</span>
                </div>
                
                {Object.entries(selectedUser.notificationPreferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {getNotificationTypeLabel(key)}:
                    </span>
                    <div className="flex items-center gap-2">
                      {value ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-600">
                        {value ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
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


'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, DollarSign, Package, Star, Calendar } from 'lucide-react';
import { orderService, favoriteService } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteProducts: number;
  averageRating: number;
  memberSince: string;
  lastOrder: string | null;
}

export function UserStats() {
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    favoriteProducts: 0,
    averageRating: 0,
    memberSince: '',
    lastOrder: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [orders, favorites] = await Promise.all([
        orderService.getMyOrders(),
        favoriteService.getFavorites(),
      ]);

      const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total, 0);
      const averageRating = orders.length > 0 
        ? orders.reduce((sum: number, order: any) => sum + (order.rating || 0), 0) / orders.length 
        : 0;

      setStats({
        totalOrders: orders.length,
        totalSpent,
        favoriteProducts: favorites.length,
        averageRating,
        memberSince: new Date().toLocaleDateString('es-AR', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        lastOrder: orders.length > 0 ? orders[0].createdAt : null,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Pedidos',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Gastado',
      value: formatPrice(stats.totalSpent),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Productos Favoritos',
      value: stats.favoriteProducts.toString(),
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Calificación Promedio',
      value: stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)} ⭐` : 'Sin calificaciones',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Miembro Desde',
      value: stats.memberSince,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Último Pedido',
      value: stats.lastOrder 
        ? new Date(stats.lastOrder).toLocaleDateString('es-AR', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        : 'Sin pedidos',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Package className="w-6 h-6 text-orange-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Mis Estadísticas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium text-gray-600 mb-1 truncate">
                  {stat.title}
                </h3>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg p-4 border border-orange-200"
      >
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Resumen de Actividad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Estado:</span>
            <span className="font-medium text-orange-600">
              {stats.totalOrders >= 10 ? 'Cliente VIP' : 
               stats.totalOrders >= 5 ? 'Cliente Frecuente' : 
               stats.totalOrders >= 1 ? 'Cliente Regular' : 'Nuevo Cliente'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Promedio:</span>
            <span className="font-medium text-orange-600">
              {stats.totalOrders > 0 ? formatPrice(stats.totalSpent / stats.totalOrders) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Favoritos:</span>
            <span className="font-medium text-orange-600">
              {stats.favoriteProducts > 0 ? `${stats.favoriteProducts} productos` : 'Sin favoritos'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


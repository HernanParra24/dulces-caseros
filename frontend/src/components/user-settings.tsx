'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Save, Eye, EyeOff, Bell, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '@/lib/api';

interface UserSettings {
  privacy: {
    shareUsageData: boolean;
  };
  notifications: {
    emailNewsletter: boolean;
    emailOrders: boolean;
    emailPromotions: boolean;
    emailUpdates: boolean;
  };
}

export function UserSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    privacy: {
      shareUsageData: false,
    },
    notifications: {
      emailNewsletter: false,
      emailOrders: false,
      emailPromotions: false,
      emailUpdates: false,
    },
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await userService.getSettings();
      console.log('Settings loaded:', data);
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      // Si no hay configuración guardada, usar valores por defecto
    }
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await userService.updateSettings(settings);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsPasswordLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast.success('Contraseña cambiada exitosamente');
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notificaciones por Email */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-orange-600 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Notificaciones por Email</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 font-medium">Newsletter y novedades</span>
              <p className="text-sm text-gray-500">Recibe ofertas especiales y actualizaciones</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.emailNewsletter || false}
              onChange={(e) => handleNotificationChange('emailNewsletter', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 font-medium">Estado de pedidos</span>
              <p className="text-sm text-gray-500">Notificaciones sobre el estado de tus compras</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.emailOrders || false}
              onChange={(e) => handleNotificationChange('emailOrders', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 font-medium">Promociones y descuentos</span>
              <p className="text-sm text-gray-500">Ofertas exclusivas y cupones de descuento</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.emailPromotions || false}
              onChange={(e) => handleNotificationChange('emailPromotions', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 font-medium">Actualizaciones importantes</span>
              <p className="text-sm text-gray-500">Cambios en políticas y términos de servicio</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.emailUpdates || false}
              onChange={(e) => handleNotificationChange('emailUpdates', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>
      </motion.div>

      {/* Privacidad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-orange-600 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Privacidad</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 font-medium">Compartir datos de uso</span>
              <p className="text-sm text-gray-500">Ayúdanos a mejorar la experiencia</p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy?.shareUsageData || false}
              onChange={(e) => handlePrivacyChange('shareUsageData', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>
      </motion.div>

      {/* Cambiar Contraseña */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center mb-6">
          <Lock className="w-6 h-6 text-orange-600 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Cambiar Contraseña</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ingresa tu contraseña actual"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ingresa tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirma tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <button
            onClick={handlePasswordChange}
            disabled={isPasswordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isPasswordLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Cambiando...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Cambiar Contraseña
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Guardar Configuración */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-6 border-t border-gray-200"
      >
        <button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Configuración
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}


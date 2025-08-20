'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, CheckCircle, Reply, User, Calendar } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { contactService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'react-hot-toast';

interface ContactMessage {
  id: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  status: string;
  createdAt: string;
  respuesta?: string;
  respondedAt?: string;
}

const messageStatuses = [
  { value: 'new', label: 'Nuevo', icon: Clock, color: 'text-blue-600 bg-blue-50' },
  { value: 'read', label: 'Leído', icon: CheckCircle, color: 'text-gray-600 bg-gray-50' },
  { value: 'responded', label: 'Respondido', icon: Reply, color: 'text-green-600 bg-green-50' },
];

export default function MisMensajesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadMyMessages();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadMyMessages = async () => {
    try {
      setIsLoading(true);
      const data = await contactService.getMyMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Error al cargar los mensajes');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return messageStatuses.find(s => s.value === status) || messageStatuses[0];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Requerido</h2>
            <p className="text-gray-500">Debes iniciar sesión para ver tus mensajes de contacto.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mis Mensajes de Contacto</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aquí puedes ver todos los mensajes que has enviado y las respuestas que has recibido de nuestro equipo.
          </p>
        </motion.div>

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {messages.length > 0 ? (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{message.asunto}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(message.status).color}`}>
                          {getStatusInfo(message.status).label}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{message.mensaje}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {message.nombre}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(message.createdAt).toLocaleDateString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {message.respuesta && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center mb-2">
                        <Reply className="w-4 h-4 text-blue-600 mr-2" />
                        <h4 className="font-medium text-blue-900">Respuesta del Equipo:</h4>
                      </div>
                      <p className="text-blue-800 text-sm mb-2">{message.respuesta}</p>
                      {message.respondedAt && (
                        <p className="text-blue-600 text-xs">
                          Respondido el {new Date(message.respondedAt).toLocaleDateString('es-AR')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes mensajes de contacto</h3>
              <p className="text-gray-500">Envía tu primer mensaje desde la página de contacto cuando necesites ayuda.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

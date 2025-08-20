'use client';

import { useState, useEffect } from 'react';
import { Mail, Eye, MessageSquare, Trash2, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '@/lib/api';

interface ContactMessage {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  status: 'new' | 'read' | 'responded' | 'closed';
  respuesta?: string;
  createdAt: string;
  respondedAt?: string;
  formattedCreatedAt: string;
}

interface ContactStats {
  total: number;
  new: number;
  read: number;
  responded: number;
}

export function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactStats>({ total: 0, new: 0, read: 0, responded: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [response, setResponse] = useState('');
  const [responding, setResponding] = useState(false);

  const fetchMessages = async () => {
    try {
      const data = await contactService.getAllMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los mensajes');
    }
  };

  const fetchStats = async () => {
    try {
      const data = await contactService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchStats();
    setLoading(false);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await contactService.markAsRead(id);
      toast.success('Mensaje marcado como leido');
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al marcar como leido');
    }
  };

  const sendResponse = async (id: string) => {
    if (!response.trim()) {
      toast.error('Por favor escribe una respuesta');
      return;
    }

    setResponding(true);
    try {
      await contactService.respond(id, response);
      toast.success('Respuesta enviada exitosamente');
      setResponse('');
      setSelectedMessage(null);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar respuesta');
    } finally {
      setResponding(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('¿Estas seguro de que quieres eliminar este mensaje?')) return;

    try {
      await contactService.deleteMessage(id);
      toast.success('Mensaje eliminado');
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar mensaje');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'read':
        return <Eye className="w-4 h-4 text-gray-500" />;
      case 'responded':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Nuevo';
      case 'read':
        return 'Leido';
      case 'responded':
        return 'Respondido';
      case 'closed':
        return 'Cerrado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadisticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Mail className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Nuevos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-gray-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Leidos</p>
              <p className="text-2xl font-bold text-gray-600">{stats.read}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Respondidos</p>
              <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de mensajes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Mensajes de Contacto</h3>
        </div>
        
        {messages.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay mensajes de contacto
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div key={message.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{message.nombre}</h4>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(message.status)}
                        <span className="text-sm text-gray-500">{getStatusText(message.status)}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Email: {message.email}</p>
                        {message.telefono && (
                          <p className="text-sm text-gray-600">Telefono: {message.telefono}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Asunto: {message.asunto}</p>
                        <p className="text-sm text-gray-600">Fecha: {message.formattedCreatedAt}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Mensaje:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{message.mensaje}</p>
                    </div>
                    
                    {message.respuesta && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Respuesta:</p>
                        <p className="text-sm text-gray-600 bg-green-50 p-3 rounded">{message.respuesta}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {message.status === 'new' && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Marcar como leido"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    
                    {message.status !== 'responded' && (
                      <button
                        onClick={() => setSelectedMessage(message)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Responder"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de respuesta */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Responder a {selectedMessage.nombre}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respuesta:
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Escribe tu respuesta..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  setResponse('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => sendResponse(selectedMessage.id)}
                disabled={responding}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                {responding ? 'Enviando...' : 'Enviar Respuesta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

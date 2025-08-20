'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, AlertCircle, CheckCircle, Clock, X, Plus, Edit, Trash, Loader2 } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { supportService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'react-hot-toast';
import { ChatWidget } from '@/components/chat-widget';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  adminResponse?: string;
  resolvedAt?: string;
}

const ticketCategories = [
  { value: 'order_issue', label: 'Problema con Pedido', icon: AlertCircle },
  { value: 'payment_problem', label: 'Problema de Pago', icon: AlertCircle },
  { value: 'technical_issue', label: 'Problema Técnico', icon: AlertCircle },
  { value: 'product_question', label: 'Consulta sobre Producto', icon: HelpCircle },
  { value: 'account_issue', label: 'Problema de Cuenta', icon: AlertCircle },
  { value: 'other', label: 'Otro', icon: HelpCircle },
];

const ticketPriorities = [
  { value: 'low', label: 'Baja', color: 'text-green-600 bg-green-50' },
  { value: 'medium', label: 'Media', color: 'text-yellow-600 bg-yellow-50' },
  { value: 'high', label: 'Alta', color: 'text-orange-600 bg-orange-50' },
  { value: 'urgent', label: 'Urgente', color: 'text-red-600 bg-red-50' },
];

const ticketStatuses = [
  { value: 'open', label: 'Abierto', icon: Clock, color: 'text-blue-600 bg-blue-50' },
  { value: 'in_progress', label: 'En Progreso', icon: Loader2, color: 'text-yellow-600 bg-yellow-50' },
  { value: 'resolved', label: 'Resuelto', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  { value: 'closed', label: 'Cerrado', icon: X, color: 'text-gray-600 bg-gray-50' },
];

export default function SoportePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    userEmail: '',
    userName: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadMyTickets();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadMyTickets = async () => {
    try {
      setIsLoading(true);
      const data = await supportService.getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Error al cargar los tickets de soporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isAuthenticated) {
        // Para usuarios autenticados, solo enviar los campos necesarios
        const ticketData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
        };
        await supportService.createTicket(ticketData);
      } else {
        // Para usuarios no autenticados, enviar todos los campos
        await supportService.createPublicTicket(formData);
      }
      
      toast.success('Ticket de soporte creado exitosamente');
      setShowCreateForm(false);
      resetForm();
      if (isAuthenticated) {
        loadMyTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Error al crear el ticket de soporte');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTicket) return;
    
    try {
      // Solo enviar los campos necesarios para la actualización
      const ticketData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
      };
      await supportService.updateTicket(editingTicket.id, ticketData);
      toast.success('Ticket actualizado exitosamente');
      setEditingTicket(null);
      resetForm();
      loadMyTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Error al actualizar el ticket');
    }
  };

  const handleDelete = async (ticketId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este ticket?')) return;
    
    try {
      await supportService.deleteTicket(ticketId);
      toast.success('Ticket eliminado exitosamente');
      loadMyTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Error al eliminar el ticket');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
      userEmail: '',
      userName: '',
    });
  };

  const openEditForm = (ticket: SupportTicket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      userEmail: '',
      userName: '',
    });
  };

  const getStatusInfo = (status: string) => {
    return ticketStatuses.find(s => s.value === status) || ticketStatuses[0];
  };

  const getPriorityInfo = (priority: string) => {
    return ticketPriorities.find(p => p.value === priority) || ticketPriorities[1];
  };

  const getCategoryInfo = (category: string) => {
    return ticketCategories.find(c => c.value === category) || ticketCategories[5];
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Soporte Técnico</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ¿Necesitas ayuda? Estamos aquí para asistirte. Crea un ticket de soporte y nuestro equipo te responderá lo antes posible.
          </p>
        </motion.div>

        {/* Quick Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-sm text-gray-600">dulcetwilightdc2609@gmail.com</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
              <p className="text-sm text-gray-600">+54 9 261 123-4567</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Horarios</h3>
              <p className="text-sm text-gray-600">Lun-Vie: 9:00-18:00</p>
            </div>
          </div>
        </motion.div>

        {/* Create Ticket Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Ticket de Soporte
          </button>
        </motion.div>

        {/* My Tickets Section */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Tickets de Soporte</h2>
            
            {tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(ticket.status).color}`}>
                            {getStatusInfo(ticket.status).label}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityInfo(ticket.priority).color}`}>
                            {getPriorityInfo(ticket.priority).label}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Categoría: {getCategoryInfo(ticket.category).label}</span>
                          <span>Creado: {new Date(ticket.createdAt).toLocaleDateString('es-AR')}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(ticket)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {ticket.adminResponse && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <h4 className="font-medium text-blue-900 mb-2">Respuesta del Soporte:</h4>
                        <p className="text-blue-800 text-sm">{ticket.adminResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes tickets de soporte</h3>
                <p className="text-gray-500">Crea tu primer ticket de soporte cuando necesites ayuda.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Create/Edit Ticket Modal */}
        {(showCreateForm || editingTicket) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingTicket ? 'Editar Ticket' : 'Crear Ticket de Soporte'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingTicket(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={editingTicket ? handleUpdate : handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título del Problema *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción Detallada *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {ticketCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prioridad
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {ticketPriorities.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          value={formData.userName}
                          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.userEmail}
                          onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingTicket(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      {editingTicket ? 'Actualizar' : 'Crear'} Ticket
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <ChatWidget />
    </div>
  );
}

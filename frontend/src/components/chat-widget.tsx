'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, HelpCircle, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'escalation';
}

interface QuickReply {
  text: string;
  action: string;
}

const quickReplies: QuickReply[] = [
  { text: '¿Cómo hago un pedido?', action: 'order_process' },
  { text: '¿Cuáles son los métodos de pago?', action: 'payment_methods' },
  { text: '¿Cuánto tarda la entrega?', action: 'delivery_time' },
  { text: '¿Puedo cancelar mi pedido?', action: 'order_cancellation' },
  { text: '¿Tienen productos sin gluten?', action: 'dietary_restrictions' },
  { text: '¿Qué productos tienen?', action: 'products' },
  { text: '¿Cuáles son los precios?', action: 'prices' },
  { text: 'Necesito hablar con un humano', action: 'human_support' },
];

const botResponses: Record<string, string> = {
  order_process: `¡Te explico cómo hacer tu pedido! 🛒

1. Navega por nuestros productos y agrega los que te gusten al carrito
2. Haz clic en el ícono del carrito en la esquina superior derecha
3. Revisa tu pedido y haz clic en "Finalizar Compra"
4. Completa tus datos de envío y pago
5. ¡Confirma tu pedido y listo!

¿Te gustaría que te ayude con algo más específico?`,
  
  payment_methods: `Aceptamos únicamente estos métodos de pago 💳:

• **Mercado Pago**: Transferencias a través de la plataforma
• **Efectivo**: Pago en efectivo al momento de la entrega

No aceptamos tarjetas de crédito/débito, transferencias bancarias directas ni cuotas.`,
  
  delivery_time: `⏰ Nuestros tiempos de entrega:

• **Zona Centro**: 2-3 horas después de confirmar el pedido
• **Zonas aledañas**: 3-4 horas
• **Pedidos especiales**: 24-48 horas (se te notificará)

**Envío gratis** en compras superiores a $8,000
**Costo de envío** $5,000 para compras menores a $8,000

Los envíos se realizan de lunes a domingo de 9:00 a 20:00 hs.`,
  
  order_cancellation: `🔄 Política de cancelación:

• **Antes de 1 hora**: Cancelación gratuita
• **Entre 1-2 horas**: 50% de reembolso
• **Después de 2 horas**: No se puede cancelar

Para cancelar, contacta nuestro soporte inmediatamente.`,
  
  dietary_restrictions: `🌱 Opciones especiales disponibles:

• Productos sin gluten
• Productos veganos
• Productos sin azúcar
• Productos sin lactosa

Todos nuestros productos tienen etiquetas claras con la información nutricional y alérgenos.`,
  
  human_support: `👨‍💼 Te conecto con nuestro equipo de soporte humano.

Un agente se pondrá en contacto contigo en los próximos minutos. Mientras tanto, puedes:

• Crear un ticket de soporte en nuestra página
• Llamarnos al +54 9 261 123-4567
• Enviarnos un WhatsApp

¿Prefieres alguna de estas opciones?`,
  
  products: `¡Claro! Tenemos una gran variedad de productos deliciosos 🍰

Nuestros productos incluyen:
• Tortas y pasteles personalizados
• Galletas artesanales
• Bombones de chocolate
• Cupcakes decorados
• Postres especiales

Puedes navegar por nuestro catálogo en la sección "Productos" o preguntarme sobre algún producto específico. ¿Te interesa algo en particular?`,
  
  prices: `💰 Los precios varían según el producto y personalización:

• Tortas básicas: desde $5,000
• Tortas personalizadas: desde $8,000
• Galletas: desde $500 cada una
• Bombones: desde $800 cada uno
• Cupcakes: desde $1,200 cada uno

Los precios exactos se muestran en cada producto. ¿Te gustaría ver algún producto específico?`,
  
  default: `¡Hola! Soy el asistente virtual de Dulce Twilight 🍰

Puedo ayudarte con:
• Información sobre productos y precios
• Proceso de compra y pedidos
• Métodos de pago disponibles
• Tiempos de entrega
• Políticas de cancelación
• Opciones especiales (sin gluten, veganos, etc.)
• Escalación a soporte humano

¿En qué puedo ayudarte hoy? Puedes escribir tu pregunta o usar los botones de abajo para las consultas más frecuentes.`
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy el asistente virtual de Dulce Twilight 🍰\n\nPuedo ayudarte con información sobre productos, proceso de compra, métodos de pago, tiempos de entrega y mucho más.\n\n¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Obtener respuesta del bot (solo pre-establecidas)
    setTimeout(() => {
      const response = getBotResponse(text.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Respuesta entre 1-2 segundos
  };

  const getBotResponse = (userText: string): string => {
    // Detectar palabras clave más específicas
    const text = userText.toLowerCase();
    
    // Proceso de pedido
    if (text.includes('pedido') || text.includes('comprar') || text.includes('orden') || 
        text.includes('carrito') || text.includes('finalizar') || text.includes('checkout')) {
      return botResponses.order_process;
    }
    
    // Métodos de pago
    if (text.includes('pago') || text.includes('tarjeta') || text.includes('efectivo') || 
        text.includes('transferencia') || text.includes('mercado pago') || text.includes('débito') || 
        text.includes('crédito') || text.includes('cuotas') || text.includes('billetera') || 
        text.includes('banco') || text.includes('bancaria')) {
      return botResponses.payment_methods;
    }
    
    // Tiempos de entrega
    if (text.includes('entrega') || text.includes('tiempo') || text.includes('cuándo') || 
        text.includes('llegar') || text.includes('envío') || text.includes('demora') || 
        text.includes('horario')) {
      return botResponses.delivery_time;
    }
    
    // Cancelación
    if (text.includes('cancelar') || text.includes('devolver') || text.includes('reembolso') || 
        text.includes('devolución') || text.includes('cancelación')) {
      return botResponses.order_cancellation;
    }
    
    // Restricciones dietéticas
    if (text.includes('gluten') || text.includes('vegano') || text.includes('dieta') || 
        text.includes('sin azúcar') || text.includes('lactosa') || text.includes('alergia') || 
        text.includes('vegetariano')) {
      return botResponses.dietary_restrictions;
    }
    
    // Soporte humano
    if (text.includes('humano') || text.includes('persona') || text.includes('agente') || 
        text.includes('operador') || text.includes('atencion') || text.includes('ayuda personal')) {
      return botResponses.human_support;
    }
    
    // Productos
    if (text.includes('producto') || text.includes('dulce') || text.includes('torta') || 
        text.includes('pastel') || text.includes('galleta') || text.includes('chocolate')) {
      return `¡Claro! Tenemos una gran variedad de productos deliciosos 🍰

Nuestros productos incluyen:
• Tortas y pasteles personalizados
• Galletas artesanales
• Bombones de chocolate
• Cupcakes decorados
• Postres especiales

Puedes navegar por nuestro catálogo en la sección "Productos" o preguntarme sobre algún producto específico. ¿Te interesa algo en particular?`;
    }
    
    // Precios
    if (text.includes('precio') || text.includes('costo') || text.includes('cuánto') || 
        text.includes('valor') || text.includes('tarifa')) {
      return `💰 Los precios varían según el producto y personalización:

• Tortas básicas: desde $5,000
• Tortas personalizadas: desde $8,000
• Galletas: desde $500 cada una
• Bombones: desde $800 cada uno
• Cupcakes: desde $1,200 cada uno

Los precios exactos se muestran en cada producto. ¿Te gustaría ver algún producto específico?`;
    }
    
    // Horarios
    if (text.includes('hora') || text.includes('abierto') || text.includes('cerrado') || 
        text.includes('atencion') || text.includes('disponible')) {
      return `🕒 Nuestros horarios de atención:

• **Lunes a Domingo**: 9:00 a 20:00 hs
• **Entregas**: 9:00 a 20:00 hs
• **Pedidos online**: 24/7 (entregas en horario de atención)

¿Necesitas hacer un pedido o tienes alguna otra consulta?`;
    }
    
    // Ubicación
    if (text.includes('donde') || text.includes('ubicacion') || text.includes('direccion') || 
        text.includes('local') || text.includes('tienda')) {
      return `📍 Nuestra ubicación:

• **Dirección**: Av. Principal 123, Centro
• **Ciudad**: Mendoza, Argentina
• **Zona de entrega**: Centro y alrededores
• **Envío a domicilio**: Disponible en toda la ciudad

¿Te gustaría hacer un pedido para entrega a domicilio?`;
    }
    
    // Contacto
    if (text.includes('contacto') || text.includes('telefono') || text.includes('whatsapp') || 
        text.includes('email') || text.includes('llamar')) {
      return `📞 Información de contacto:

• **WhatsApp**: +54 9 261 123-4567
• **Email**: dulcetwilightdc2609@gmail.com
• **Horarios**: Lun-Vie 9:00-18:00
• **Soporte**: Disponible en nuestra página web

También puedes crear un ticket de soporte en la sección "Soporte" de nuestra página.`;
    }
    
    // Saludos
    if (text.includes('hola') || text.includes('buenos dias') || text.includes('buenas') || 
        text.includes('saludos') || text.includes('buenas tardes') || text.includes('buenas noches')) {
      return `¡Hola! 👋 Soy el asistente virtual de Dulce Twilight.

Estoy aquí para ayudarte con cualquier consulta sobre nuestros productos, pedidos, precios, entregas y más.

¿En qué puedo ayudarte hoy? Puedes escribir tu pregunta o usar los botones de abajo para las consultas más frecuentes.`;
    }
    
    return botResponses.default;
  };

  const handleQuickReply = (reply: QuickReply) => {
    // Enviar el mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply.text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Responder directamente con la acción específica
    setTimeout(() => {
      const response = botResponses[reply.action] || botResponses.default;
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleEscalation = () => {
    toast.success('Te estamos conectando con un agente humano...');
    handleSendMessage('Necesito hablar con un humano');
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
                 className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-colors flex items-center justify-center md:w-16 md:h-16"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                         className="fixed bottom-20 right-4 z-40 w-[calc(100vw-2rem)] h-[calc(100vh-8rem)] max-w-sm max-h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-orange-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">Asistente Virtual</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEscalation}
                  className="p-1 hover:bg-orange-700 rounded transition-colors"
                  title="Hablar con humano"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="whitespace-pre-wrap text-sm">
                        {message.text}
                      </div>
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preguntas frecuentes:</p>
                <div className="grid grid-cols-1 gap-2">
                  {quickReplies.slice(0, 3).map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

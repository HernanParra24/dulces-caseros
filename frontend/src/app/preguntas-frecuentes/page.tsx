'use client';

import { BackButton } from '@/components/back-button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "¿Cómo puedo realizar un pedido?",
    answer: "Para realizar un pedido, simplemente navega por nuestros productos en la página, agrega los dulces que desees a tu carrito de compras y procede al checkout. Una vez completado el pedido, nos pondremos en contacto contigo para coordinar la entrega y el pago."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos transferencias a través de Mercado Pago y pago en efectivo al momento de la entrega. No aceptamos tarjetas de crédito o débito."
  },

  {
    question: "¿Realizan envíos a domicilio?",
    answer: "Sí, realizamos entregas a domicilio en Lavalle Costa de Araujo y zonas cercanas. El envío es gratis en compras superiores a $8,000. Para compras menores a $8,000, el costo de envío es de $5,000. Para otras localidades, consultanos la disponibilidad."
  },
  {
    question: "¿Los dulces contienen alérgenos?",
    answer: "Nuestros dulces pueden contener ingredientes como leche, huevos, frutos secos, gluten y otros alérgenos comunes. Si tienes alguna alergia específica, por favor indícanoslo al hacer tu pedido para que podamos adaptar la receta o sugerirte alternativas seguras."
  },

  {
    question: "¿Cuáles son los horarios de atención?",
    answer: "Nuestros horarios de atención son de Lunes a Domingo de 9:00 a 20:00. Puedes contactarnos en cualquier momento dentro de estos horarios para realizar consultas o pedidos."
  },
  {
    question: "¿Puedo cancelar o modificar mi pedido?",
    answer: "Sí, puedes cancelar o modificar tu pedido hasta 24 horas antes de la fecha de entrega acordada. Para cambios de última hora, consultanos la disponibilidad y posibles cargos adicionales."
  },
  {
    question: "¿Cuánto tiempo se conservan los dulces?",
    answer: "Los productos se mantienen sin abrir aproximadamente 1 año. Una vez abiertos y refrigerados, se conservan aproximadamente 1 mes y medio. Es importante mantenerlos refrigerados entre 2°C y 8°C y evitar la exposición directa al sol."
  }
];

export default function PreguntasFrecuentesPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <BackButton className="mb-6" />
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Preguntas Frecuentes
          </h1>
          
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">
                    {item.question}
                  </span>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-3">
              ¿No encontraste la respuesta que buscabas?
            </h3>
            <p className="text-orange-700 mb-4">
              Si tienes alguna pregunta específica que no está cubierta aquí, 
              no dudes en contactarnos directamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/contacto"
                className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                Contactar
              </a>
              <a
                href="tel:+542615632310"
                className="inline-flex items-center justify-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors font-medium"
              >
                Llamar +54 261 563-2310
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

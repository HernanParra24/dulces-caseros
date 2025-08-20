'use client';

import { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface GoogleMapsProps {
  address?: string;
  className?: string;
  coordinates?: { lat: number; lng: number };
}

export default function GoogleMaps({ 
  address = "Lavalle Costa de Araujo, Mendoza, Argentina",
  className = "w-full h-64 rounded-lg",
  coordinates
}: GoogleMapsProps) {
  const [showIframe, setShowIframe] = useState(false);

  // Versión sin iframe (sin cookies de terceros)
  if (!showIframe) {
    return (
      <div className={`${className} relative bg-gradient-to-br from-orange-50 to-purple-50 border-2 border-orange-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg`} onClick={() => setShowIframe(true)}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-purple-400/10"></div>
        
        {/* Patrón decorativo */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-orange-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-8 left-8 w-8 h-8 bg-purple-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-orange-300 rounded-full opacity-10"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="mb-4">
            <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">Nuestra Ubicación</h3>
          <p className="text-gray-600 mb-4 max-w-sm">
            {address}
          </p>
          
          {coordinates && (
            <p className="text-sm text-gray-500 mb-4">
              Coordenadas: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          )}
          
          <div className="flex flex-col space-y-2">
            <a
              href="https://maps.app.goo.gl/b59mCkrx9zenf4Ak9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-5 h-5" />
              <span>Abrir en Google Maps</span>
            </a>
            
            <button 
              className="text-sm text-gray-500 hover:text-orange-500 underline"
              onClick={(e) => {
                e.stopPropagation();
                setShowIframe(true);
              }}
            >
              Cargar mapa interactivo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Versión con iframe (solo si el usuario lo solicita)
  return (
    <div className={`${className} relative`}>
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3355.4603179661835!2d-68.46780403258914!3d-32.753518295839065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1ses-419!2sar!4v1755703350652!5m2!1ses-419!2sar"
        width="100%"
        height="100%"
        style={{ border: 0, borderRadius: '8px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación de Dulce Twilight"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />

      {/* Botón para volver a la versión simple */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowIframe(false)}
          className="px-3 py-1 bg-white/90 hover:bg-white text-gray-700 text-sm rounded-lg shadow-lg transition-all duration-200"
        >
          Versión simple
        </button>
      </div>

      {/* Botón flotante para abrir en Google Maps */}
      <div className="absolute bottom-4 right-4">
        <a
          href="https://maps.app.goo.gl/b59mCkrx9zenf4Ak9"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="text-sm">Abrir en Maps</span>
        </a>
      </div>
    </div>
  );
}

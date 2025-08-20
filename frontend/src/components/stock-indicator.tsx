'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface StockIndicatorProps {
  stock: number;
  productName: string;
  className?: string;
}

export function StockIndicator({ stock, productName, className = '' }: StockIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (stock <= 0) {
    return (
      <div className={`flex items-center space-x-2 text-red-600 ${className}`}>
        <XCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Sin stock</span>
      </div>
    );
  }

  if (stock <= 5) {
    return (
      <div 
        className={`flex items-center space-x-2 text-orange-600 cursor-help ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">Stock limitado</span>
        
        {showTooltip && (
          <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
            Solo quedan {stock} unidades de {productName}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 text-green-600 ${className}`}>
      <CheckCircle className="w-4 h-4" />
      <span className="text-sm font-medium">En stock</span>
    </div>
  );
}

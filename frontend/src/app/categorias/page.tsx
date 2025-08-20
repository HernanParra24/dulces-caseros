'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CategoriasPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al inicio y hacer scroll a la sección de productos
    router.push('/#productos');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
        <p className="text-gray-600">Redirigiendo a categorías...</p>
      </div>
    </div>
  );
}

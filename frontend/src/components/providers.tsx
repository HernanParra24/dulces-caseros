'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    console.log('🚀 Providers mounted, calling checkAuth...');
    checkAuth();
  }, []);

  return <>{children}</>;
}

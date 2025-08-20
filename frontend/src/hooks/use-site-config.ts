import { useState, useEffect, useCallback } from 'react';
import { configService } from '@/lib/api';

interface SiteConfig {
  storeName: string;
  logoUrl?: string;
  heroImageUrl?: string;
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await configService.getPublicConfig();
      setConfig(data);
    } catch (err) {
      console.error('Error loading site config:', err);
      setError('Error al cargar la configuración del sitio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return { config, isLoading, error, refetch: loadConfig };
}

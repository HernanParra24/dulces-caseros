'use client';

import { useEffect } from 'react';

export const useScrollToSection = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1); // Remover el #
      const element = document.getElementById(sectionId);
      if (element) {
        // Pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    }
  }, []);
};

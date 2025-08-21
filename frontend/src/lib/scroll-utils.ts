export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    // Calcular la posición del elemento
    const elementPosition = element.offsetTop;
    // Agregar offset para el header fijo (aproximadamente 80px)
    const offset = 80;
    
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth',
    });
  } else {
    console.warn(`Elemento con ID "${sectionId}" no encontrado`);
  }
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

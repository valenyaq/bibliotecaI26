import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  // Esta función se ejecuta cuando cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Esta función se ejecuta en cada carga inicial de página (incluido refresh)
  useLayoutEffect(() => {
    // Asegurarse de que al cargar la página siempre esté arriba
    window.scrollTo(0, 0);
    
    // Función para manejar la recarga de página
    const handleBeforeUnload = () => {
      // Guardar la posición actual en sessionStorage
      sessionStorage.setItem('scrollPosition', '0');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return null;
}

export default ScrollToTop; 
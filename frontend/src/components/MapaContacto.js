import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para el ícono de marcador
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const MapaContacto = () => {
  useEffect(() => {
    // Corregir el problema de los íconos en Leaflet + React
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl
    });

    // Coordenadas del ISFDyT 26 (estas son coordenadas de ejemplo, reemplazar con las reales)
    const latitud = -36.31636;
    const longitud = -57.67857;
    const zoom = 15;

    // Inicializar el mapa si no existe
    if (!document.getElementById('map').hasChildNodes()) {
      const map = L.map('map').setView([latitud, longitud], zoom);

      // Agregar la capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Agregar un marcador para la institución
      const marker = L.marker([latitud, longitud]).addTo(map);
      
      // Agregar un popup al marcador
      marker.bindPopup("<b>ISFDyT N° 26</b><br>Biblioteca").openPopup();
    }

    // Función de limpieza para cuando se desmonte el componente
    return () => {
      // En caso de querer limpiar algo cuando se desmonte el componente
    };
  }, []);

  return (
    <div id="map" className="h-80 w-full rounded-lg"></div>
  );
};

export default MapaContacto; 
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapaContactoReact = () => {
  // Coordenadas del ISFDyT 26 (estas son coordenadas de ejemplo, reemplazar con las reales)
  const position = [-36.31636, -57.67857];
  const zoom = 15;

  return (
    <MapContainer 
      center={position} 
      zoom={zoom} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <b>ISFDyT N° 26</b><br />Biblioteca
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapaContactoReact; 
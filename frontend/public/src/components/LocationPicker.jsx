import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./LocationPicker.css";

// Icono por defecto de Leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Componente para centrar el mapa en la ubicación seleccionada
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16); // zoom más cercano al usuario
    }
  }, [position, map]);
  return null;
};

function LocationPicker({ onLocationChange }) { // Asegurar que recibe la prop
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");

  // Detectar ubicación actual al abrir el modal
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        }
      );
    }
  }, [isOpen]);

  // Permitir clic en el mapa para mover el marcador
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return position ? <Marker position={position} icon={markerIcon} /> : null;
  };

  // Obtener dirección con Nominatim
  const fetchAddress = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      const displayName = data.display_name || "Dirección no encontrada";
      setAddress(displayName);
      
      // Comunicar la ubicación al componente padre
      if (onLocationChange) {
        const locationData = {
          address: displayName,
          display_name: displayName, // Para compatibilidad con FinishOrder
          coordinates: {
            lat: lat,
            lng: lon
          },
          lat: lat.toString(), // Para compatibilidad con FinishOrder
          lon: lon.toString()  // Para compatibilidad con FinishOrder
        };
        
        console.log('Enviando ubicación al padre:', locationData);
        onLocationChange(locationData);
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      setAddress("Error al obtener la dirección");
    }
  };

  const handleSave = async () => {
    if (position) {
    // Guardar coordenadas en localStorage
    localStorage.setItem("customerLocation", JSON.stringify(position));
    fetchAddress(position.lat, position.lng);
  }
  setIsOpen(false);
  };

  // Función para limpiar la ubicación seleccionada
  const handleClear = () => {
    setAddress("");
    setPosition(null);
    if (onLocationChange) {
      onLocationChange(null);
    }
  };

  return (
    <div className="location-picker-container">
      <div className="location-picker-buttons">
        <button onClick={() => setIsOpen(true)} className="btn-primary">
          {address ? "Cambiar ubicación" : "Seleccionar ubicación"}
        </button>
        
        {address && (
          <button onClick={handleClear} className="btn-secondary" style={{marginLeft: '10px'}}>
            Limpiar
          </button>
        )}
      </div>

      {address && (
        <div className="selected-address" style={{
          backgroundColor: '#e8f5e8',
          border: '1px solid #4caf50',
          borderRadius: '4px',
          padding: '10px',
          marginTop: '10px'
        }}>
          <p><strong>Ubicación seleccionada:</strong></p>
          <p>{address}</p>
          {position && (
            <p><small>Coordenadas: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}</small></p>
          )}
        </div>
      )}

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Selecciona una ubicación</h2>
            <p className="modal-instruction">Haz clic en el mapa para seleccionar una ubicación</p>
            
            <div className="map-wrapper">
              <MapContainer
                center={position || [13.6929, -89.2182]} // San Salvador, El Salvador
                zoom={position ? 16 : 13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <LocationMarker />
                <RecenterMap position={position} />
              </MapContainer>
            </div>
            
            {position && (
              <div className="selected-position-info" style={{
                backgroundColor: '#f0f8ff',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '4px',
                border: '1px solid #2196F3'
              }}>
                <p><strong>Posición seleccionada:</strong></p>
                <p>Latitud: {position.lat.toFixed(6)}</p>
                <p>Longitud: {position.lng.toFixed(6)}</p>
              </div>
            )}
            
            <div className="modal-actions">
              <button onClick={() => setIsOpen(false)} className="btn-secondary">
                Cancelar
              </button>
              <button 
                onClick={handleSave} 
                className="btn-success"
                disabled={!position}
                style={{
                  backgroundColor: !position ? '#ccc' : '#4CAF50',
                  cursor: !position ? 'not-allowed' : 'pointer'
                }}
              >
                {position ? 'Guardar ubicación' : 'Selecciona una posición'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationPicker;
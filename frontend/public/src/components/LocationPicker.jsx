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

function LocationPicker() {
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
      setAddress(data.display_name || "Dirección no encontrada");
    } catch (error) {
      setAddress("Error al obtener la dirección");
    }
  };

  const handleSave = () => {
    if (position) {
      fetchAddress(position.lat, position.lng);
    }
    setIsOpen(false);
  };

  return (
    <div className="location-picker-container">
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        Seleccionar ubicación
      </button>

      {address && (
        <p className="selected-address">
          <strong>Ubicación seleccionada:</strong> {address}
        </p>
      )}

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Selecciona una ubicación</h2>
            <div className="map-wrapper">
              <MapContainer
                center={position || [13.6929, -89.2182]}
                zoom={13}
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
            <div className="modal-actions">
              <button onClick={() => setIsOpen(false)} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={handleSave} className="btn-success">
                Guardar ubicación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationPicker;

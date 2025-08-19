import React, { useEffect, useState } from "react";
import { useMap, MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/FollowOrder.css";
import L from "leaflet";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import imgStatus from "../imgs/InWayStatus.png";
import { useNavigate } from "react-router-dom";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function Routing({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !from || !to) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, from, to]);

  return null;
}

function FollowOrder() {
  const navigate = useNavigate();
  const [customerLocation, setCustomerLocation] = useState(null);

  // ubicación "fija" del repartidor en San Salvador
  const deliveryLocation = { lat: 13.6929, lng: -89.2182 };

  useEffect(() => {
    const saved = localStorage.getItem("customerLocation");
    if (saved) {
      setCustomerLocation(JSON.parse(saved));
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="follow-container">
        <div className="follow-status">
          <div className="status-header">
            <div className="status-text">
              <h2>Tu pedido está:</h2>
              <h1>En camino</h1>
            </div>
            <img 
              src={imgStatus} 
              alt="Estado del pedido"
              onClick={() => navigate("/RateService")} 
            />
          </div>

          <div className="map-container">
            {customerLocation && (
              <MapContainer
                center={deliveryLocation}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
                  attribution="© OpenStreetMap contributors © CARTO"
                />

                <Marker position={customerLocation} icon={markerIcon} />
                <Marker position={deliveryLocation} icon={markerIcon} />

                <Routing from={deliveryLocation} to={customerLocation} />
              </MapContainer>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FollowOrder;
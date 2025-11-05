// src/components/Map.tsx
import {
  MapContainer,
  TileLayer,
  Marker as LeafletMarker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Marker } from "../types";
import L from "leaflet";

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const userLocationIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "user-location-icon",
});

interface MapProps {
  markers: Marker[];
  userLocation?: { latitude: number; longitude: number } | null;
}

const Map = ({ markers, userLocation }: MapProps) => {
  const position: [number, number] =
    userLocation
      ? [userLocation.latitude, userLocation.longitude]
      : markers.length > 0
      ? [markers[0].location.latitude, markers[0].location.longitude]
      : [30.35499042305075, 76.36601205473525]; // Default position if no markers

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker) => (
        <LeafletMarker
          key={marker.id}
          position={[marker.location.latitude, marker.location.longitude]}
        >
          <Tooltip>{marker.question}</Tooltip>
        </LeafletMarker>
      ))}
      {userLocation && (
        <LeafletMarker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userLocationIcon}
        >
          <Tooltip>Your Location</Tooltip>
        </LeafletMarker>
      )}
    </MapContainer>
  );
};

export default Map;

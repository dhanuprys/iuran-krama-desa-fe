import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapPickerProps {
  value?: { lat: number; lng: number } | null;
  onChange: (value: { lat: number; lng: number }) => void;
  center?: { lat: number; lng: number };
}

function LocationMarker({
  position,
  onChange,
}: {
  position: { lat: number; lng: number } | null;
  onChange: (pos: { lat: number; lng: number }) => void;
}) {
  const map = useMapEvents({
    click(e) {
      onChange(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
    locationfound(e) {
      if (!position) {
        onChange(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  // Try to locate user on mount if no position
  useEffect(() => {
    if (!position) {
      map.locate();
    }
  }, [map, position]);

  return position === null ? null : <Marker position={position}></Marker>;
}

export function MapPicker({
  value,
  onChange,
  center = { lat: -8.65, lng: 115.216667 },
}: MapPickerProps) {
  // Default to Denpasar/Bali
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(value || null);

  useEffect(() => {
    setPosition(value || null);
  }, [value]);

  const handleLocationChange = (latlng: { lat: number; lng: number }) => {
    setPosition(latlng);
    onChange(latlng);
  };

  return (
    <div className="h-[300px] w-full overflow-hidden rounded-md border">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onChange={handleLocationChange} />
      </MapContainer>
    </div>
  );
}

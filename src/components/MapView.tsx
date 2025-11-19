import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { MapViewProps } from '../types';
import './MapView.css';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const MapView: React.FC<MapViewProps> = ({ center, addresses, zoom = 13 }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const addressMarkersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([center.lat, center.lon], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update center marker and view
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setView([center.lat, center.lon], zoom);

    if (centerMarkerRef.current) {
      centerMarkerRef.current.setLatLng([center.lat, center.lon]);
    } else {
      // Create custom icon for center marker
      const centerIcon = L.divIcon({
        className: 'center-marker',
        html: '<div class="center-marker-inner"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      centerMarkerRef.current = L.marker([center.lat, center.lon], { icon: centerIcon })
        .addTo(mapRef.current)
        .bindPopup('Centro de Masa');
    }
  }, [center, zoom]);

  // Update address markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing address markers
    addressMarkersRef.current.forEach((marker) => marker.remove());
    addressMarkersRef.current = [];

    // Add markers for addresses with coordinates
    addresses.forEach((address) => {
      if (address.coordinates && mapRef.current) {
        const marker = L.marker([address.coordinates.lat, address.coordinates.lon])
          .addTo(mapRef.current)
          .bindPopup(address.value || 'Dirección');

        addressMarkersRef.current.push(marker);
      }
    });

    // Fit bounds to show all markers if there are any
    if (addressMarkersRef.current.length > 0 && centerMarkerRef.current && mapRef.current) {
      const group = L.featureGroup([...addressMarkersRef.current, centerMarkerRef.current]);
      mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [addresses]);

  return (
    <div className="map-container">
      <div ref={mapContainerRef} className="map" role="region" aria-label="Mapa interactivo" />
    </div>
  );
};

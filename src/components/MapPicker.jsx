import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '250px',
  borderRadius: '12px'
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

export default function MapPicker({ onLocationSelect }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
    // Try to get user's current location to center map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarkerPosition(pos);
          map.panTo(pos);
          onLocationSelect(pos);
        },
        () => {
          onLocationSelect(defaultCenter);
        }
      );
    } else {
      onLocationSelect(defaultCenter);
    }
  }, [onLocationSelect]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = (e) => {
    const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPosition(newPos);
    onLocationSelect(newPos);
  };

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-[250px] bg-gray-100 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p className="font-bold text-sm">Google Maps API Key Missing</p>
        <p className="text-xs mt-1">Add VITE_GOOGLE_MAPS_API_KEY to your .env file</p>
      </div>
    );
  }

  return isLoaded ? (
    <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker 
          position={markerPosition}
          draggable={true}
          onDragEnd={(e) => {
            const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            setMarkerPosition(newPos);
            onLocationSelect(newPos);
          }}
        />
      </GoogleMap>
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm text-gray-700">
        Click or drag pin to select location
      </div>
    </div>
  ) : (
    <div className="w-full h-[250px] bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 animate-pulse">
      Loading map...
    </div>
  );
}

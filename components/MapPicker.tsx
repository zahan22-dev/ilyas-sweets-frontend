"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  height?: string;
  readOnly?: boolean;
}

function LocationMarker({ position, onChange, readOnly }: { position: L.LatLngExpression, onChange: (lat: number, lng: number) => void, readOnly?: boolean }) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      if (readOnly) return;
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={position}
      draggable={!readOnly}
      eventHandlers={{
        dragend: (e) => {
          if (readOnly) return;
          const marker = e.target;
          const position = marker.getLatLng();
          onChange(position.lat, position.lng);
        },
      }}
      ref={markerRef}
    />
  );
}

function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 16);
  }, [position, map]);
  return null;
}

export default function MapPicker({ lat, lng, onChange, height = "400px", readOnly = false }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([lat, lng]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    setPosition([lat, lng]);
  }, [lat, lng]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setResults([]);
    try {
      const q = searchQuery.toLowerCase().includes('karachi') ? searchQuery : `${searchQuery}, Karachi, Pakistan`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        setResults(data);
      } else {
        alert("Could not find that location.");
      }
    } catch (err) {
      console.error("Geocoding error", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const selectResult = (result: any) => {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    onChange(newLat, newLng);
    setSearchQuery(result.display_name);
    setResults([]);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {!readOnly && (
        <div className="relative">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search your area (e.g. Gulshan-e-Iqbal)..." 
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setResults([]); }}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC702] focus:border-transparent outline-none"
            />
            <button 
              type="button" 
              onClick={handleSearch}
              disabled={isSearching}
              className="px-5 py-2.5 bg-[#111111] text-white text-sm font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
          
          {results.length > 0 && (
            <ul className="absolute z-[1000] w-full bg-white shadow-xl rounded-lg border border-gray-200 mt-2 max-h-60 overflow-y-auto divide-y divide-gray-100">
              {results.map((r, i) => (
                <li 
                  key={i} 
                  onClick={() => selectResult(r)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors"
                >
                  {r.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div style={{ height, width: "100%", borderRadius: "1rem", overflow: "hidden", zIndex: 0, position: "relative" }} className="border-2 border-gray-100">
        <MapContainer center={position} zoom={15} scrollWheelZoom={true} style={{ height: "100%", width: "100%", zIndex: 10 }}>
          <MapUpdater position={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} onChange={onChange} readOnly={readOnly} />
        </MapContainer>
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LocationData {
  id: number
  location: string
  lat: number
  lng: number
  hmpi: number
  classification: string
  color: string
  lastUpdated: string
}

interface LeafletMapProps {
  locations: LocationData[]
  selectedLocation: LocationData | null
  onLocationSelect: (location: LocationData | null) => void
  mapLayer: string
}

// Component to handle map view changes
function MapView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  
  return null
}


// Custom marker component with color coding
function CustomMarker({ location, onSelect }: { location: LocationData, onSelect: (location: LocationData) => void }) {
  const getMarkerIcon = (color: string, hmpi: number) => {
    const size = hmpi > 100 ? 30 : hmpi > 50 ? 25 : 20
    const pulseSize = size + 10
    
    return L.divIcon({
      html: `
        <div style="position: relative;">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: ${color};
            width: ${pulseSize}px;
            height: ${pulseSize}px;
            border-radius: 50%;
            opacity: 0.3;
            animation: pulse 2s infinite;
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
            cursor: pointer;
            transition: transform 0.2s ease;
          " onmouseover="this.style.transform='translate(-50%, -50%) scale(1.1)'" 
             onmouseout="this.style.transform='translate(-50%, -50%) scale(1)'">
            ${Math.round(hmpi)}
          </div>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          }
        </style>
      `,
      className: 'custom-marker',
      iconSize: [pulseSize, pulseSize],
      iconAnchor: [pulseSize/2, pulseSize/2]
    })
  }

  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={getMarkerIcon(location.color, location.hmpi)}
      eventHandlers={{
        click: () => onSelect(location)
      }}
    >
      <Popup maxWidth={300} className="custom-popup">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: location.color }}
            ></div>
            <h3 className="font-semibold text-sm">{location.location}</h3>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">HMPI Value:</span>
              <span className="font-medium">{location.hmpi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quality:</span>
              <span className={`font-medium ${
                location.classification === 'Poor' ? 'text-red-600' : 
                location.classification === 'Good' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {location.classification}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Coordinates:</span>
              <span className="font-mono text-xs">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Updated:</span>
              <span>{location.lastUpdated}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t">
            <button 
              className="w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors"
              onClick={() => onSelect(location)}
            >
              View Details
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

export function LeafletMap({ locations, selectedLocation, onLocationSelect, mapLayer }: LeafletMapProps) {
  const mapRef = useRef<L.Map>(null)

  // Center the map on India
  const indiaCenter: [number, number] = [20.5937, 78.9629]
  const defaultZoom = 5

  // Calculate bounds to fit all locations
  const getBounds = () => {
    if (locations.length === 0) return null
    
    const lats = locations.map(loc => loc.lat)
    const lngs = locations.map(loc => loc.lng)
    
    return L.latLngBounds(
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    )
  }

  const bounds = getBounds()

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border relative">
      <MapContainer
        center={indiaCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        bounds={bounds || undefined}
        boundsOptions={{ padding: [20, 20] }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
      >
        {/* CartoDB tiles for better Indian map visualization */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Alternative: OpenStreetMap tiles */}
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}

        {/* Render markers for each location */}
        {locations.map((location) => (
          <CustomMarker
            key={location.id}
            location={location}
            onSelect={onLocationSelect}
          />
        ))}

        {/* Heatmap layer (if selected) */}
        {mapLayer === 'heatmap' && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            opacity={0.3}
          />
        )}

      </MapContainer>
    </div>
  )
}

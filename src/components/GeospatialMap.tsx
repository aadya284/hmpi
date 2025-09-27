import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Map, MapPin, Layers, Filter } from 'lucide-react'

const mockLocationData = [
  {
    id: 1,
    location: 'Mumbai Industrial Area',
    lat: 19.0760,
    lng: 72.8777,
    hmpi: 125.6,
    classification: 'Poor',
    color: '#ef4444',
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    location: 'Delhi Yamuna Basin',
    lat: 28.7041,
    lng: 77.1025,
    hmpi: 78.2,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-20'
  },
  {
    id: 3,
    location: 'Chennai Coastal Area',
    lat: 13.0827,
    lng: 80.2707,
    hmpi: 45.8,
    classification: 'Excellent',
    color: '#22c55e',
    lastUpdated: '2024-01-18'
  },
  {
    id: 4,
    location: 'Kolkata Industrial Belt',
    lat: 22.5726,
    lng: 88.3639,
    hmpi: 95.3,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-22'
  },
  {
    id: 5,
    location: 'Bangalore Tech Hub',
    lat: 12.9716,
    lng: 77.5946,
    hmpi: 32.1,
    classification: 'Excellent',
    color: '#22c55e',
    lastUpdated: '2024-01-25'
  },
  {
    id: 6,
    location: 'Pune Manufacturing Zone',
    lat: 18.5204,
    lng: 73.8567,
    hmpi: 108.7,
    classification: 'Poor',
    color: '#ef4444',
    lastUpdated: '2024-01-21'
  }
]

export function GeospatialMap() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [filterClassification, setFilterClassification] = useState('all')
  const [mapLayer, setMapLayer] = useState('heatmap')

  const filteredData = mockLocationData.filter(location => 
    filterClassification === 'all' || location.classification.toLowerCase() === filterClassification
  )

  const getIntensityRadius = (hmpi) => {
    if (hmpi > 100) return 60
    if (hmpi > 50) return 40
    return 25
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Select value={filterClassification} onValueChange={setFilterClassification}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={mapLayer} onValueChange={setMapLayer}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Map layer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="heatmap">Heatmap</SelectItem>
              <SelectItem value="contour">Contour Lines</SelectItem>
              <SelectItem value="points">Point Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Excellent (0-50)
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            Good (50-100)
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            Poor (100+)
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Interactive Heatmap
              </CardTitle>
              <CardDescription>
                Geographic distribution of heavy metal contamination levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simulated Map View */}
              <div className="relative bg-slate-100 rounded-lg h-96 overflow-hidden">
                {/* Background map simulation */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                  {/* Simulated map grid */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="absolute bg-gray-300" style={{
                        top: `${i * 10}%`,
                        left: 0,
                        right: 0,
                        height: '1px'
                      }} />
                    ))}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="absolute bg-gray-300" style={{
                        left: `${i * 10}%`,
                        top: 0,
                        bottom: 0,
                        width: '1px'
                      }} />
                    ))}
                  </div>
                </div>

                {/* Location markers */}
                {filteredData.map((location) => {
                  const x = ((location.lng - 70) / 20) * 100 // Normalize longitude
                  const y = ((30 - location.lat) / 20) * 100 // Normalize latitude (inverted)
                  
                  return (
                    <div
                      key={location.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ 
                        left: `${Math.max(5, Math.min(95, x))}%`, 
                        top: `${Math.max(5, Math.min(95, y))}%` 
                      }}
                      onClick={() => setSelectedLocation(location)}
                    >
                      {mapLayer === 'heatmap' && (
                        <div
                          className="rounded-full opacity-60 group-hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: location.color,
                            width: `${getIntensityRadius(location.hmpi)}px`,
                            height: `${getIntensityRadius(location.hmpi)}px`,
                          }}
                        />
                      )}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <MapPin 
                          className="h-6 w-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform" 
                          fill={location.color}
                        />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {location.location}: {location.hmpi}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                  <h4 className="font-medium mb-2 text-sm">HMPI Levels</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>0-50: Excellent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>50-100: Good</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>100+: Poor</span>
                    </div>
                  </div>
                </div>

                {/* Scale indicator */}
                <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 bg-black"></div>
                    <span>100 km</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{selectedLocation.location}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedLocation.lat}, {selectedLocation.lng}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">HMPI Value:</span>
                      <span className="font-medium">{selectedLocation.hmpi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Classification:</span>
                      <Badge 
                        variant={selectedLocation.classification === 'Poor' ? 'destructive' : 
                                selectedLocation.classification === 'Good' ? 'secondary' : 'default'}
                      >
                        {selectedLocation.classification}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Updated:</span>
                      <span className="text-sm text-muted-foreground">{selectedLocation.lastUpdated}</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    View Detailed Report
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click on a location marker to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Locations:</span>
                <span className="font-medium">{filteredData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Poor Quality:</span>
                <span className="font-medium text-red-500">
                  {filteredData.filter(l => l.classification === 'Poor').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Good Quality:</span>
                <span className="font-medium text-yellow-500">
                  {filteredData.filter(l => l.classification === 'Good').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Excellent Quality:</span>
                <span className="font-medium text-green-500">
                  {filteredData.filter(l => l.classification === 'Excellent').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
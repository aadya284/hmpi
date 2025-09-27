import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { MapPin, Plus, X } from 'lucide-react'

const heavyMetals = [
  { symbol: 'Pb', name: 'Lead', unit: 'mg/L', limit: 0.01 },
  { symbol: 'Cd', name: 'Cadmium', unit: 'mg/L', limit: 0.003 },
  { symbol: 'Cr', name: 'Chromium', unit: 'mg/L', limit: 0.05 },
  { symbol: 'Cu', name: 'Copper', unit: 'mg/L', limit: 1.3 },
  { symbol: 'Zn', name: 'Zinc', unit: 'mg/L', limit: 5.0 },
  { symbol: 'Ni', name: 'Nickel', unit: 'mg/L', limit: 0.02 },
  { symbol: 'As', name: 'Arsenic', unit: 'mg/L', limit: 0.01 },
  { symbol: 'Hg', name: 'Mercury', unit: 'mg/L', limit: 0.002 }
]

export function DataInput({ onDataUpdate }) {
  const [sampleData, setSampleData] = useState({
    location: '',
    coordinates: { lat: '', lng: '' },
    sampleDate: '',
    concentrations: {},
    collectedBy: '',
    notes: ''
  })

  const [samples, setSamples] = useState([])

  const handleConcentrationChange = (metal, value) => {
    setSampleData(prev => ({
      ...prev,
      concentrations: {
        ...prev.concentrations,
        [metal]: parseFloat(value) || 0
      }
    }))
  }

  const addSample = () => {
    if (!sampleData.location || Object.keys(sampleData.concentrations).length === 0) {
      return
    }

    const newSample = {
      ...sampleData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }

    const updatedSamples = [...samples, newSample]
    setSamples(updatedSamples)
    onDataUpdate(updatedSamples)

    // Reset form
    setSampleData({
      location: '',
      coordinates: { lat: '', lng: '' },
      sampleDate: '',
      concentrations: {},
      collectedBy: '',
      notes: ''
    })
  }

  const removeSample = (id) => {
    const updatedSamples = samples.filter(sample => sample.id !== id)
    setSamples(updatedSamples)
    onDataUpdate(updatedSamples)
  }

  const loadSampleData = () => {
    // Load sample data for demonstration
    const mockSamples = [
      {
        id: 1,
        location: 'Mumbai Industrial Area',
        coordinates: { lat: '19.0760', lng: '72.8777' },
        sampleDate: '2024-01-15',
        concentrations: { Pb: 0.025, Cd: 0.008, Cr: 0.12, Cu: 0.85, Zn: 2.3, As: 0.015 },
        collectedBy: 'Environmental Team A',
        notes: 'Near industrial discharge point'
      },
      {
        id: 2,
        location: 'Delhi Yamuna Basin',
        coordinates: { lat: '28.7041', lng: '77.1025' },
        sampleDate: '2024-01-20',
        concentrations: { Pb: 0.018, Cd: 0.005, Cr: 0.08, Cu: 1.2, Zn: 3.1, As: 0.012 },
        collectedBy: 'Environmental Team B',
        notes: 'River basin sample'
      }
    ]
    setSamples(mockSamples)
    onDataUpdate(mockSamples)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Groundwater Sample Data Input
        </CardTitle>
        <CardDescription>
          Enter heavy metal concentration data with geo-coordinates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Sample Location</Label>
            <Input
              id="location"
              placeholder="e.g., Mumbai Industrial Area"
              value={sampleData.location}
              onChange={(e) => setSampleData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sampleDate">Sample Date</Label>
            <Input
              id="sampleDate"
              type="date"
              value={sampleData.sampleDate}
              onChange={(e) => setSampleData(prev => ({ ...prev, sampleDate: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              placeholder="e.g., 19.0760"
              value={sampleData.coordinates.lat}
              onChange={(e) => setSampleData(prev => ({ 
                ...prev, 
                coordinates: { ...prev.coordinates, lat: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              placeholder="e.g., 72.8777"
              value={sampleData.coordinates.lng}
              onChange={(e) => setSampleData(prev => ({ 
                ...prev, 
                coordinates: { ...prev.coordinates, lng: e.target.value }
              }))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Heavy Metal Concentrations</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heavyMetals.map(metal => (
              <div key={metal.symbol} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={metal.symbol} className="text-sm">
                    {metal.name} ({metal.symbol})
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    Limit: {metal.limit} {metal.unit}
                  </Badge>
                </div>
                <Input
                  id={metal.symbol}
                  type="number"
                  step="0.001"
                  placeholder={`Enter ${metal.symbol} concentration`}
                  value={sampleData.concentrations[metal.symbol] || ''}
                  onChange={(e) => handleConcentrationChange(metal.symbol, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="collectedBy">Collected By</Label>
          <Input
            id="collectedBy"
            placeholder="e.g., Environmental Team A"
            value={sampleData.collectedBy}
            onChange={(e) => setSampleData(prev => ({ ...prev, collectedBy: e.target.value }))}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={addSample} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Sample
          </Button>
          <Button variant="outline" onClick={loadSampleData}>
            Load Sample Data
          </Button>
        </div>

        {samples.length > 0 && (
          <div className="space-y-2">
            <Label>Added Samples ({samples.length})</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {samples.map(sample => (
                <div key={sample.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{sample.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {sample.sampleDate} • {Object.keys(sample.concentrations).length} metals tested
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSample(sample.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
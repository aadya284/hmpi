import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Map, MapPin, Layers, Filter, FileText, Calendar, AlertTriangle, CheckCircle, TrendingUp, Droplets, Shield, Download } from 'lucide-react'
import { LeafletMap } from './LeafletMap'

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
  },
  {
    id: 7,
    location: 'Hyderabad Industrial Zone',
    lat: 17.3850,
    lng: 78.4867,
    hmpi: 67.4,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-19'
  },
  {
    id: 8,
    location: 'Ahmedabad Chemical Belt',
    lat: 23.0225,
    lng: 72.5714,
    hmpi: 142.3,
    classification: 'Poor',
    color: '#ef4444',
    lastUpdated: '2024-01-16'
  },
  {
    id: 9,
    location: 'Kochi Port Area',
    lat: 9.9312,
    lng: 76.2673,
    hmpi: 28.9,
    classification: 'Excellent',
    color: '#22c55e',
    lastUpdated: '2024-01-24'
  },
  {
    id: 10,
    location: 'Indore Industrial Hub',
    lat: 22.7196,
    lng: 75.8577,
    hmpi: 89.7,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-23'
  },
  {
    id: 11,
    location: 'Jaipur Textile Zone',
    lat: 26.9124,
    lng: 75.7873,
    hmpi: 76.2,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-17'
  },
  {
    id: 12,
    location: 'Lucknow Urban Area',
    lat: 26.8467,
    lng: 80.9462,
    hmpi: 58.4,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-26'
  },
  {
    id: 13,
    location: 'Bhubaneswar Industrial',
    lat: 20.2961,
    lng: 85.8245,
    hmpi: 134.8,
    classification: 'Poor',
    color: '#ef4444',
    lastUpdated: '2024-01-14'
  },
  {
    id: 14,
    location: 'Chandigarh Tech City',
    lat: 30.7333,
    lng: 76.7794,
    hmpi: 41.2,
    classification: 'Excellent',
    color: '#22c55e',
    lastUpdated: '2024-01-27'
  },
  {
    id: 15,
    location: 'Coimbatore Manufacturing',
    lat: 11.0168,
    lng: 76.9558,
    hmpi: 82.5,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-13'
  },
  {
    id: 16,
    location: 'Vadodara Petrochemical',
    lat: 22.3072,
    lng: 73.1812,
    hmpi: 156.7,
    classification: 'Poor',
    color: '#ef4444',
    lastUpdated: '2024-01-12'
  },
  {
    id: 17,
    location: 'Mysore Heritage Zone',
    lat: 12.2958,
    lng: 76.6394,
    hmpi: 35.6,
    classification: 'Excellent',
    color: '#22c55e',
    lastUpdated: '2024-01-28'
  },
  {
    id: 18,
    location: 'Nagpur Industrial',
    lat: 21.1458,
    lng: 79.0882,
    hmpi: 91.3,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-11'
  },
  {
    id: 19,
    location: 'Visakhapatnam Port',
    lat: 17.6868,
    lng: 83.2185,
    hmpi: 118.4,
    classification: 'Poor',
    color: '#ef4444',
    lastUpdated: '2024-01-10'
  },
  {
    id: 20,
    location: 'Thiruvananthapuram',
    lat: 8.5241,
    lng: 76.9366,
    hmpi: 29.7,
    classification: 'Excellent',
    color: '#22c55e',
    lastUpdated: '2024-01-29'
  },
  {
    id: 21,
    location: 'Bhopal Urban',
    lat: 23.2599,
    lng: 77.4126,
    hmpi: 73.8,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-09'
  },
  {
    id: 22,
    location: 'Patna Industrial',
    lat: 25.5941,
    lng: 85.1376,
    hmpi: 98.2,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-08'
  },
  {
    id: 23,
    location: 'Ludhiana Textile',
    lat: 30.9010,
    lng: 75.8573,
    hmpi: 127.5,
    classification: 'Poor',
    color: '#ef4444',
    lastUpdated: '2024-01-07'
  },
  {
    id: 24,
    location: 'Nashik Industrial',
    lat: 19.9975,
    lng: 73.7898,
    hmpi: 64.1,
    classification: 'Good',
    color: '#eab308',
    lastUpdated: '2024-01-06'
  },
  {
    id: 25,
    location: 'Madurai Temple City',
    lat: 9.9252,
    lng: 78.1198,
    hmpi: 38.9,
    classification: 'Excellent',
    color: '#22c55e',
    lastUpdated: '2024-01-05'
  }
]

// Generate and download PDF report
function generatePDFReport(location) {
  const getRiskLevel = (hmpi) => {
    if (hmpi > 100) return { level: 'High Risk', color: '#dc2626' }
    if (hmpi > 50) return { level: 'Moderate Risk', color: '#d97706' }
    return { level: 'Low Risk', color: '#16a34a' }
  }

  const getRecommendations = (hmpi) => {
    if (hmpi > 100) return [
      'Immediate water treatment required',
      'Regular monitoring every 15 days',
      'Consider alternative water sources',
      'Implement advanced filtration systems'
    ]
    if (hmpi > 50) return [
      'Enhanced monitoring recommended',
      'Consider basic water treatment',
      'Regular quality assessments',
      'Community awareness programs'
    ]
    return [
      'Maintain current monitoring schedule',
      'Continue existing water management practices',
      'Regular quality checks sufficient',
      'Good water quality maintained'
    ]
  }

  const riskInfo = getRiskLevel(location.hmpi)
  const recommendations = getRecommendations(location.hmpi)

  // Create HTML content for the report
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Water Quality Report - ${location.location}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .info-card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; background: #f9fafb; }
        .info-card h3 { margin: 0 0 10px 0; color: #374151; font-size: 14px; }
        .info-card p { margin: 5px 0; font-size: 13px; }
        .hmpi-score { font-size: 24px; font-weight: bold; color: ${riskInfo.color}; }
        .risk-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; color: white; background: ${riskInfo.color}; }
        .data-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .data-table th, .data-table td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        .data-table th { background: #f3f4f6; font-weight: bold; }
        .recommendations { background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; }
        .recommendations ul { margin: 10px 0; padding-left: 20px; }
        .recommendations li { margin: 5px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Water Quality Assessment Report</h1>
        <h2>${location.location}</h2>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Location Information</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>Location Details</h3>
            <p><strong>Name:</strong> ${location.location}</p>
            <p><strong>Coordinates:</strong> ${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}°</p>
            <p><strong>Last Updated:</strong> ${location.lastUpdated}</p>
          </div>
          <div class="info-card">
            <h3>HMPI Assessment</h3>
            <p class="hmpi-score">${location.hmpi}</p>
            <span class="risk-badge">${riskInfo.level}</span>
            <p><strong>Classification:</strong> ${location.classification}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Water Quality Analysis</h2>
        <table class="data-table">
          <tr>
            <th>Parameter</th>
            <th>Value</th>
            <th>Unit</th>
          </tr>
          <tr>
            <td>Lead (Pb)</td>
            <td>${(location.hmpi * 0.8).toFixed(2)}</td>
            <td>mg/L</td>
          </tr>
          <tr>
            <td>Cadmium (Cd)</td>
            <td>${(location.hmpi * 0.3).toFixed(2)}</td>
            <td>mg/L</td>
          </tr>
          <tr>
            <td>Mercury (Hg)</td>
            <td>${(location.hmpi * 0.1).toFixed(2)}</td>
            <td>mg/L</td>
          </tr>
          <tr>
            <td>Arsenic (As)</td>
            <td>${(location.hmpi * 0.4).toFixed(2)}</td>
            <td>mg/L</td>
          </tr>
          <tr>
            <td>Chromium (Cr)</td>
            <td>${(location.hmpi * 0.2).toFixed(2)}</td>
            <td>mg/L</td>
          </tr>
          <tr>
            <td>pH Level</td>
            <td>7.2 ± 0.3</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Dissolved Oxygen</td>
            <td>6.8</td>
            <td>mg/L</td>
          </tr>
          <tr>
            <td>Turbidity</td>
            <td>2.1</td>
            <td>NTU</td>
          </tr>
          <tr>
            <td>Total Dissolved Solids</td>
            <td>485</td>
            <td>mg/L</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h2>Risk Assessment</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>Health Impact</h3>
            ${location.hmpi > 100 ? `
              <p>⚠️ High risk of chronic diseases</p>
              <p>⚠️ Not suitable for drinking</p>
              <p>⚠️ Immediate treatment required</p>
            ` : location.hmpi > 50 ? `
              <p>⚠️ Moderate health concerns</p>
              <p>⚠️ Limited drinking use</p>
              <p>⚠️ Regular monitoring needed</p>
            ` : `
              <p>✅ Low health risk</p>
              <p>✅ Safe for consumption</p>
              <p>✅ Good water quality</p>
            `}
          </div>
          <div class="info-card">
            <h3>Population Impact</h3>
            <p><strong>Affected Population:</strong> ${Math.floor(location.hmpi * 50)} people</p>
            <p><strong>Risk Level:</strong> ${riskInfo.level}</p>
            <p><strong>Priority Level:</strong> ${location.hmpi > 100 ? 'High' : location.hmpi > 50 ? 'Medium' : 'Low'}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Recommendations & Action Plan</h2>
        <div class="recommendations">
          <h3>Immediate Actions Required:</h3>
          <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="section">
        <h2>Technical Information</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>Sampling Details</h3>
            <p><strong>Sample ID:</strong> HMPI-${location.id.toString().padStart(3, '0')}</p>
            <p><strong>Collection Method:</strong> Standard Protocol</p>
            <p><strong>Analysis Lab:</strong> Central Water Authority</p>
          </div>
          <div class="info-card">
            <h3>Quality Standards</h3>
            <p><strong>WHO Standard:</strong> 50 HMPI</p>
            <p><strong>BIS Standard:</strong> 75 HMPI</p>
            <p><strong>Current Status:</strong> ${location.hmpi > 75 ? 'Non-compliant' : 'Compliant'}</p>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Report generated by Jal-Bhoomi Heavy Metal Pollution Index Monitoring System</p>
        <p>For more information, contact: support@jalbhoomi.gov.in</p>
      </div>
    </body>
    </html>
  `

  // Create a new window with the report
  const newWindow = window.open('', '_blank', 'width=800,height=1000,scrollbars=yes,resizable=yes')
  newWindow.document.write(htmlContent)
  newWindow.document.close()
  
  // Focus the new window
  newWindow.focus()
}

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
              {/* Real Leaflet Map */}
              <LeafletMap
                locations={filteredData}
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
                mapLayer={mapLayer}
              />

                {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">0-50: Excellent</span>
                    </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs">50-100: Good</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">100+: Poor</span>
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

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      console.log('Button clicked, generating report for:', selectedLocation.location)
                      generatePDFReport(selectedLocation)
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Detailed Report
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
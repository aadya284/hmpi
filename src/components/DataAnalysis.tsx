import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Upload, 
  FileSpreadsheet, 
  Calculator, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  Eye,
  Heart,
  Shield,
  Activity,
  Brain,
  Users
} from 'lucide-react'

// Metal limits and reference doses (mg/L)
const metalLimits = {
  Pb: 0.01, Cd: 0.003, Cr: 0.05, Cu: 1.3, Zn: 5.0, Ni: 0.02, As: 0.01, Hg: 0.002
}

const referenceDoses = {
  Pb: 0.0035, Cd: 0.0005, Cr: 0.003, Cu: 0.04, Zn: 0.3, Ni: 0.02, As: 0.0003, Hg: 0.0003
}

const cancerSlopes = {
  Pb: 0.0085, Cd: 6.1, Cr: 41, Cu: 0, Zn: 0, Ni: 0.84, As: 1.5, Hg: 0
}

const weightFactors = {
  Pb: 0.063, Cd: 0.222, Cr: 0.013, Cu: 0.005, Zn: 0.013, Ni: 0.033, As: 0.067, Hg: 0.333
}

interface SampleData {
  id: string
  location: string
  coordinates: { lat: string; lng: string }
  sampleDate: string
  concentrations: Record<string, number>
  collectedBy: string
  notes: string
}

interface AnalysisResult {
  hmpi: number
  classification: string
  color: string
  metalResults: Record<string, any>
  healthMetrics: {
    hi: number
    hq: Record<string, number>
    cr: Record<string, number>
    hei: number
    mi: number
    pli: number
    nipi: number
  }
}

export function DataAnalysis() {
  const [samples, setSamples] = useState<SampleData[]>([])
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [selectedSample, setSelectedSample] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate HMPI
  const calculateHMPI = (concentrations: Record<string, number>) => {
    let totalWeightedValues = 0
    let totalWeights = 0
    const metalResults: Record<string, any> = {}

    Object.entries(concentrations).forEach(([metal, concentration]) => {
      if (metalLimits[metal] && concentration > 0) {
        const subIndex = (concentration / metalLimits[metal]) * 100
        const weightedValue = subIndex * (weightFactors[metal] || 0.1)
        
        metalResults[metal] = {
          concentration,
          limit: metalLimits[metal],
          subIndex: Math.round(subIndex * 100) / 100,
          weightedValue: Math.round(weightedValue * 100) / 100,
          ratio: Math.round((concentration / metalLimits[metal]) * 100) / 100,
          status: concentration > metalLimits[metal] ? 'exceeded' : 'within_limit'
        }
        
        totalWeightedValues += weightedValue
        totalWeights += (weightFactors[metal] || 0.1)
      }
    })

    const hmpi = totalWeights > 0 ? totalWeightedValues / totalWeights : 0
    
    let classification = 'Excellent'
    let color = 'green'
    
    if (hmpi > 100) {
      classification = 'Poor'
      color = 'red'
    } else if (hmpi > 50) {
      classification = 'Good'
      color = 'yellow'
    }

    return {
      hmpi: Math.round(hmpi * 100) / 100,
      classification,
      color,
      metalResults,
      totalWeightedValues: Math.round(totalWeightedValues * 100) / 100,
      totalWeights: Math.round(totalWeights * 100) / 100
    }
  }

  // Calculate Health Metrics
  const calculateHealthMetrics = (concentrations: Record<string, number>) => {
    const hq: Record<string, number> = {}
    const cr: Record<string, number> = {}
    let hi = 0
    let hei = 0
    let mi = 0
    let pli = 0
    let nipi = 0

    // Calculate HQ (Hazard Quotient) and HI (Hazard Index)
    Object.entries(concentrations).forEach(([metal, concentration]) => {
      if (referenceDoses[metal] && concentration > 0) {
        hq[metal] = concentration / referenceDoses[metal]
        hi += hq[metal]
      }
    })

    // Calculate CR (Cancer Risk)
    Object.entries(concentrations).forEach(([metal, concentration]) => {
      if (cancerSlopes[metal] && concentration > 0) {
        cr[metal] = concentration * cancerSlopes[metal] * 0.001 // Assuming 1L/day consumption
      }
    })

    // Calculate HEI (Heavy metal Evaluation Index)
    Object.entries(concentrations).forEach(([metal, concentration]) => {
      if (metalLimits[metal] && concentration > 0) {
        hei += concentration / metalLimits[metal]
      }
    })

    // Calculate MI (Metal Index)
    Object.entries(concentrations).forEach(([metal, concentration]) => {
      if (metalLimits[metal] && concentration > 0) {
        mi += concentration / metalLimits[metal]
      }
    })

    // Calculate PLI (Pollution Load Index)
    let pliProduct = 1
    let pliCount = 0
    Object.entries(concentrations).forEach(([metal, concentration]) => {
      if (metalLimits[metal] && concentration > 0) {
        pliProduct *= concentration / metalLimits[metal]
        pliCount++
      }
    })
    pli = pliCount > 0 ? Math.pow(pliProduct, 1/pliCount) : 0

    // Calculate NIPI (Nemerow Integrated Pollution Index)
    let maxRatio = 0
    let sumRatios = 0
    let ratioCount = 0
    Object.entries(concentrations).forEach(([metal, concentration]) => {
      if (metalLimits[metal] && concentration > 0) {
        const ratio = concentration / metalLimits[metal]
        maxRatio = Math.max(maxRatio, ratio)
        sumRatios += ratio
        ratioCount++
      }
    })
    const avgRatio = ratioCount > 0 ? sumRatios / ratioCount : 0
    nipi = Math.sqrt((maxRatio * maxRatio + avgRatio * avgRatio) / 2)

    return {
      hi: Math.round(hi * 100) / 100,
      hq: Object.fromEntries(Object.entries(hq).map(([k, v]) => [k, Math.round(v * 100) / 100])),
      cr: Object.fromEntries(Object.entries(cr).map(([k, v]) => [k, Math.round(v * 1000000) / 1000000])),
      hei: Math.round(hei * 100) / 100,
      mi: Math.round(mi * 100) / 100,
      pli: Math.round(pli * 100) / 100,
      nipi: Math.round(nipi * 100) / 100
    }
  }

  // Parse CSV/Excel data
  const parseFileData = (text: string): SampleData[] => {
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    const samples: SampleData[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      if (values.length < headers.length) continue
      
      const concentrations: Record<string, number> = {}
      const metalHeaders = headers.filter(h => metalLimits[h])
      
      metalHeaders.forEach(metal => {
        const index = headers.indexOf(metal)
        if (index !== -1 && values[index]) {
          concentrations[metal] = parseFloat(values[index]) || 0
        }
      })
      
      if (Object.keys(concentrations).length > 0) {
        samples.push({
          id: `sample_${Date.now()}_${i}`,
          location: values[headers.indexOf('location')] || `Sample ${i}`,
          coordinates: {
            lat: values[headers.indexOf('lat')] || values[headers.indexOf('latitude')] || '',
            lng: values[headers.indexOf('lng')] || values[headers.indexOf('longitude')] || ''
          },
          sampleDate: values[headers.indexOf('date')] || values[headers.indexOf('sampleDate')] || new Date().toISOString().split('T')[0],
          concentrations,
          collectedBy: values[headers.indexOf('collectedBy')] || 'Unknown',
          notes: values[headers.indexOf('notes')] || ''
        })
      }
    }
    
    return samples
  }

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError('')

    try {
      const text = await file.text()
      const newSamples = parseFileData(text)
      
      if (newSamples.length === 0) {
        setUploadError('No valid data found in the file. Please check the format.')
        return
      }

      setSamples(newSamples)
      
      // Calculate analysis results
      const results = newSamples.map(sample => ({
        ...sample,
        hmpiResult: calculateHMPI(sample.concentrations),
        healthMetrics: calculateHealthMetrics(sample.concentrations)
      }))
      
      setAnalysisResults(results)
      setSelectedSample(results[0]?.id || null)
      
    } catch (error) {
      setUploadError('Error reading file. Please ensure it\'s a valid CSV file.')
    } finally {
      setIsUploading(false)
    }
  }

  // Download results as CSV
  const downloadResults = () => {
    if (analysisResults.length === 0) return

    const headers = [
      'Location', 'Date', 'HMPI', 'Classification', 'HI', 'HEI', 'MI', 'PLI', 'NIPI',
      ...Object.keys(metalLimits).map(m => `${m}_Concentration`),
      ...Object.keys(metalLimits).map(m => `${m}_HQ`),
      ...Object.keys(metalLimits).map(m => `${m}_CR`)
    ]

    const rows = analysisResults.map(result => [
      result.location,
      result.sampleDate,
      result.hmpiResult.hmpi,
      result.hmpiResult.classification,
      result.healthMetrics.hi,
      result.healthMetrics.hei,
      result.healthMetrics.mi,
      result.healthMetrics.pli,
      result.healthMetrics.nipi,
      ...Object.keys(metalLimits).map(m => result.concentrations[m] || 0),
      ...Object.keys(metalLimits).map(m => result.healthMetrics.hq[m] || 0),
      ...Object.keys(metalLimits).map(m => result.healthMetrics.cr[m] || 0)
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hmpi_analysis_results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'exceeded':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'within_limit':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getRiskLevel = (value: number, thresholds: { low: number; moderate: number; high: number }) => {
    if (value >= thresholds.high) return { level: 'High', color: 'red' }
    if (value >= thresholds.moderate) return { level: 'Moderate', color: 'yellow' }
    return { level: 'Low', color: 'green' }
  }

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Data Upload & Analysis
          </CardTitle>
          <CardDescription>
            Upload Excel/CSV files with heavy metal concentration data for automatic HMPI and health metrics calculation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload your data file</h3>
              <p className="text-sm text-muted-foreground">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </p>
              <p className="text-xs text-muted-foreground">
                Required columns: location, lat/lng, date, and metal concentrations (Pb, Cd, Cr, Cu, Zn, Ni, As, Hg)
              </p>
            </div>
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Processing...' : 'Choose File'}
              </Button>
            </div>
          </div>

          {uploadError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{uploadError}</AlertDescription>
            </Alert>
          )}

          {samples.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">
                  {samples.length} sample{samples.length !== 1 ? 's' : ''} loaded successfully
                </span>
              </div>
              <Button variant="outline" onClick={downloadResults} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Results
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              Comprehensive HMPI and health metrics calculation results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="hmpi">HMPI Analysis</TabsTrigger>
                <TabsTrigger value="health">Health Metrics</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {analysisResults.length}
                        </div>
                        <p className="text-sm text-muted-foreground">Samples Analyzed</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(analysisResults.reduce((sum, r) => sum + r.hmpiResult.hmpi, 0) / analysisResults.length * 100) / 100}
                        </div>
                        <p className="text-sm text-muted-foreground">Average HMPI</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {analysisResults.filter(r => r.hmpiResult.classification === 'Poor').length}
                        </div>
                        <p className="text-sm text-muted-foreground">High Risk Samples</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {Math.round(analysisResults.reduce((sum, r) => sum + r.healthMetrics.hi, 0) / analysisResults.length * 100) / 100}
                        </div>
                        <p className="text-sm text-muted-foreground">Average HI</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Sample Summary</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {analysisResults.map((result, index) => (
                      <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Button
                            variant={selectedSample === result.id ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedSample(result.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <div>
                            <p className="font-medium">{result.location}</p>
                            <p className="text-sm text-muted-foreground">{result.sampleDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={result.hmpiResult.color === 'red' ? 'destructive' : 
                                    result.hmpiResult.color === 'yellow' ? 'secondary' : 'default'}
                          >
                            HMPI: {result.hmpiResult.hmpi}
                          </Badge>
                          <Badge variant="outline">
                            HI: {result.healthMetrics.hi}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hmpi" className="space-y-4">
                {selectedSample && analysisResults.find(r => r.id === selectedSample) && (
                  (() => {
                    const result = analysisResults.find(r => r.id === selectedSample)!
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{result.location}</h4>
                            <p className="text-sm text-muted-foreground">{result.sampleDate}</p>
                          </div>
                          <Badge 
                            variant={result.hmpiResult.color === 'red' ? 'destructive' : 
                                    result.hmpiResult.color === 'yellow' ? 'secondary' : 'default'}
                          >
                            {result.hmpiResult.classification}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className={`text-2xl font-bold ${
                                  result.hmpiResult.color === 'red' ? 'text-red-500' :
                                  result.hmpiResult.color === 'yellow' ? 'text-yellow-500' :
                                  'text-green-500'
                                }`}>
                                  {result.hmpiResult.hmpi}
                                </div>
                                <p className="text-sm text-muted-foreground">HMPI Value</p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold">
                                  {Object.keys(result.hmpiResult.metalResults).length}
                                </div>
                                <p className="text-sm text-muted-foreground">Metals Tested</p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-red-500">
                                  {Object.values(result.hmpiResult.metalResults).filter(m => m.status === 'exceeded').length}
                                </div>
                                <p className="text-sm text-muted-foreground">Limits Exceeded</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h5 className="font-medium mb-3">Metal Analysis Details</h5>
                          <div className="space-y-3">
                            {Object.entries(result.hmpiResult.metalResults).map(([metal, analysis]) => (
                              <div key={metal} className="flex items-center gap-4 p-3 border rounded-lg">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  {getStatusIcon(analysis.status)}
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{metal}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {analysis.concentration} mg/L
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Limit: {analysis.limit} mg/L • Ratio: {analysis.ratio}x
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 w-20">
                                  <div className="text-right text-sm font-medium">
                                    SI: {analysis.subIndex}
                                  </div>
                                  <Progress 
                                    value={Math.min(analysis.subIndex, 200)} 
                                    max={200}
                                    className="h-2"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })()
                )}
              </TabsContent>

              <TabsContent value="health" className="space-y-4">
                {selectedSample && analysisResults.find(r => r.id === selectedSample) && (
                  (() => {
                    const result = analysisResults.find(r => r.id === selectedSample)!
                    const healthMetrics = result.healthMetrics
                    
                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className={`text-2xl font-bold ${
                                  healthMetrics.hi > 1 ? 'text-red-500' : 
                                  healthMetrics.hi > 0.5 ? 'text-yellow-500' : 'text-green-500'
                                }`}>
                                  {healthMetrics.hi}
                                </div>
                                <p className="text-sm text-muted-foreground">Hazard Index (HI)</p>
                                <p className="text-xs text-muted-foreground">
                                  {healthMetrics.hi > 1 ? 'High Risk' : healthMetrics.hi > 0.5 ? 'Moderate Risk' : 'Low Risk'}
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className={`text-2xl font-bold ${
                                  healthMetrics.hei > 10 ? 'text-red-500' : 
                                  healthMetrics.hei > 5 ? 'text-yellow-500' : 'text-green-500'
                                }`}>
                                  {healthMetrics.hei}
                                </div>
                                <p className="text-sm text-muted-foreground">Heavy metal Evaluation Index (HEI)</p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className={`text-2xl font-bold ${
                                  healthMetrics.mi > 10 ? 'text-red-500' : 
                                  healthMetrics.mi > 5 ? 'text-yellow-500' : 'text-green-500'
                                }`}>
                                  {healthMetrics.mi}
                                </div>
                                <p className="text-sm text-muted-foreground">Metal Index (MI)</p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className={`text-2xl font-bold ${
                                  healthMetrics.pli > 1 ? 'text-red-500' : 
                                  healthMetrics.pli > 0.5 ? 'text-yellow-500' : 'text-green-500'
                                }`}>
                                  {healthMetrics.pli}
                                </div>
                                <p className="text-sm text-muted-foreground">Pollution Load Index (PLI)</p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className={`text-2xl font-bold ${
                                  healthMetrics.nipi > 2 ? 'text-red-500' : 
                                  healthMetrics.nipi > 1 ? 'text-yellow-500' : 'text-green-500'
                                }`}>
                                  {healthMetrics.nipi}
                                </div>
                                <p className="text-sm text-muted-foreground">Nemerow Integrated Pollution Index (NIPI)</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Hazard Quotients (HQ)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {Object.entries(healthMetrics.hq).map(([metal, hq]) => (
                                <div key={metal} className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{metal}</span>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={hq > 1 ? 'destructive' : hq > 0.5 ? 'secondary' : 'default'}>
                                      {hq}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {hq > 1 ? 'High' : hq > 0.5 ? 'Moderate' : 'Low'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Cancer Risks (CR)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {Object.entries(healthMetrics.cr).map(([metal, cr]) => (
                                <div key={metal} className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{metal}</span>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={cr > 1e-4 ? 'destructive' : cr > 1e-5 ? 'secondary' : 'default'}>
                                      {(cr * 1000000).toFixed(2)}×10⁻⁶
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {cr > 1e-4 ? 'High' : cr > 1e-5 ? 'Moderate' : 'Low'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )
                  })()
                )}
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                <div className="space-y-4">
                  {analysisResults.map((result, index) => (
                    <Card key={result.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{result.location}</span>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={result.hmpiResult.color === 'red' ? 'destructive' : 
                                      result.hmpiResult.color === 'yellow' ? 'secondary' : 'default'}
                            >
                              HMPI: {result.hmpiResult.hmpi}
                            </Badge>
                            <Badge variant="outline">
                              HI: {result.healthMetrics.hi}
                            </Badge>
                          </div>
                        </CardTitle>
                        <CardDescription>{result.sampleDate}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{result.healthMetrics.hi}</div>
                            <div className="text-xs text-muted-foreground">HI</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{result.healthMetrics.hei}</div>
                            <div className="text-xs text-muted-foreground">HEI</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">{result.healthMetrics.mi}</div>
                            <div className="text-xs text-muted-foreground">MI</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{result.healthMetrics.pli}</div>
                            <div className="text-xs text-muted-foreground">PLI</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

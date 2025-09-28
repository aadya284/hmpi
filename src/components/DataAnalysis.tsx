import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Upload, 
  FileText, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Loader2,
  FileSpreadsheet,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react'

interface HMPIResult {
  hmpi: number
  hazard_index: number
  risk_category: {
    category: string
    color: string
    description: string
  }
  hazard_quotients: Record<string, {
    concentration: number
    standard_limit: number
    quality_index: number
    hazard_quotient: number
    unit_weight: number
  }>
  metal_contributions: Record<string, {
    contribution: number
    percentage: number
  }>
  quality_ratios: Record<string, {
    ratio: number
    status: string
  }>
  visualization?: string
}

interface AnalysisResult {
  success: boolean
  filename?: string
  overall_statistics?: {
    total_samples: number
    average_hmpi: number
    min_hmpi: number
    max_hmpi: number
    std_hmpi: number
    risk_distribution: Record<string, number>
  }
  samples?: Array<{
    sample_id: string
    hmpi: number
    hazard_index: number
    risk_category: {
      category: string
      color: string
      description: string
    }
    hazard_quotients: Record<string, any>
    visualization?: string
  }>
  results?: HMPIResult
  analysis_timestamp?: string
}

export function DataAnalysis() {
  const [isUploading, setIsUploading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedSample, setSelectedSample] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_BASE_URL = 'http://localhost:8000'

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE_URL}/calculate`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Upload failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to backend server. Please ensure the backend is running on http://localhost:8000')
      } else {
        setError(err instanceof Error ? err.message : 'Upload failed')
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleDirectCalculation = async () => {
    // Sample data for direct calculation
    const sampleData = {
      'Lead (Pb)': 0.015,
      'Cadmium (Cd)': 0.004,
      'Mercury (Hg)': 0.0012,
      'Arsenic (As)': 0.012,
      'Chromium (Cr)': 0.08
    }

    setIsUploading(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const response = await fetch(`${API_BASE_URL}/calculate-direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sampleData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Calculation failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to backend server. Please ensure the backend is running on http://localhost:8000')
      } else {
        setError(err instanceof Error ? err.message : 'Calculation failed')
      }
    } finally {
      setIsUploading(false)
    }
  }

  const getRiskColor = (category: string) => {
    const colors: Record<string, string> = {
      'Safe': 'bg-green-100 text-green-800',
      'Moderate': 'bg-yellow-100 text-yellow-800',
      'Risky': 'bg-orange-100 text-orange-800',
      'High Risk': 'bg-red-100 text-red-800',
      'Critical': 'bg-red-200 text-red-900'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const renderHMPIOverview = (result: AnalysisResult) => {
    if (result.overall_statistics) {
      const stats = result.overall_statistics
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Average HMPI</span>
              </div>
              <p className="text-2xl font-bold">{stats.average_hmpi.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Total Samples</span>
              </div>
              <p className="text-2xl font-bold">{stats.total_samples}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Range</span>
              </div>
              <p className="text-sm">{stats.min_hmpi.toFixed(2)} - {stats.max_hmpi.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Std Deviation</span>
              </div>
              <p className="text-2xl font-bold">{stats.std_hmpi.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      )
    }
    return null
  }

  const renderSampleDetails = (sample: any) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="font-medium">HMPI Score</span>
              </div>
              <p className="text-2xl font-bold">{sample.hmpi.toFixed(2)}</p>
              <Badge className={`mt-2 ${getRiskColor(sample.risk_category.category)}`}>
                {sample.risk_category.category}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="font-medium">Hazard Index</span>
              </div>
              <p className="text-2xl font-bold">{sample.hazard_index.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {sample.hazard_index > 1 ? 'Exceeds safe limit' : 'Within safe limit'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="font-medium">Risk Level</span>
              </div>
              <p className="text-sm text-gray-600">{sample.risk_category.description}</p>
            </CardContent>
          </Card>
        </div>

        {sample.visualization && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analysis Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={sample.visualization} 
                alt="HMPI Analysis Chart" 
                className="w-full h-auto rounded-lg border"
              />
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Data Analysis</h2>
        <p className="text-muted-foreground">
          Upload lab reports to automatically calculate HMPI and health metrics
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Lab Report
          </CardTitle>
          <CardDescription>
            Upload CSV or Excel files containing metal concentration data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
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
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              {isUploading ? 'Processing...' : 'Upload File'}
            </Button>

            <Button
              onClick={handleDirectCalculation}
              disabled={isUploading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Activity className="h-4 w-4" />
              )}
              {isUploading ? 'Calculating...' : 'Test with Sample Data'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                {analysisResult.filename && `File: ${analysisResult.filename}`}
                {analysisResult.analysis_timestamp && (
                  <span className="ml-2">
                    • Analyzed: {new Date(analysisResult.analysis_timestamp).toLocaleString()}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="samples">Samples</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {renderHMPIOverview(analysisResult)}
                  
                  {analysisResult.overall_statistics?.risk_distribution && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Risk Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {Object.entries(analysisResult.overall_statistics.risk_distribution).map(([category, count]) => (
                            <div key={category} className="text-center">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(category)}`}>
                                {category}
                              </div>
                              <p className="text-2xl font-bold mt-2">{count}</p>
                              <p className="text-xs text-gray-500">samples</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="samples" className="space-y-4">
                  {analysisResult.samples && analysisResult.samples.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex gap-2 flex-wrap">
                        {analysisResult.samples.map((sample, index) => (
                          <Button
                            key={index}
                            variant={selectedSample === index ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSample(index)}
                          >
                            {sample.sample_id}
                          </Button>
                        ))}
                      </div>
                      
                      {renderSampleDetails(analysisResult.samples[selectedSample])}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No sample data available</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  {analysisResult.results && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Hazard Quotients</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(analysisResult.results.hazard_quotients).map(([metal, data]) => (
                              <div key={metal} className="flex justify-between items-center p-2 border rounded">
                                <span className="font-medium">{metal}</span>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600">
                                    {data.concentration.toFixed(4)} mg/L
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    HQ: {data.hazard_quotient.toFixed(2)}
                                  </span>
                                  <Badge variant={data.hazard_quotient > 1 ? "destructive" : "secondary"}>
                                    {data.hazard_quotient > 1 ? 'Exceeded' : 'Safe'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
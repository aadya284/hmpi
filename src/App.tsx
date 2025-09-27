import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { DataAnalysis } from './components/DataAnalysis'
import { GeospatialMap } from './components/GeospatialMap'
import { TimelineAnalysis } from './components/TimelineAnalysis'
import { HealthMetrics } from './components/HealthMetrics'
import { AlertSystem } from './components/AlertSystem'
import { RemediationSuggestions } from './components/RemediationSuggestions'
import { 
  Calculator, 
  Map, 
  TrendingUp, 
  Heart, 
  AlertTriangle, 
  Lightbulb, 
  Database,
  Activity,
  Shield,
  Droplets,
  BarChart3,
  Users
} from 'lucide-react'
import { Login } from './components/Login'
import { Button } from './components/ui/button'

type UserRole = 'policymaker' | 'scientist' | 'researcher'

export default function App() {
  const [sampleData, setSampleData] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<{ name: string; role: UserRole } | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('hmpi_user')
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {}
    }
  }, [])

  const handleDataUpdate = (newData) => {
    setSampleData(newData)
  }

  const handleLogin = (payload: { name: string; role: UserRole }) => {
    setUser(payload)
    localStorage.setItem('hmpi_user', JSON.stringify(payload))
  }

  const handleSignOut = () => {
    localStorage.removeItem('hmpi_user')
    setUser(null)
  }

  const getOverviewStats = () => {
    if (sampleData.length === 0) {
      return {
        totalSamples: 0,
        avgHMPI: 0,
        riskLocations: 0,
        metalsMonitored: 0
      }
    }

    const totalSamples = sampleData.length
    const avgHMPI = sampleData.reduce((sum, sample) => {
      const concentrations = sample.concentrations || {}
      // Simple HMPI calculation for overview
      const metalValues = Object.values(concentrations)
      const avgConcentration = metalValues.reduce((a, b) => a + b, 0) / metalValues.length
      return sum + (avgConcentration * 50) // Simplified calculation
    }, 0) / totalSamples

    const riskLocations = sampleData.filter(sample => {
      const concentrations = sample.concentrations || {}
      const metalValues = Object.values(concentrations)
      const avgConcentration = metalValues.reduce((a, b) => a + b, 0) / metalValues.length
      return (avgConcentration * 50) > 75 // Simplified risk threshold
    }).length

    const allMetals = new Set()
    sampleData.forEach(sample => {
      Object.keys(sample.concentrations || {}).forEach(metal => allMetals.add(metal))
    })

    return {
      totalSamples,
      avgHMPI: Math.round(avgHMPI * 10) / 10,
      riskLocations,
      metalsMonitored: allMetals.size
    }
  }

  const stats = getOverviewStats()

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold">AquaGuard HMPI</h1>
                  <p className="text-xs text-muted-foreground">Heavy Metal Pollution Index Monitoring System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                System Active
              </Badge>
              <Badge variant="secondary">
                v2.1.0
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {user.name}
                </span>
                <Button size="sm" variant="outline" onClick={handleSignOut}>Sign out</Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="data-analysis" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Data Analysis
            </TabsTrigger>
            <TabsTrigger value="geospatial" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Geospatial Map
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Health Metrics
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Samples</p>
                      <p className="text-2xl font-bold">{stats.totalSamples}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Calculator className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average HMPI</p>
                      <p className="text-2xl font-bold">{stats.avgHMPI || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Locations</p>
                      <p className="text-2xl font-bold">{stats.riskLocations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Activity className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Metals Monitored</p>
                      <p className="text-2xl font-bold">{stats.metalsMonitored}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    System Features
                  </CardTitle>
                  <CardDescription>
                    Comprehensive heavy metal pollution monitoring and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Calculator className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Automated HMPI Calculation</h4>
                        <p className="text-sm text-muted-foreground">Standard methodology with real-time computation</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Map className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">Geospatial Heatmap</h4>
                        <p className="text-sm text-muted-foreground">Interactive mapping with contamination visualization</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium">Predictive Analysis</h4>
                        <p className="text-sm text-muted-foreground">Timeline trends and future HMPI predictions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Heart className="h-5 w-5 text-red-500" />
                      <div>
                        <h4 className="font-medium">Health Impact Assessment</h4>
                        <p className="text-sm text-muted-foreground">Population health metrics and risk analysis</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Get started with the HMPI monitoring system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      onClick={() => setActiveTab('data-analysis')} 
                      className="justify-start h-12"
                      variant="outline"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Upload & Analyze Data
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab('geospatial')} 
                      className="justify-start h-12"
                      variant="outline"
                    >
                      <Map className="h-4 w-4 mr-2" />
                      View Contamination Map
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab('alerts')} 
                      className="justify-start h-12"
                      variant="outline"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Check Active Alerts
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab('health')} 
                      className="justify-start h-12"
                      variant="outline"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Health Risk Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>About AquaGuard HMPI System</CardTitle>
                <CardDescription>
                  Advanced groundwater heavy metal pollution monitoring and analysis platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The Heavy Metal Pollution Index (HMPI) monitoring system provides automated calculation and assessment 
                  of groundwater contamination levels. Our platform integrates real-time data analysis, geospatial 
                  visualization, health impact assessment, and remediation planning to support environmental 
                  monitoring and public health protection.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium">For Scientists</h4>
                    <p className="text-xs text-muted-foreground">Research-grade analysis tools</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium">For Policymakers</h4>
                    <p className="text-xs text-muted-foreground">Evidence-based decision support</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                    <h4 className="font-medium">For Public Health</h4>
                    <p className="text-xs text-muted-foreground">Community protection and awareness</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Analysis Tab */}
          <TabsContent value="data-analysis" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Data Upload & Analysis</h2>
                <p className="text-muted-foreground">
                  Upload Excel/CSV files with heavy metal concentration data for automatic HMPI and health metrics calculation
                </p>
              </div>
              <DataAnalysis />
            </div>
          </TabsContent>

          {/* Geospatial Tab */}
          <TabsContent value="geospatial" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Geospatial Contamination Map</h2>
                <p className="text-muted-foreground">
                  Interactive heatmap showing geographic distribution of heavy metal contamination
                </p>
              </div>
              <GeospatialMap />
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Timeline Analysis & Predictions</h2>
                <p className="text-muted-foreground">
                  Track contamination trends over time and analyze metal concentration changes
                </p>
              </div>
              <TimelineAnalysis />
            </div>
          </TabsContent>

          {/* Health Metrics Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Health Impact Assessment</h2>
                <p className="text-muted-foreground">
                  Comprehensive health risk analysis and population impact assessment
                </p>
              </div>
              <HealthMetrics />
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Alert System & Notifications</h2>
                <p className="text-muted-foreground">
                  Real-time contamination alerts and emergency response management
                </p>
              </div>
              <AlertSystem />
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Tab for Remediation */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Remediation & Treatment Solutions
              </CardTitle>
              <CardDescription>
                Treatment methods and implementation strategies for contamination reduction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RemediationSuggestions />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">
                AquaGuard HMPI © 2024 - Environmental Monitoring System
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>System Status: Active</span>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
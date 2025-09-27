import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Heart, AlertTriangle, Shield, Users, Activity, Brain } from 'lucide-react'

const healthRiskData = {
  'Mumbai Industrial Area': {
    hmpi: 125.6,
    overallRisk: 'High',
    risks: {
      Pb: { level: 'Critical', score: 95, effects: ['Neurological damage', 'Kidney damage', 'Reproductive issues'] },
      Cd: { level: 'High', score: 80, effects: ['Kidney damage', 'Bone disease', 'Cancer risk'] },
      Cr: { level: 'High', score: 85, effects: ['Skin irritation', 'Lung damage', 'Cancer risk'] },
      Cu: { level: 'Moderate', score: 45, effects: ['Gastrointestinal issues', 'Liver damage'] },
      Zn: { level: 'Low', score: 25, effects: ['Nausea', 'Immune system effects'] },
      As: { level: 'High', score: 90, effects: ['Cancer risk', 'Skin problems', 'Cardiovascular disease'] }
    },
    populationImpact: {
      totalPopulation: 250000,
      atRisk: 187500,
      highRisk: 62500,
      vulnerableGroups: {
        children: 37500,
        pregnant: 8750,
        elderly: 25000
      }
    }
  },
  'Delhi Yamuna Basin': {
    hmpi: 78.2,
    overallRisk: 'Moderate',
    risks: {
      Pb: { level: 'Moderate', score: 55, effects: ['Mild neurological effects', 'Development issues'] },
      Cd: { level: 'Moderate', score: 60, effects: ['Kidney stress', 'Bone weakness'] },
      Cr: { level: 'Moderate', score: 50, effects: ['Minor skin irritation', 'Respiratory effects'] },
      Cu: { level: 'Low', score: 35, effects: ['Mild gastrointestinal discomfort'] },
      Zn: { level: 'Low', score: 20, effects: ['Minimal effects'] },
      As: { level: 'Moderate', score: 65, effects: ['Skin discoloration', 'Minor health effects'] }
    },
    populationImpact: {
      totalPopulation: 180000,
      atRisk: 108000,
      highRisk: 27000,
      vulnerableGroups: {
        children: 21600,
        pregnant: 5400,
        elderly: 18000
      }
    }
  }
}

const organSystems = {
  nervous: { name: 'Nervous System', icon: Brain, metals: ['Pb', 'Hg', 'As'] },
  kidney: { name: 'Kidney', icon: Activity, metals: ['Cd', 'Pb', 'Hg'] },
  cardiovascular: { name: 'Cardiovascular', icon: Heart, metals: ['As', 'Cd', 'Pb'] },
  respiratory: { name: 'Respiratory', icon: Activity, metals: ['Cr', 'Ni', 'As'] },
  reproductive: { name: 'Reproductive', icon: Users, metals: ['Pb', 'Cd', 'Hg'] },
  immune: { name: 'Immune System', icon: Shield, metals: ['Zn', 'Cu', 'Cr'] }
}

export function HealthMetrics() {
  const [selectedLocation, setSelectedLocation] = useState('Mumbai Industrial Area')
  const [selectedSystem, setSelectedSystem] = useState('all')

  const currentData = healthRiskData[selectedLocation]

  const getRiskColor = (level) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'moderate': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getRiskBadgeVariant = (level) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'moderate': return 'secondary'
      case 'low': return 'default'
      default: return 'outline'
    }
  }

  const getSystemRisk = (systemKey) => {
    const system = organSystems[systemKey]
    const relevantMetals = system.metals.filter(metal => currentData.risks[metal])
    const avgScore = relevantMetals.reduce((sum, metal) => sum + currentData.risks[metal].score, 0) / relevantMetals.length
    
    let level = 'Low'
    if (avgScore > 80) level = 'Critical'
    else if (avgScore > 60) level = 'High'
    else if (avgScore > 40) level = 'Moderate'
    
    return { level, score: Math.round(avgScore), metals: relevantMetals }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(healthRiskData).map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Badge 
          variant={getRiskBadgeVariant(currentData.overallRisk)}
          className="text-sm"
        >
          Overall Risk: {currentData.overallRisk}
        </Badge>
      </div>

      {currentData.overallRisk === 'High' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>High Health Risk Alert:</strong> This area shows elevated heavy metal concentrations 
            that pose significant health risks. Immediate action recommended for vulnerable populations.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Population</span>
            </div>
            <div className="text-2xl font-bold">{currentData.populationImpact.totalPopulation.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">At Risk</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {currentData.populationImpact.atRisk.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round((currentData.populationImpact.atRisk / currentData.populationImpact.totalPopulation) * 100)}% of population
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">High Risk</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {currentData.populationImpact.highRisk.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round((currentData.populationImpact.highRisk / currentData.populationImpact.totalPopulation) * 100)}% of population
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Vulnerable Groups</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(currentData.populationImpact.vulnerableGroups).reduce((a, b) => a + b, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Children, elderly, pregnant</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metals">Metal-Specific Risks</TabsTrigger>
          <TabsTrigger value="systems">Organ Systems</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="metals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(currentData.risks).map(([metal, risk]) => (
              <Card key={metal}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{metal === 'Pb' ? 'Lead' : metal === 'Cd' ? 'Cadmium' : metal === 'Cr' ? 'Chromium' : 
                           metal === 'Cu' ? 'Copper' : metal === 'Zn' ? 'Zinc' : 'Arsenic'} ({metal})</span>
                    <Badge variant={getRiskBadgeVariant(risk.level)}>
                      {risk.level}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Risk Score</span>
                      <span className="text-sm font-bold">{risk.score}/100</span>
                    </div>
                    <Progress value={risk.score} className="h-2" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Health Effects:</h4>
                    <ul className="space-y-1">
                      {risk.effects.map((effect, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 bg-current rounded-full flex-shrink-0" />
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="systems" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(organSystems).map(([systemKey, system]) => {
              const systemRisk = getSystemRisk(systemKey)
              const IconComponent = system.icon
              
              return (
                <Card key={systemKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      {system.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">System Risk:</span>
                      <Badge variant={getRiskBadgeVariant(systemRisk.level)}>
                        {systemRisk.level}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-sm font-bold">{systemRisk.score}/100</span>
                      </div>
                      <Progress value={systemRisk.score} className="h-2" />
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Affecting Metals:</h5>
                      <div className="flex flex-wrap gap-1">
                        {systemRisk.metals.map(metal => (
                          <Badge key={metal} variant="outline" className="text-xs">
                            {metal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vulnerable Population Breakdown</CardTitle>
                <CardDescription>High-risk demographic groups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Children (0-12 years):</span>
                    <div className="text-right">
                      <div className="font-medium">{currentData.populationImpact.vulnerableGroups.children.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((currentData.populationImpact.vulnerableGroups.children / currentData.populationImpact.totalPopulation) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pregnant Women:</span>
                    <div className="text-right">
                      <div className="font-medium">{currentData.populationImpact.vulnerableGroups.pregnant.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((currentData.populationImpact.vulnerableGroups.pregnant / currentData.populationImpact.totalPopulation) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Elderly (65+ years):</span>
                    <div className="text-right">
                      <div className="font-medium">{currentData.populationImpact.vulnerableGroups.elderly.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((currentData.populationImpact.vulnerableGroups.elderly / currentData.populationImpact.totalPopulation) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Recommendations</CardTitle>
                <CardDescription>Based on current risk levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <Heart className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Immediate Actions:</strong>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Provide alternative water sources to vulnerable groups</li>
                        <li>• Implement regular health monitoring programs</li>
                        <li>• Establish water treatment facilities</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Long-term Prevention:</strong>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Source water quality improvement</li>
                        <li>• Industrial discharge regulation</li>
                        <li>• Community health education programs</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
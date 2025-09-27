import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Lightbulb, Wrench, Factory, Droplets, Clock, DollarSign, CheckCircle } from 'lucide-react'

const remediationMethods = {
  'Chemical Precipitation': {
    effectiveness: { Pb: 90, Cd: 85, Cr: 80, Cu: 88, Zn: 85, As: 70 },
    cost: 'Medium',
    timeframe: '2-4 months',
    complexity: 'Medium',
    description: 'Addition of chemicals to convert dissolved metals into solid precipitates',
    pros: ['High removal efficiency', 'Well-established technology', 'Cost-effective for large volumes'],
    cons: ['Generates sludge', 'Chemical handling requirements', 'pH sensitive'],
    steps: [
      'Water quality assessment and pH adjustment',
      'Add precipitation chemicals (lime, ferric sulfate)',
      'Mixing and reaction time (30-60 minutes)',
      'Sedimentation and clarification',
      'Sludge removal and disposal',
      'Final water quality testing'
    ]
  },
  'Ion Exchange': {
    effectiveness: { Pb: 95, Cd: 92, Cr: 88, Cu: 90, Zn: 89, As: 85 },
    cost: 'High',
    timeframe: '1-2 months',
    complexity: 'Medium',
    description: 'Exchange of heavy metal ions with harmless ions using resin beads',
    pros: ['Very high removal efficiency', 'Selective removal', 'Can recover valuable metals'],
    cons: ['High initial cost', 'Resin regeneration needed', 'Limited by competing ions'],
    steps: [
      'Install ion exchange columns',
      'Load with appropriate resin',
      'Pass contaminated water through columns',
      'Monitor breakthrough curves',
      'Regenerate resin when saturated',
      'Recover metals from regeneration solution'
    ]
  },
  'Reverse Osmosis': {
    effectiveness: { Pb: 98, Cd: 96, Cr: 94, Cu: 95, Zn: 93, As: 90 },
    cost: 'High',
    timeframe: '1-3 months',
    complexity: 'High',
    description: 'High-pressure membrane filtration to remove dissolved contaminants',
    pros: ['Highest removal efficiency', 'Removes multiple contaminants', 'Produces high-quality water'],
    cons: ['Very high cost', 'High energy consumption', 'Membrane fouling'],
    steps: [
      'Pre-treatment for suspended solids',
      'Install high-pressure RO system',
      'Membrane selection and installation',
      'System commissioning and testing',
      'Regular membrane cleaning and replacement',
      'Concentrate disposal management'
    ]
  },
  'Electrocoagulation': {
    effectiveness: { Pb: 87, Cd: 82, Cr: 89, Cu: 85, Zn: 83, As: 78 },
    cost: 'Medium',
    timeframe: '1-2 months',
    complexity: 'Medium',
    description: 'Electrical process to coagulate and remove heavy metals',
    pros: ['No chemical addition', 'Compact system', 'Low sludge production'],
    cons: ['High energy consumption', 'Electrode replacement', 'Limited scalability'],
    steps: [
      'Install electrocoagulation reactor',
      'Set optimal current density and pH',
      'Continuous monitoring and control',
      'Periodic electrode cleaning',
      'Sludge removal and disposal',
      'System optimization based on performance'
    ]
  },
  'Constructed Wetlands': {
    effectiveness: { Pb: 75, Cd: 70, Cr: 65, Cu: 78, Zn: 72, As: 60 },
    cost: 'Low',
    timeframe: '6-12 months',
    complexity: 'Low',
    description: 'Natural biological treatment using plants and microorganisms',
    pros: ['Low cost', 'Environmentally friendly', 'Low maintenance'],
    cons: ['Lower efficiency', 'Large area required', 'Climate dependent'],
    steps: [
      'Site selection and design',
      'Excavation and liner installation',
      'Substrate preparation',
      'Plant selection and installation',
      'System maturation (3-6 months)',
      'Performance monitoring and maintenance'
    ]
  }
}

const preventiveMeasures = [
  {
    category: 'Industrial Controls',
    measures: [
      'Implement strict discharge standards for industries',
      'Regular monitoring of industrial effluents',
      'Mandatory pre-treatment before discharge',
      'Zero liquid discharge policies for high-risk industries'
    ]
  },
  {
    category: 'Source Protection',
    measures: [
      'Create buffer zones around water sources',
      'Restrict industrial activities near groundwater recharge areas',
      'Implement proper waste disposal systems',
      'Regular soil and groundwater monitoring'
    ]
  },
  {
    category: 'Water Treatment',
    measures: [
      'Install community-level water treatment plants',
      'Household-level treatment systems for high-risk areas',
      'Regular water quality testing and reporting',
      'Alternative water source development'
    ]
  },
  {
    category: 'Public Awareness',
    measures: [
      'Community education programs on water safety',
      'Health impact awareness campaigns',
      'Training for local water operators',
      'Citizen science monitoring programs'
    ]
  }
]

export function RemediationSuggestions() {
  const [selectedContaminants, setSelectedContaminants] = useState(['Pb', 'Cd', 'Cr'])
  const [selectedMethod, setSelectedMethod] = useState('Chemical Precipitation')
  const [budgetRange, setBudgetRange] = useState('medium')

  const getMethodRecommendations = () => {
    return Object.entries(remediationMethods)
      .map(([method, data]) => {
        const avgEffectiveness = selectedContaminants.reduce((sum, metal) => 
          sum + (data.effectiveness[metal] || 0), 0) / selectedContaminants.length
        
        return {
          method,
          data,
          avgEffectiveness: Math.round(avgEffectiveness),
          suitability: avgEffectiveness > 85 ? 'High' : avgEffectiveness > 70 ? 'Medium' : 'Low'
        }
      })
      .sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)
  }

  const recommendations = getMethodRecommendations()

  const getCostColor = (cost) => {
    switch (cost.toLowerCase()) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getSuitabilityVariant = (suitability) => {
    switch (suitability.toLowerCase()) {
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Target Contaminants:</span>
          <div className="flex gap-2">
            {['Pb', 'Cd', 'Cr', 'Cu', 'Zn', 'As'].map(metal => (
              <Button
                key={metal}
                variant={selectedContaminants.includes(metal) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedContaminants(prev => 
                    prev.includes(metal) 
                      ? prev.filter(m => m !== metal)
                      : [...prev, metal]
                  )
                }}
              >
                {metal}
              </Button>
            ))}
          </div>
        </div>

        <Select value={budgetRange} onValueChange={setBudgetRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Budget range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Budget</SelectItem>
            <SelectItem value="medium">Medium Budget</SelectItem>
            <SelectItem value="high">High Budget</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="methods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="methods">Treatment Methods</TabsTrigger>
          <TabsTrigger value="implementation">Implementation Plan</TabsTrigger>
          <TabsTrigger value="prevention">Prevention Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map(({ method, data, avgEffectiveness, suitability }) => (
              <Card key={method} className={selectedMethod === method ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      {method}
                    </span>
                    <Badge variant={getSuitabilityVariant(suitability)}>
                      {suitability} Suitability
                    </Badge>
                  </CardTitle>
                  <CardDescription>{data.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Effectiveness:</span>
                        <span className="font-bold">{avgEffectiveness}%</span>
                      </div>
                      <Progress value={avgEffectiveness} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Cost:</span>
                        <span className={`font-medium ${getCostColor(data.cost)}`}>{data.cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Timeframe:</span>
                        <span className="text-sm">{data.timeframe}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium">Metal-Specific Effectiveness:</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedContaminants.map(metal => (
                        <div key={metal} className="text-center">
                          <div className="text-xs text-muted-foreground">{metal}</div>
                          <div className="font-medium">{data.effectiveness[metal]}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    variant={selectedMethod === method ? 'default' : 'outline'}
                    onClick={() => setSelectedMethod(method)}
                  >
                    {selectedMethod === method ? 'Selected' : 'Select Method'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-4">
          {selectedMethod && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Implementation Plan: {selectedMethod}
                  </CardTitle>
                  <CardDescription>
                    Step-by-step implementation guide for {selectedMethod.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <div className="font-medium">Timeframe</div>
                        <div className="text-sm text-muted-foreground">
                          {remediationMethods[selectedMethod].timeframe}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <div className="font-medium">Cost Level</div>
                        <div className={`text-sm ${getCostColor(remediationMethods[selectedMethod].cost)}`}>
                          {remediationMethods[selectedMethod].cost}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Wrench className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <div className="font-medium">Complexity</div>
                        <div className="text-sm text-muted-foreground">
                          {remediationMethods[selectedMethod].complexity}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Implementation Steps:</h4>
                    <div className="space-y-3">
                      {remediationMethods[selectedMethod].steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2 text-green-600">Advantages:</h5>
                      <ul className="space-y-1">
                        {remediationMethods[selectedMethod].pros.map((pro, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2 text-orange-600">Considerations:</h5>
                      <ul className="space-y-1">
                        {remediationMethods[selectedMethod].cons.map((con, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="prevention" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preventiveMeasures.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.category === 'Industrial Controls' && <Factory className="h-5 w-5" />}
                    {category.category === 'Source Protection' && <Droplets className="h-5 w-5" />}
                    {category.category === 'Water Treatment' && <Wrench className="h-5 w-5" />}
                    {category.category === 'Public Awareness' && <Lightbulb className="h-5 w-5" />}
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.measures.map((measure, measureIndex) => (
                      <li key={measureIndex} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {measure}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Long-term Strategy Recommendations</CardTitle>
              <CardDescription>Comprehensive approach to prevent future contamination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">Phase 1</div>
                  <h4 className="font-medium mb-2">Immediate Actions</h4>
                  <p className="text-sm text-muted-foreground">
                    Emergency treatment, source identification, and vulnerable population protection
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">Phase 2</div>
                  <h4 className="font-medium mb-2">Medium-term Solutions</h4>
                  <p className="text-sm text-muted-foreground">
                    Treatment system installation, regulatory enforcement, and monitoring programs
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">Phase 3</div>
                  <h4 className="font-medium mb-2">Long-term Prevention</h4>
                  <p className="text-sm text-muted-foreground">
                    Sustainable practices, community engagement, and continuous improvement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
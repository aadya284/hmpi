import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import { Calculator, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const metalLimits = {
  Pb: 0.01, Cd: 0.003, Cr: 0.05, Cu: 1.3, Zn: 5.0, Ni: 0.02, As: 0.01, Hg: 0.002
}

const weightFactors = {
  Pb: 0.063, Cd: 0.222, Cr: 0.013, Cu: 0.005, Zn: 0.013, Ni: 0.033, As: 0.067, Hg: 0.333
}

function calculateHMPI(concentrations) {
  let totalWeightedValues = 0
  let totalWeights = 0
  const metalResults = {}

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

export function HMPICalculator({ data }) {
  const [results, setResults] = useState([])

  useEffect(() => {
    if (data && data.length > 0) {
      const calculatedResults = data.map(sample => ({
        ...sample,
        hmpiResult: calculateHMPI(sample.concentrations)
      }))
      setResults(calculatedResults)
    } else {
      setResults([])
    }
  }, [data])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'exceeded':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'within_limit':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          HMPI Calculation Results
        </CardTitle>
        <CardDescription>
          Automated calculation using standard HMPI methodology
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No sample data available for calculation</p>
            <p className="text-sm">Add sample data to see HMPI results</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={result.id || index} className="space-y-4">
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

                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                  <p><strong>Calculation Summary:</strong></p>
                  <p>Total Weighted Values: {result.hmpiResult.totalWeightedValues}</p>
                  <p>Total Weights: {result.hmpiResult.totalWeights}</p>
                  <p>HMPI = Σ(Wi × Qi) / ΣWi = {result.hmpiResult.hmpi}</p>
                </div>

                {index < results.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
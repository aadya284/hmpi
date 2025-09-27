import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react'

const timelineData = [
  { month: 'Jan 2024', Pb: 0.018, Cd: 0.005, Cr: 0.08, Cu: 1.2, Zn: 3.1, As: 0.012, hmpi: 75.2 },
  { month: 'Feb 2024', Pb: 0.022, Cd: 0.007, Cr: 0.09, Cu: 1.35, Zn: 3.4, As: 0.015, hmpi: 82.1 },
  { month: 'Mar 2024', Pb: 0.025, Cd: 0.008, Cr: 0.12, Cu: 1.5, Zn: 3.8, As: 0.018, hmpi: 95.6 },
  { month: 'Apr 2024', Pb: 0.028, Cd: 0.009, Cr: 0.11, Cu: 1.45, Zn: 3.6, As: 0.020, hmpi: 98.3 },
  { month: 'May 2024', Pb: 0.032, Cd: 0.012, Cr: 0.15, Cu: 1.8, Zn: 4.2, As: 0.025, hmpi: 115.7 },
  { month: 'Jun 2024', Pb: 0.029, Cd: 0.010, Cr: 0.13, Cu: 1.6, Zn: 3.9, As: 0.022, hmpi: 105.2 },
  { month: 'Jul 2024', Pb: 0.026, Cd: 0.008, Cr: 0.10, Cu: 1.4, Zn: 3.5, As: 0.019, hmpi: 92.8 },
  { month: 'Aug 2024', Pb: 0.024, Cd: 0.007, Cr: 0.09, Cu: 1.3, Zn: 3.2, As: 0.016, hmpi: 85.4 },
  { month: 'Sep 2024', Pb: 0.021, Cd: 0.006, Cr: 0.08, Cu: 1.25, Zn: 3.0, As: 0.014, hmpi: 78.9 }
]

const locationData = {
  'Mumbai Industrial Area': timelineData,
  'Delhi Yamuna Basin': timelineData.map(d => ({
    ...d,
    Pb: d.Pb * 0.8,
    Cd: d.Cd * 0.9,
    Cr: d.Cr * 0.7,
    Cu: d.Cu * 1.1,
    Zn: d.Zn * 0.9,
    As: d.As * 0.8,
    hmpi: d.hmpi * 0.85
  })),
  'Chennai Coastal Area': timelineData.map(d => ({
    ...d,
    Pb: d.Pb * 0.5,
    Cd: d.Cd * 0.6,
    Cr: d.Cr * 0.4,
    Cu: d.Cu * 0.7,
    Zn: d.Zn * 0.6,
    As: d.As * 0.5,
    hmpi: d.hmpi * 0.55
  }))
}

const metalColors = {
  Pb: '#ef4444',
  Cd: '#f97316',
  Cr: '#eab308',
  Cu: '#22c55e',
  Zn: '#3b82f6',
  As: '#8b5cf6',
  hmpi: '#1f2937'
}

const metalNames = {
  Pb: 'Lead',
  Cd: 'Cadmium',
  Cr: 'Chromium',
  Cu: 'Copper',
  Zn: 'Zinc',
  As: 'Arsenic'
}

export function TimelineAnalysis() {
  const [selectedLocation, setSelectedLocation] = useState('Mumbai Industrial Area')
  const [selectedMetal, setSelectedMetal] = useState('hmpi')
  const [chartType, setChartType] = useState('line')

  const currentData = locationData[selectedLocation] || timelineData
  
  const latestMonth = currentData[currentData.length - 1]
  const previousMonth = currentData[currentData.length - 2]
  
  const calculateTrend = (metal) => {
    if (!previousMonth) return { trend: 'stable', change: 0 }
    const current = latestMonth[metal]
    const previous = previousMonth[metal]
    const change = ((current - previous) / previous) * 100
    
    return {
      trend: change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable',
      change: Math.round(change * 10) / 10
    }
  }

  const renderChart = () => {
    const commonProps = {
      data: currentData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey={selectedMetal}
              stroke={metalColors[selectedMetal]}
              fill={metalColors[selectedMetal]}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={selectedMetal} fill={metalColors[selectedMetal]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={selectedMetal}
            stroke={metalColors[selectedMetal]}
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(locationData).map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMetal} onValueChange={setSelectedMetal}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select metal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hmpi">HMPI Index</SelectItem>
            {Object.entries(metalNames).map(([symbol, name]) => (
              <SelectItem key={symbol} value={symbol}>{name} ({symbol})</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
            <SelectItem value="bar">Bar Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(metalNames).map(([symbol, name]) => {
          const trend = calculateTrend(symbol)
          return (
            <Card key={symbol}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{name}</h4>
                  <div className="flex items-center gap-1">
                    {trend.trend === 'increasing' ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : trend.trend === 'decreasing' ? (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                    <Badge 
                      variant={trend.trend === 'increasing' ? 'destructive' : 
                               trend.trend === 'decreasing' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {trend.change > 0 ? '+' : ''}{trend.change}%
                    </Badge>
                  </div>
                </div>
                <div className="text-lg font-bold" style={{ color: metalColors[symbol] }}>
                  {latestMonth[symbol]} mg/L
                </div>
                <div className="text-xs text-muted-foreground">
                  vs {previousMonth[symbol]} mg/L last month
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Concentration Timeline - {selectedLocation}
          </CardTitle>
          <CardDescription>
            {selectedMetal === 'hmpi' ? 'HMPI Index' : `${metalNames[selectedMetal]} (${selectedMetal})`} concentration over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Metal Concentration Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.entries(metalNames).map(([symbol, name]) => (
                  <Line
                    key={symbol}
                    type="monotone"
                    dataKey={symbol}
                    stroke={metalColors[symbol]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Highest Concentrations (Latest Month)</h4>
                <div className="space-y-2">
                  {Object.entries(metalNames)
                    .sort(([a], [b]) => latestMonth[b] - latestMonth[a])
                    .slice(0, 3)
                    .map(([symbol, name]) => (
                      <div key={symbol} className="flex justify-between items-center">
                        <span className="text-sm">{name}:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{latestMonth[symbol]} mg/L</span>
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: metalColors[symbol] }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Trend Analysis</h4>
                <div className="space-y-2">
                  {Object.entries(metalNames).map(([symbol, name]) => {
                    const trend = calculateTrend(symbol)
                    return (
                      <div key={symbol} className="flex justify-between items-center">
                        <span className="text-sm">{name}:</span>
                        <div className="flex items-center gap-2">
                          {trend.trend === 'increasing' ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : trend.trend === 'decreasing' ? (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 bg-gray-400 rounded-full" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {trend.change > 0 ? '+' : ''}{trend.change}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
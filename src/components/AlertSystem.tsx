import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Alert, AlertDescription } from './ui/alert'
import { Separator } from './ui/separator'
import { AlertTriangle, Bell, Users, MessageCircle, Mail, Phone, MapPin, Clock } from 'lucide-react'

const alertLevels = {
  critical: { color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-800' },
  high: { color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-800' },
  medium: { color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800' },
  low: { color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800' }
}

const mockAlerts = [
  {
    id: 1,
    level: 'critical',
    title: 'Severe Lead Contamination Detected',
    location: 'Mumbai Industrial Area',
    coordinates: '19.0760, 72.8777',
    hmpi: 125.6,
    metals: { Pb: 0.032, As: 0.025 },
    timestamp: '2024-01-26T14:30:00',
    population: 15000,
    status: 'active',
    actions: ['Water supply suspended', 'Emergency tankers deployed', 'Health screening initiated']
  },
  {
    id: 2,
    level: 'high',
    title: 'Multiple Metal Threshold Exceeded',
    location: 'Pune Manufacturing Zone',
    coordinates: '18.5204, 73.8567',
    hmpi: 108.7,
    metals: { Cd: 0.012, Cr: 0.15 },
    timestamp: '2024-01-26T10:15:00',
    population: 8500,
    status: 'active',
    actions: ['Advisory issued', 'Alternative water sources identified']
  },
  {
    id: 3,
    level: 'medium',
    title: 'Chromium Levels Rising',
    location: 'Delhi Yamuna Basin',
    coordinates: '28.7041, 77.1025',
    hmpi: 78.2,
    metals: { Cr: 0.08 },
    timestamp: '2024-01-25T16:45:00',
    population: 12000,
    status: 'monitoring',
    actions: ['Increased monitoring frequency', 'Source investigation ongoing']
  }
]

const notificationChannels = [
  { id: 'sms', name: 'SMS Alerts', icon: Phone, enabled: true },
  { id: 'email', name: 'Email Notifications', icon: Mail, enabled: true },
  { id: 'push', name: 'Push Notifications', icon: Bell, enabled: true },
  { id: 'social', name: 'Social Media', icon: MessageCircle, enabled: false }
]

export function AlertSystem() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [notificationSettings, setNotificationSettings] = useState(notificationChannels)
  const [newAlert, setNewAlert] = useState({
    level: 'medium',
    title: '',
    location: '',
    hmpi: '',
    description: ''
  })

  const updateAlertStatus = (alertId, newStatus) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    ))
  }

  const toggleNotificationChannel = (channelId) => {
    setNotificationSettings(prev => prev.map(channel =>
      channel.id === channelId ? { ...channel, enabled: !channel.enabled } : channel
    ))
  }

  const getAlertIcon = (level) => {
    return <AlertTriangle className="h-4 w-4" />
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const getTimeDifference = (timestamp) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const createAlert = () => {
    if (!newAlert.title || !newAlert.location) return

    const alert = {
      id: Date.now(),
      ...newAlert,
      timestamp: new Date().toISOString(),
      status: 'active',
      hmpi: parseFloat(newAlert.hmpi) || 0,
      population: Math.floor(Math.random() * 20000) + 5000,
      actions: ['Alert issued', 'Monitoring initiated']
    }

    setAlerts(prev => [alert, ...prev])
    setNewAlert({ level: 'medium', title: '', location: '', hmpi: '', description: '' })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Critical Alerts</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.level === 'critical' && a.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">High Priority</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.level === 'high' && a.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Active</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {alerts.filter(a => a.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">People Affected</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {alerts.filter(a => a.status === 'active').reduce((sum, alert) => sum + alert.population, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Alerts
              </CardTitle>
              <CardDescription>
                Real-time contamination alerts and emergency notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.filter(a => a.status === 'active').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active alerts</p>
                  <p className="text-sm">All monitored areas are within safe limits</p>
                </div>
              ) : (
                alerts.filter(a => a.status === 'active').map(alert => (
                  <Alert 
                    key={alert.id} 
                    className={`${alertLevels[alert.level].bgColor} ${alertLevels[alert.level].borderColor}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getAlertIcon(alert.level)}
                          <Badge variant={alert.level === 'critical' ? 'destructive' : 'secondary'}>
                            {alert.level.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getTimeDifference(alert.timestamp)}
                          </span>
                        </div>
                        
                        <AlertDescription className={`${alertLevels[alert.level].textColor} mb-3`}>
                          <div className="font-medium mb-1">{alert.title}</div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </span>
                            <span>HMPI: {alert.hmpi}</span>
                            <span>Population: {alert.population.toLocaleString()}</span>
                          </div>
                        </AlertDescription>

                        {alert.metals && (
                          <div className="flex gap-2 mb-3">
                            {Object.entries(alert.metals).map(([metal, value]) => (
                              <Badge key={metal} variant="outline" className="text-xs">
                                {metal}: {value} mg/L
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="space-y-1">
                          <div className="text-sm font-medium">Actions Taken:</div>
                          {alert.actions.map((action, index) => (
                            <div key={index} className="text-xs flex items-center gap-2">
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedAlert(alert)}
                        >
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateAlertStatus(alert.id, 'resolved')}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </Alert>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create New Alert</CardTitle>
              <CardDescription>
                Manually create alerts for detected contamination events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alertLevel">Alert Level</Label>
                  <Select value={newAlert.level} onValueChange={(value) => setNewAlert(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hmpiValue">HMPI Value</Label>
                  <Input
                    id="hmpiValue"
                    type="number"
                    placeholder="e.g., 125.6"
                    value={newAlert.hmpi}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, hmpi: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertTitle">Alert Title</Label>
                <Input
                  id="alertTitle"
                  placeholder="e.g., Lead contamination detected"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertLocation">Location</Label>
                <Input
                  id="alertLocation"
                  placeholder="e.g., Mumbai Industrial Area"
                  value={newAlert.location}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <Button onClick={createAlert} className="w-full">
                Create Alert
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationSettings.map(channel => {
                const IconComponent = channel.icon
                return (
                  <div key={channel.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm">{channel.name}</span>
                    </div>
                    <Switch
                      checked={channel.enabled}
                      onCheckedChange={() => toggleNotificationChannel(channel.id)}
                    />
                  </div>
                )
              })}
              
              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Alert Thresholds</Label>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Critical HMPI:</span>
                    <span className="font-medium">≥ 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High HMPI:</span>
                    <span className="font-medium">75-99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium HMPI:</span>
                    <span className="font-medium">50-74</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full bg-${alertLevels[alert.level].color}-500`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{alert.location}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(alert.timestamp)}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {alert.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedAlert && (
            <Card>
              <CardHeader>
                <CardTitle>Alert Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium">{selectedAlert.title}</div>
                  <div className="text-sm text-muted-foreground">{selectedAlert.location}</div>
                </div>
                
                <div className="text-sm">
                  <div><strong>HMPI:</strong> {selectedAlert.hmpi}</div>
                  <div><strong>Population Affected:</strong> {selectedAlert.population.toLocaleString()}</div>
                  <div><strong>Status:</strong> {selectedAlert.status}</div>
                  <div><strong>Time:</strong> {formatTimestamp(selectedAlert.timestamp)}</div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedAlert(null)}
                >
                  Close Details
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
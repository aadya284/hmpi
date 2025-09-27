import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

type UserRole = 'policymaker' | 'scientist' | 'researcher'

interface LoginProps {
  onLogin: (params: { name: string; role: UserRole }) => void
}

export function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
  }, [name, role])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !role) {
      setError('Please enter your name and select a role')
      return
    }
    onLogin({ name: name.trim(), role })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Sign in to AquaGuard HMPI</CardTitle>
          <CardDescription className="text-center">Choose your role to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="e.g. Dr. Maya Rao" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger aria-label="Select role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="policymaker">Policymaker</SelectItem>
                  <SelectItem value="scientist">Scientist</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="text-sm text-destructive" data-slot="alert-description">{error}</div>
            )}

            <Button type="submit" className="w-full">Continue</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}



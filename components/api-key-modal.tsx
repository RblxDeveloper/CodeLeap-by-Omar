'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Key, ExternalLink, Info, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react'

interface ApiKeyModalProps {
  isOpen: boolean
  onApiKeySet: (apiKey: string) => void
}

export function ApiKeyModal({ isOpen, onApiKeySet }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const validateAndSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key')
      return
    }

    if (!apiKey.startsWith('gsk_')) {
      setError('Please enter a valid Groq API key (starts with gsk_)')
      return
    }

    setIsValidating(true)
    setError('')

    try {
      // Test the API key with a simple request
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      })

      if (response.ok) {
        // Save to localStorage and notify parent
        localStorage.setItem('codeleap-api-key', apiKey.trim())
        onApiKeySet(apiKey.trim())
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Invalid API key. Please check and try again.')
      }
    } catch (error) {
      setError('Failed to validate API key. Please check your connection and try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateAndSaveApiKey()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Key className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-xl">Welcome to CodeLeap!</CardTitle>
          <CardDescription>
            Enter your Groq API key to start generating AI coding challenges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              Groq API Key
            </label>
            <Input
              id="api-key"
              type="password"
              placeholder="gsk_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={handleKeyPress}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-2">
                <div>
                  <p className="font-medium">Don't have an API key?</p>
                  <p>Get a free Groq API key:</p>
                  <a 
                    href="https://console.groq.com/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>console.groq.com/keys</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <CreditCard className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <p className="font-medium">Free Tier Limits</p>
                <p>Groq's free tier has rate limits. For higher limits:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Upgrade to Groq Pro for higher rate limits</li>
                  <li>Faster response times</li>
                  <li>Priority access</li>
                </ul>
                <a 
                  href="https://console.groq.com/settings/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-yellow-600 dark:text-yellow-400 hover:underline mt-1"
                >
                  <span>Upgrade here</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-green-700 dark:text-green-300">
                <p className="font-medium">Your API key is stored locally</p>
                <p>It's saved in your browser and never sent to our servers</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={validateAndSaveApiKey}
            disabled={isValidating || !apiKey.trim()}
            className="w-full"
            size="lg"
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Validating...
              </>
            ) : (
              <>
                <Key className="h-4 w-4 mr-2" />
                Save API Key
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

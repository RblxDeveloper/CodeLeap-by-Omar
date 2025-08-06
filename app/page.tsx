'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import { ChallengeDisplay } from '@/components/challenge-display'
import { ChallengeHistory } from '@/components/challenge-history'
import { LoadingGhost } from '@/components/loading-ghost'
import { ApiKeyModal } from '@/components/api-key-modal'
import { Code2, Target, History, Sparkles, Brain, AlertCircle, Clock, Key, CreditCard, ExternalLink } from 'lucide-react'

export interface Challenge {
  id: string
  problem: string
  code: string
  codeExplanation: string
  language: 'javascript' | 'html' | 'css'
  difficulty: 'easy' | 'medium' | 'hard'
  isCorrect: boolean
  explanation: string
  additionalInfo?: string
  userAnswer?: boolean
  timestamp: number
}

export default function CodeLeapApp() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [challengeHistory, setChallengeHistory] = useState<Challenge[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'html' | 'css'>('javascript')
  const [activeTab, setActiveTab] = useState('challenge')
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const [generationTime, setGenerationTime] = useState<number | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)

  useEffect(() => {
    // Load challenge history from localStorage
    const savedHistory = localStorage.getItem('codeleap-history')
    if (savedHistory) {
      setChallengeHistory(JSON.parse(savedHistory))
    }

    // Check for saved API key or set default
    const savedApiKey = localStorage.getItem('codeleap-api-key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    } else {
      // Set the default Groq API key
      const defaultKey = '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'
      setApiKey(defaultKey)
      localStorage.setItem('codeleap-api-key', defaultKey)
    }
  }, [])

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey)
    setShowApiKeyModal(false)
    setIsRateLimited(false) // Reset rate limit status when new key is set
  }

  const changeApiKey = () => {
    setShowApiKeyModal(true)
  }

  const saveToHistory = (challenge: Challenge) => {
    const updatedHistory = [challenge, ...challengeHistory].slice(0, 50) // Keep last 50 challenges
    setChallengeHistory(updatedHistory)
    localStorage.setItem('codeleap-history', JSON.stringify(updatedHistory))
  }

  const generateChallenge = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true)
      return
    }

    const startTime = Date.now()
    setIsGenerating(true)
    setGenerationError(null)
    setIsUsingFallback(false)
    setGenerationTime(null)
    setIsRateLimited(false)
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 35000)

      const response = await fetch('/api/generate-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty: selectedDifficulty,
          language: selectedLanguage,
          apiKey: apiKey
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const endTime = Date.now()
      setGenerationTime(endTime - startTime)

      const challenge = await response.json()
      
      // Check for rate limit error
      if (challenge.isRateLimit) {
        setIsRateLimited(true)
        setGenerationError('Rate limit exceeded for free tier')
        setIsUsingFallback(true)
      } else if (challenge.fallbackUsed) {
        setIsUsingFallback(true)
        setGenerationError('AI was slow/unavailable, using curated challenge')
      }
      
      if (!response.ok && !challenge.id) {
        throw new Error(challenge.error || challenge.details || `HTTP error! status: ${response.status}`)
      }

      setCurrentChallenge({
        ...challenge,
        id: challenge.id || Date.now().toString(),
        timestamp: challenge.timestamp || Date.now(),
      })
    } catch (error) {
      const endTime = Date.now()
      setGenerationTime(endTime - startTime)
      
      console.error('Error generating challenge:', error)
      let errorMessage = 'AI generation failed'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'AI is taking too long (35s timeout)'
        } else {
          errorMessage = error.message
        }
      }
      
      setGenerationError(errorMessage)
      setIsUsingFallback(true)
      setCurrentChallenge(null)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswer = (userAnswer: boolean) => {
    if (!currentChallenge) return

    const updatedChallenge = {
      ...currentChallenge,
      userAnswer,
    }
    
    setCurrentChallenge(updatedChallenge)
    saveToHistory(updatedChallenge)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={showApiKeyModal} 
        onApiKeySet={handleApiKeySet}
      />

      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">CodeLeap</h1>
              <p className="text-sm text-muted-foreground">AI Coding Challenges</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {apiKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={changeApiKey}
                className="text-xs"
              >
                <Key className="h-3 w-3 mr-1" />
                Change API Key
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="challenge" className="flex items-center space-x-2 cursor-pointer">
              <Target className="h-4 w-4" />
              <span>Challenge</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2 cursor-pointer">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenge" className="space-y-6">
            {/* Welcome Section */}
            {!currentChallenge && !isGenerating && (
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Brain className="h-6 w-6 text-primary" />
                    <span>Welcome to CodeLeap!</span>
                  </CardTitle>
                  <CardDescription className="max-w-2xl mx-auto">
                    Test your coding skills with AI-generated challenges. Each challenge is unique and 
                    designed to help you learn and improve your programming knowledge.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4">
                      <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <h3 className="font-semibold">AI Generated</h3>
                      <p className="text-sm text-muted-foreground">Unique challenges every time</p>
                    </Card>
                    <Card className="p-4">
                      <Sparkles className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Always Different</h3>
                      <p className="text-sm text-muted-foreground">Never see the same challenge twice</p>
                    </Card>
                    <Card className="p-4">
                      <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Multiple Languages</h3>
                      <p className="text-sm text-muted-foreground">JavaScript, HTML, and CSS</p>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading Ghost */}
            {isGenerating && <LoadingGhost />}

            {/* Rate Limit Warning */}
            {isRateLimited && (
              <Card className="border-2 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 mb-3">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Groq API Rate Limit Reached</span>
                    {generationTime && (
                      <Badge variant="outline" className="ml-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {(generationTime / 1000).toFixed(1)}s
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300 space-y-2">
                    <p>Your Groq API has reached its rate limit. To continue generating AI challenges:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Wait for the rate limit to reset</li>
                      <li>Upgrade to Groq Pro for higher limits</li>
                      <li>Get faster response times</li>
                    </ul>
                    <div className="flex items-center space-x-4 mt-3">
                      <a 
                        href="https://console.groq.com/settings/billing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-orange-600 dark:text-orange-400 hover:underline font-medium"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Upgrade Plan</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <span className="text-orange-600 dark:text-orange-400">•</span>
                      <span className="text-sm">Using curated challenge instead</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generation Status */}
            {(generationError || isUsingFallback) && !isRateLimited && (
              <Card className={`border-2 ${isUsingFallback ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800' : 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800'}`}>
                <CardContent className="pt-6">
                  <div className={`flex items-center space-x-2 ${isUsingFallback ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">
                      {isUsingFallback ? 'Using Curated Challenge' : 'AI Issue'}
                    </span>
                    {generationTime && (
                      <Badge variant="outline" className="ml-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {(generationTime / 1000).toFixed(1)}s
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm mt-2 ${isUsingFallback ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'}`}>
                    {isUsingFallback 
                      ? 'AI was taking too long, but here\'s a great challenge!'
                      : generationError
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Challenge Controls */}
            {!isGenerating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>Generate {selectedLanguage.toUpperCase()} Challenge</span>
                  </CardTitle>
                  <CardDescription>
                    Create a unique {selectedLanguage} challenge at {selectedDifficulty} difficulty
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={selectedDifficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setSelectedDifficulty(value)}>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy" className="cursor-pointer">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>Easy - Basic concepts</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium" className="cursor-pointer">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <span>Medium - Intermediate</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="hard" className="cursor-pointer">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span>Hard - Advanced</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Language</label>
                      <Select value={selectedLanguage} onValueChange={(value: 'javascript' | 'html' | 'css') => setSelectedLanguage(value)}>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript" className="cursor-pointer">
                            <div className="flex items-center space-x-2">
                              <span>🟨</span>
                              <span>JavaScript</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="html" className="cursor-pointer">
                            <div className="flex items-center space-x-2">
                              <span>🟧</span>
                              <span>HTML</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="css" className="cursor-pointer">
                            <div className="flex items-center space-x-2">
                              <span>🟦</span>
                              <span>CSS</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    onClick={generateChallenge} 
                    disabled={isGenerating || !apiKey}
                    className="w-full cursor-pointer hover:bg-primary/90 transition-colors"
                    size="lg"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {isGenerating ? 'AI is thinking...' : `Generate Challenge`}
                  </Button>
                  {!apiKey && (
                    <p className="text-sm text-muted-foreground text-center">
                      Please set your API key to generate challenges
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Current Challenge */}
            {currentChallenge && !isGenerating && (
              <ChallengeDisplay 
                challenge={currentChallenge} 
                onAnswer={handleAnswer}
              />
            )}
          </TabsContent>

          <TabsContent value="history">
            <ChallengeHistory challenges={challengeHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

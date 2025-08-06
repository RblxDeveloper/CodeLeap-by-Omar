'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, Code, ChevronDown, ChevronUp } from 'lucide-react'
import { Challenge } from '@/app/page'
import { CodeHighlighter } from './code-highlighter'

interface ChallengeHistoryProps {
  challenges: Challenge[]
}

export function ChallengeHistory({ challenges }: ChallengeHistoryProps) {
  const [expandedChallenges, setExpandedChallenges] = useState<Set<string>>(new Set())

  const toggleExpanded = (challengeId: string) => {
    const newExpanded = new Set(expandedChallenges)
    if (newExpanded.has(challengeId)) {
      newExpanded.delete(challengeId)
    } else {
      newExpanded.add(challengeId)
    }
    setExpandedChallenges(newExpanded)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'javascript': return '🟨'
      case 'html': return '🟧'
      case 'css': return '🟦'
      default: return '📄'
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAccuracy = () => {
    if (challenges.length === 0) return 0
    const correct = challenges.filter(c => c.userAnswer === c.isCorrect).length
    return Math.round((correct / challenges.length) * 100)
  }

  const getStats = () => {
    const total = challenges.length
    const correct = challenges.filter(c => c.userAnswer === c.isCorrect).length
    const byDifficulty = {
      easy: challenges.filter(c => c.difficulty === 'easy').length,
      medium: challenges.filter(c => c.difficulty === 'medium').length,
      hard: challenges.filter(c => c.difficulty === 'hard').length,
    }
    const byLanguage = {
      javascript: challenges.filter(c => c.language === 'javascript').length,
      html: challenges.filter(c => c.language === 'html').length,
      css: challenges.filter(c => c.language === 'css').length,
    }

    return { total, correct, byDifficulty, byLanguage }
  }

  const stats = getStats()

  if (challenges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Challenge History</span>
          </CardTitle>
          <CardDescription>Your completed challenges will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No challenges completed yet.</p>
            <p className="text-sm">Generate your first challenge to get started!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>Overall statistics and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getAccuracy()}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.correct}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.total - stats.correct}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">By Difficulty</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Easy</span>
                  </span>
                  <span>{stats.byDifficulty.easy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Medium</span>
                  </span>
                  <span>{stats.byDifficulty.medium}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Hard</span>
                  </span>
                  <span>{stats.byDifficulty.hard}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">By Language</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <span>🟨</span>
                    <span>JavaScript</span>
                  </span>
                  <span>{stats.byLanguage.javascript}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <span>🟧</span>
                    <span>HTML</span>
                  </span>
                  <span>{stats.byLanguage.html}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <span>🟦</span>
                    <span>CSS</span>
                  </span>
                  <span>{stats.byLanguage.css}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Challenges</span>
          </CardTitle>
          <CardDescription>Your last {challenges.length} completed challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {challenges.map((challenge, index) => {
                const isExpanded = expandedChallenges.has(challenge.id)
                return (
                  <div key={challenge.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <span>{getLanguageIcon(challenge.language)}</span>
                          <span className="capitalize">{challenge.language}</span>
                        </Badge>
                        <Badge className={`text-white ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {challenge.userAnswer === challenge.isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(challenge.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-2">{challenge.problem}</p>
                    
                    {/* Code Preview/Expand */}
                    <div className="mb-2">
                      {isExpanded ? (
                        <CodeHighlighter code={challenge.code} language={challenge.language} />
                      ) : (
                        <div className="bg-muted p-2 rounded text-xs font-mono mb-2 overflow-x-auto">
                          {challenge.code.length > 100 
                            ? `${challenge.code.substring(0, 100)}...` 
                            : challenge.code
                          }
                        </div>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(challenge.id)}
                        className="text-xs h-6 px-2"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Collapse Code
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Expand Code
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <strong>Your answer:</strong> {challenge.userAnswer ? 'Correct' : 'Incorrect'} | 
                      <strong> Actual:</strong> {challenge.isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

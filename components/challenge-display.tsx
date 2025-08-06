'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Eye, Code, Info } from 'lucide-react'
import { Challenge } from '@/app/page'
import { HtmlPreview } from './html-preview'
import { CodeHighlighter } from './code-highlighter'

interface ChallengeDisplayProps {
  challenge: Challenge
  onAnswer: (answer: boolean) => void
}

export function ChallengeDisplay({ challenge, onAnswer }: ChallengeDisplayProps) {
  const [showAnswer, setShowAnswer] = useState(challenge.userAnswer !== undefined)

  const handleAnswer = (answer: boolean) => {
    onAnswer(answer)
    setShowAnswer(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500 hover:bg-green-600'
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'hard': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-gray-500 hover:bg-gray-600'
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

  const shouldShowPreview = () => {
    if (challenge.language !== 'html') return false
    
    // Check if it contains actual HTML elements (not just text)
    const hasHtmlTags = /<\s*[a-zA-Z][^>]*>/i.test(challenge.code)
    const hasValidStructure = challenge.code.trim().length > 0 && hasHtmlTags
    
    return hasValidStructure
  }

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-900">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
            <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Code Challenge</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <span>{getLanguageIcon(challenge.language)}</span>
              <span className="capitalize text-gray-700 dark:text-gray-300">{challenge.language}</span>
            </Badge>
            <Badge className={`text-white transition-colors ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty.toUpperCase()}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
          {challenge.problem}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Code Display with Syntax Highlighting */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>Code to Analyze</span>
          </h3>
          <CodeHighlighter code={challenge.code} language={challenge.language} />
        </div>

        {/* Code Explanation */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">What this code does:</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            {challenge.codeExplanation}
          </p>
        </div>

        {/* HTML Preview - Only show if valid HTML */}
        {shouldShowPreview() && (
          <HtmlPreview code={challenge.code} />
        )}

        <Separator className="bg-gray-200 dark:bg-gray-700" />

        {/* Answer Buttons */}
        {!showAnswer && (
          <div className="space-y-4">
            <p className="text-center font-semibold text-gray-800 dark:text-gray-200 text-lg">
              Is this code correct?
            </p>
            <div className="flex space-x-4 justify-center">
              <Button
                onClick={() => handleAnswer(true)}
                variant="outline"
                size="lg"
                className="flex items-center space-x-2 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/20 dark:hover:border-green-700 cursor-pointer transition-all duration-200 border-2 px-8 py-3"
              >
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold">Correct</span>
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                variant="outline"
                size="lg"
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/20 dark:hover:border-red-700 cursor-pointer transition-all duration-200 border-2 px-8 py-3"
              >
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="font-semibold">Incorrect</span>
              </Button>
            </div>
          </div>
        )}

        {/* Answer Reveal */}
        {showAnswer && (
          <div className="space-y-6">
            <Separator className="bg-gray-200 dark:bg-gray-700" />
            
            {/* User's Answer Result */}
            {challenge.userAnswer !== undefined && (
              <div className={`p-4 rounded-lg border-2 ${
                challenge.userAnswer === challenge.isCorrect 
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20 dark:border-green-600' 
                  : 'border-red-500 bg-red-50 dark:bg-red-950/20 dark:border-red-600'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  {challenge.userAnswer === challenge.isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                  <span className={`font-bold text-lg ${
                    challenge.userAnswer === challenge.isCorrect 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {challenge.userAnswer === challenge.isCorrect ? '🎉 Correct!' : '❌ Incorrect!'}
                  </span>
                </div>
                <div className={`text-sm space-y-1 ${
                  challenge.userAnswer === challenge.isCorrect 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Your answer:</span>
                    <Badge variant={challenge.userAnswer ? "default" : "destructive"} className="text-xs">
                      {challenge.userAnswer ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Actual result:</span>
                    <Badge variant={challenge.isCorrect ? "default" : "destructive"} className="text-xs">
                      {challenge.isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Explanation */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold mb-4 flex items-center space-x-2 text-lg">
                <span className={challenge.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {challenge.isCorrect ? '✅ Why it\'s correct:' : '❌ Why it\'s incorrect:'}
                </span>
              </h4>
              <p className="text-sm leading-relaxed mb-4 text-gray-700 dark:text-gray-300">
                {challenge.explanation}
              </p>
              
              {challenge.additionalInfo && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h5 className="font-semibold mb-3 text-blue-600 dark:text-blue-400 flex items-center space-x-2">
                    <span>💡</span>
                    <span>Additional Information:</span>
                  </h5>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-950/20 p-3 rounded border border-blue-200 dark:border-blue-800/50">
                    {challenge.additionalInfo}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

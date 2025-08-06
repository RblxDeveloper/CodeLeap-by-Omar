'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Eye, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HtmlPreviewProps {
  code: string
}

export function HtmlPreview({ code }: HtmlPreviewProps) {
  const [hasError, setHasError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [code])

  const handleError = () => {
    setHasError(true)
  }

  // Clean the HTML code for preview (remove dangerous scripts but keep the structure)
  const cleanCode = code.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Create a complete HTML document for better rendering
  const createPreviewDocument = (htmlCode: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    * { 
      box-sizing: border-box; 
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
      margin-bottom: 0.5em;
      color: #2c3e50;
    }
    p {
      margin-bottom: 1em;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1em;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f8f9fa;
      font-weight: bold;
      color: #495057;
    }
    form {
      margin-bottom: 1em;
    }
    input, textarea, select, button {
      margin: 4px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
    }
    button {
      background-color: #007bff;
      color: white;
      cursor: pointer;
      font-weight: 500;
    }
    button:hover {
      background-color: #0056b3;
    }
    ul, ol {
      padding-left: 2em;
    }
    li {
      margin-bottom: 0.25em;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .card {
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      background: #f8f9fa;
    }
    video {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  ${htmlCode}
</body>
</html>`
  }

  if (hasError) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          Unable to render HTML preview. The code may contain syntax errors or unsupported elements.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Preview</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs cursor-pointer"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      
      <div className={`border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-inner transition-all duration-300 ${
        isExpanded ? 'h-96' : 'h-64'
      }`}>
        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">preview.html</span>
          </div>
        </div>
        
        <div className="h-full overflow-auto">
          <iframe
            srcDoc={createPreviewDocument(cleanCode)}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-forms"
            onError={handleError}
            title="HTML Preview"
            style={{ minHeight: isExpanded ? '350px' : '220px' }}
          />
        </div>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
        <AlertTriangle className="h-3 w-3" />
        <span>Preview runs in a sandboxed environment for security</span>
      </div>
    </div>
  )
}

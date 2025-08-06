'use client'

interface CodeHighlighterProps {
  code: string
  language: 'javascript' | 'html' | 'css'
}

export function CodeHighlighter({ code, language }: CodeHighlighterProps) {
  // Properly escape HTML characters for display
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  const lines = code.split('\n')

  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
          {language.toUpperCase()}
        </span>
      </div>
      <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded-lg overflow-x-auto text-sm font-mono max-w-full">
        <code className="block min-w-0">
          {lines.map((line, index) => (
            <div key={index} className="flex min-w-0">
              <span className="text-gray-400 dark:text-gray-500 select-none w-8 text-right pr-3 text-xs leading-6 flex-shrink-0">
                {index + 1}
              </span>
              <span 
                className="flex-1 leading-6 whitespace-pre-wrap min-w-0 text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: escapeHtml(line) || '&nbsp;' }}
              />
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

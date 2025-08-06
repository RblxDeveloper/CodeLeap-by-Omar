'use client'

interface CodeHighlighterProps {
  code: string
  language: 'javascript' | 'html' | 'css'
}

export function CodeHighlighter({ code, language }: CodeHighlighterProps) {
  // Format code with proper indentation
  const formatCode = (code: string, language: string) => {
    if (language === 'html') {
      return formatHTML(code)
    } else if (language === 'css') {
      return formatCSS(code)
    } else if (language === 'javascript') {
      return formatJavaScript(code)
    }
    return code
  }

  // Improved HTML formatter
  const formatHTML = (html: string) => {
    if (!html || html.trim().length === 0) return html
    
    let formatted = ''
    let indent = 0
    const indentSize = 2
    
    // Clean up the HTML first
    let cleanHtml = html
      .replace(/>\s+</g, '><')  // Remove whitespace between tags
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim()
    
    // Split by tags while preserving the tags
    const parts = cleanHtml.split(/(<[^>]*>)/).filter(part => part.length > 0)
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim()
      if (!part) continue
      
      if (part.startsWith('</')) {
        // Closing tag - decrease indent first
        indent = Math.max(0, indent - indentSize)
        formatted += ' '.repeat(indent) + part + '\n'
      } else if (part.startsWith('<')) {
        // Opening tag
        const tagMatch = part.match(/<(\w+)/)
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : ''
        
        // Self-closing tags and void elements
        const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
        const isSelfClosing = part.endsWith('/>') || voidElements.includes(tagName)
        
        formatted += ' '.repeat(indent) + part + '\n'
        
        if (!isSelfClosing) {
          indent += indentSize
        }
      } else {
        // Text content
        if (part.length > 0) {
          formatted += ' '.repeat(indent) + part + '\n'
        }
      }
    }
    
    return formatted.trim()
  }

  // Improved CSS formatter
  const formatCSS = (css: string) => {
    if (!css || css.trim().length === 0) return css
    
    let formatted = ''
    let indent = 0
    const indentSize = 2
    
    // Clean up CSS
    let cleanCss = css
      .replace(/\s*{\s*/g, ' {\n')
      .replace(/;\s*/g, ';\n')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\n\s*\n/g, '\n')
      .trim()
    
    const lines = cleanCss.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      
      if (trimmed === '}') {
        indent = Math.max(0, indent - indentSize)
        formatted += ' '.repeat(indent) + trimmed + '\n'
      } else if (trimmed.endsWith('{')) {
        formatted += ' '.repeat(indent) + trimmed + '\n'
        indent += indentSize
      } else {
        formatted += ' '.repeat(indent) + trimmed + '\n'
      }
    }
    
    return formatted.trim()
  }

  // Improved JavaScript formatter
  const formatJavaScript = (js: string) => {
    if (!js || js.trim().length === 0) return js
    
    let formatted = ''
    let indent = 0
    const indentSize = 2
    
    const lines = js.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) {
        formatted += '\n'
        continue
      }
      
      // Decrease indent for closing braces
      if (trimmed.startsWith('}')) {
        indent = Math.max(0, indent - indentSize)
      }
      
      formatted += ' '.repeat(indent) + trimmed + '\n'
      
      // Increase indent after opening braces
      if (trimmed.endsWith('{')) {
        indent += indentSize
      }
    }
    
    return formatted.trim()
  }

  // Properly escape HTML characters for display
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  const formattedCode = formatCode(code, language)
  const lines = formattedCode.split('\n')

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
                className="flex-1 leading-6 whitespace-pre min-w-0 text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: escapeHtml(line) || '&nbsp;' }}
              />
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

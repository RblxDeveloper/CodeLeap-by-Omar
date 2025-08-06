import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { difficulty, language, apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    // 70% chance of incorrect code for more challenge
    const shouldBeCorrect = Math.random() > 0.7

    // Add randomization to prompts for variety
    const getRandomTopic = (lang: string, diff: string) => {
      const topics = {
        javascript: {
          easy: ['variables', 'functions', 'arrays', 'objects', 'loops', 'conditionals', 'strings', 'numbers'],
          medium: ['array methods', 'object destructuring', 'arrow functions', 'promises', 'async/await', 'classes', 'modules'],
          hard: ['closures', 'prototypes', 'event loop', 'recursion', 'higher-order functions', 'generators', 'proxies']
        },
        html: {
          easy: ['headings', 'paragraphs', 'links', 'images', 'lists', 'divs', 'spans', 'buttons'],
          medium: ['forms', 'tables', 'semantic elements', 'attributes', 'input types', 'labels', 'fieldsets'],
          hard: ['accessibility', 'meta tags', 'custom elements', 'data attributes', 'microdata', 'web components']
        },
        css: {
          easy: ['colors', 'fonts', 'margins', 'padding', 'borders', 'backgrounds', 'text-align', 'display'],
          medium: ['flexbox', 'grid', 'positioning', 'transforms', 'transitions', 'pseudo-classes', 'media queries'],
          hard: ['animations', 'custom properties', 'calc()', 'clamp()', 'grid-areas', 'container queries', 'aspect-ratio']
        }
      }
      
      const topicList = topics[lang as keyof typeof topics][diff as keyof typeof topics[typeof lang]]
      return topicList[Math.floor(Math.random() * topicList.length)]
    }

    const randomTopic = getRandomTopic(language, difficulty)
    const randomScenario = Math.floor(Math.random() * 1000)

    const createPrompt = (lang: string, diff: string, isCorrect: boolean, topic: string, scenario: number) => {
      if (lang === 'html') {
        const htmlExample = isCorrect 
          ? `<div class="container">\\n  <h1>Welcome to Our Site</h1>\\n  <p>This is a sample paragraph with some content.</p>\\n  <ul>\\n    <li>First item</li>\\n    <li>Second item</li>\\n  </ul>\\n</div>`
          : `<div class="container">\\n  <h1>Welcome to Our Site</h2>\\n  <p>This is a sample paragraph with some content.</p>\\n  <ul>\\n    <li>First item</li>\\n    <li>Second item\\n  </ul>\\n</div>`
        
        return `Create a unique ${diff} HTML challenge about ${topic}. Scenario #${scenario}.

You must return ONLY a valid JSON object with this exact structure:

{
  "problem": "Is this HTML code correct?",
  "code": "${htmlExample}",
  "codeExplanation": "This HTML creates a container with heading, paragraph and list about ${topic}",
  "isCorrect": ${isCorrect},
  "explanation": "${isCorrect ? 'This HTML code is syntactically correct with proper nesting and closing tags.' : 'This HTML has an error - there is a mismatch between opening and closing tags.'}",
  "additionalInfo": "HTML elements must have matching opening and closing tags for proper structure."
}

CRITICAL RULES:
1. Return ONLY the JSON object, no other text
2. Use \\n for line breaks in the code field
3. Use \\" to escape quotes inside strings
4. Make the code about ${topic}
5. ${isCorrect ? 'Ensure HTML is completely valid' : 'Include ONE subtle HTML error (wrong closing tag, missing closing tag, invalid nesting)'}
6. Include proper indentation with 2 spaces per level
7. Make the code substantial (5-10 lines minimum)

The code should be complete and demonstrate ${topic} concepts.`
      } else if (lang === 'css') {
        const cssExample = isCorrect
          ? `.container {\\n  background-color: #f0f0f0;\\n  padding: 20px;\\n  margin: 10px;\\n  border-radius: 5px;\\n}\\n\\n.title {\\n  color: #333;\\n  font-size: 24px;\\n}`
          : `.container {\\n  background-color: #f0f0f0\\n  padding: 20px;\\n  margin: 10px;\\n  border-radius: 5px;\\n}\\n\\n.title {\\n  color: #333;\\n  font-size: 24px;\\n}`
        
        return `Create a unique ${diff} CSS challenge about ${topic}. Scenario #${scenario}.

You must return ONLY a valid JSON object with this exact structure:

{
  "problem": "Is this CSS code correct?",
  "code": "${cssExample}",
  "codeExplanation": "This CSS styles elements with ${topic} properties",
  "isCorrect": ${isCorrect},
  "explanation": "${isCorrect ? 'This CSS code is syntactically correct with proper semicolons and braces.' : 'This CSS has an error - missing semicolon after a property declaration.'}",
  "additionalInfo": "CSS declarations must end with semicolons for proper syntax."
}

CRITICAL RULES:
1. Return ONLY the JSON object, no other text
2. Use \\n for line breaks in the code field
3. Use \\" to escape quotes inside strings
4. Make the code about ${topic}
5. ${isCorrect ? 'Ensure CSS is completely valid' : 'Include ONE subtle CSS error (missing semicolon, wrong property name, invalid value)'}
6. Include proper indentation with 2 spaces per level
7. Make the code substantial (multiple selectors/properties)

The code should demonstrate ${topic} concepts clearly.`
      } else {
        const jsExample = isCorrect
          ? `function calculateSum(numbers) {\\n  let total = 0;\\n  for (let i = 0; i < numbers.length; i++) {\\n    total += numbers[i];\\n  }\\n  return total;\\n}\\n\\nconst result = calculateSum([1, 2, 3, 4, 5]);\\nconsole.log(result);`
          : `function calculateSum(numbers) {\\n  let total = 0;\\n  for (let i = 0; i < numbers.length; i++) {\\n    total += numbers[i]\\n  }\\n  return total;\\n}\\n\\nconst result = calculateSum([1, 2, 3, 4, 5]);\\nconsole.log(result);`
        
        return `Create a unique ${diff} JavaScript challenge about ${topic}. Scenario #${scenario}.

You must return ONLY a valid JSON object with this exact structure:

{
  "problem": "Is this JavaScript code correct?",
  "code": "${jsExample}",
  "codeExplanation": "This JavaScript function demonstrates ${topic} concepts",
  "isCorrect": ${isCorrect},
  "explanation": "${isCorrect ? 'This JavaScript code is syntactically correct with proper semicolons and braces.' : 'This JavaScript has an error - missing semicolon after a statement.'}",
  "additionalInfo": "JavaScript statements should end with semicolons for clarity and consistency."
}

CRITICAL RULES:
1. Return ONLY the JSON object, no other text
2. Use \\n for line breaks in the code field
3. Use \\" to escape quotes inside strings
4. Make the code about ${topic}
5. ${isCorrect ? 'Ensure JavaScript is completely valid' : 'Include ONE subtle JavaScript error (missing semicolon, wrong operator, undefined variable)'}
6. Include proper indentation with 2 spaces per level
7. Make the code substantial (multiple lines/statements)

The code should demonstrate ${topic} concepts clearly.`
      }
    }

    const prompt = createPrompt(language, difficulty, shouldBeCorrect, randomTopic, randomScenario)

    console.log(`🚀 Generating ${difficulty} ${language} challenge about ${randomTopic} (should be ${shouldBeCorrect ? 'correct' : 'incorrect'})...`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log('⏰ AI request timed out after 25 seconds')
      controller.abort()
    }, 25000)

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-4-scout-17b-16e-instruct",
          "messages": [
            {
              "role": "user",
              "content": prompt
            }
          ],
          "temperature": 0.3,
          "max_tokens": 1500
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Groq API error:', response.status, errorText)
        
        // Parse error details if available
        let errorDetails = errorText
        let isRateLimitError = false
        
        try {
          const errorJson = JSON.parse(errorText)
          errorDetails = errorJson.error?.message || errorText
          
          // Check for rate limit errors
          if (errorDetails.includes('Rate limit exceeded') || 
              errorDetails.includes('rate_limit_exceeded') ||
              response.status === 429) {
            isRateLimitError = true
          }
        } catch (e) {
          // Keep original error text if not JSON
          if (errorText.includes('Rate limit exceeded') || 
              errorText.includes('rate_limit_exceeded') ||
              response.status === 429) {
            isRateLimitError = true
          }
        }
        
        if (isRateLimitError) {
          throw new Error('RATE_LIMIT_EXCEEDED')
        }
        
        throw new Error(`Groq API error (${response.status}): ${errorDetails}`)
      }

      const aiResponse = await response.json()
      const content = aiResponse.choices?.[0]?.message?.content
      
      console.log('🤖 AI Response received, length:', content?.length || 0)

      if (!content) {
        throw new Error('No content received from AI')
      }

      let challenge = null

      // Improved JSON parsing with better handling of complex strings
      try {
        let cleanContent = content.trim()
        
        // Remove any markdown formatting
        cleanContent = cleanContent
          .replace(/```json\s*/gi, '')
          .replace(/```\s*/g, '')
          .trim()
        
        // Find the JSON object more carefully
        const firstBrace = cleanContent.indexOf('{')
        if (firstBrace === -1) {
          throw new Error('No JSON object found in response')
        }
        
        // Find the matching closing brace by counting braces
        let braceCount = 0
        let lastBrace = -1
        let inString = false
        let escapeNext = false
        
        for (let i = firstBrace; i < cleanContent.length; i++) {
          const char = cleanContent[i]
          
          if (escapeNext) {
            escapeNext = false
            continue
          }
          
          if (char === '\\') {
            escapeNext = true
            continue
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString
            continue
          }
          
          if (!inString) {
            if (char === '{') {
              braceCount++
            } else if (char === '}') {
              braceCount--
              if (braceCount === 0) {
                lastBrace = i
                break
              }
            }
          }
        }
        
        if (lastBrace === -1) {
          throw new Error('Could not find matching closing brace')
        }
        
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1)
        
        console.log('🔍 Attempting to parse JSON of length:', cleanContent.length)
        console.log('🔍 JSON preview:', cleanContent.substring(0, 200) + '...')
        
        challenge = JSON.parse(cleanContent)
        
        // Validate required fields
        if (!challenge.problem || !challenge.code || typeof challenge.isCorrect !== 'boolean') {
          throw new Error('Missing required fields in AI response')
        }
        
        console.log('✅ JSON parsing successful')
        console.log('📝 Code field length:', challenge.code?.length || 0)
        
      } catch (parseError) {
        console.log('❌ JSON parsing failed:', parseError.message)
        console.log('Raw content preview:', content.substring(0, 800))
        
        // Enhanced manual extraction with better regex patterns
        try {
          // More robust field extraction that handles multiline strings
          const extractField = (fieldName: string, content: string) => {
            // Pattern that handles multiline strings with escaped characters
            const pattern = new RegExp(`"${fieldName}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`,'s')
            const match = content.match(pattern)
            if (match) {
              return match[1]
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'")
                .replace(/\\\\/g, '\\')
            }
            return null
          }
          
          const extractBoolean = (fieldName: string, content: string) => {
            const regex = new RegExp(`"${fieldName}"\\s*:\\s*(true|false)`, 'i')
            const match = content.match(regex)
            return match ? match[1] === 'true' : null
          }
          
          const problem = extractField('problem', content)
          const code = extractField('code', content)
          const isCorrect = extractBoolean('isCorrect', content)
          const explanation = extractField('explanation', content)
          const codeExplanation = extractField('codeExplanation', content)
          const additionalInfo = extractField('additionalInfo', content)
          
          console.log('Manual extraction results:')
          console.log('- Problem:', problem ? 'Found' : 'Missing')
          console.log('- Code length:', code?.length || 0)
          console.log('- IsCorrect:', isCorrect)
          
          if (problem && code && isCorrect !== null) {
            challenge = {
              problem,
              code,
              codeExplanation: codeExplanation || `This ${language} code demonstrates ${randomTopic}.`,
              isCorrect,
              explanation: explanation || `This code is ${isCorrect ? 'correct' : 'incorrect'}.`,
              additionalInfo: additionalInfo || `This is a ${difficulty} ${language} example about ${randomTopic}.`
            }
            console.log('✅ Manual extraction successful')
          } else {
            throw new Error('Could not extract required fields')
          }
        } catch (manualError) {
          console.log('❌ Manual extraction failed:', manualError.message)
          throw new Error('Failed to parse AI response - using fallback')
        }
      }

      // Minimal cleaning to preserve the original formatting
      let cleanCode = challenge.code || ''
      
      // Only convert escaped characters, don't modify the structure
      cleanCode = cleanCode
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '  ')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\')

      const finalChallenge = {
        problem: challenge.problem || `Is this ${language} code correct?`,
        code: cleanCode,
        codeExplanation: challenge.codeExplanation || `This ${language} code demonstrates ${randomTopic}.`,
        isCorrect: typeof challenge.isCorrect === 'boolean' ? challenge.isCorrect : shouldBeCorrect,
        explanation: challenge.explanation || `This code is ${shouldBeCorrect ? 'correct' : 'incorrect'}.`,
        additionalInfo: challenge.additionalInfo || `This is a ${difficulty} ${language} example about ${randomTopic}.`,
        id: `ai-${language}-${difficulty}-${randomTopic}-${Date.now()}`,
        language,
        difficulty,
        timestamp: Date.now()
      }

      console.log('🎉 AI challenge created successfully')
      console.log('📝 Final code length:', finalChallenge.code.length)
      console.log('📝 Final code preview:', finalChallenge.code.substring(0, 300))
      
      return NextResponse.json(finalChallenge)

    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }

  } catch (error) {
    console.error('💥 AI generation failed:', error)
    
    // Handle rate limit errors specifically
    if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
      return NextResponse.json({
        error: 'Rate limit exceeded for Groq API. Please wait or upgrade your plan.',
        isRateLimit: true,
        fallbackUsed: true,
        ...getFallbackChallenge(language, difficulty)
      })
    }
    
    console.log('Using fallback challenge...')
    
    // Return fallback challenge for other errors
    return NextResponse.json({
      fallbackUsed: true,
      ...getFallbackChallenge(language, difficulty)
    })
  }
}

function getFallbackChallenge(language: string, difficulty: string) {
  // Updated fallback examples with complete, properly formatted code
  const variedFallbacks = {
    javascript: {
      easy: [
        {
          problem: "Does this variable assignment work?",
          code: "let age = 25;\nlet name = 'John';\nconsole.log('Hello ' + name + ', you are ' + age + ' years old.');",
          codeExplanation: "This code declares variables and creates a greeting message.",
          isCorrect: true,
          explanation: "This correctly declares variables and uses string concatenation.",
          additionalInfo: "Use 'let' for variables that can change their value."
        },
        {
          problem: "Will this function work correctly?",
          code: "function calculateArea(width, height) {\n  const area = width * height\n  return area;\n}\n\nconst result = calculateArea(5, 10);\nconsole.log('Area is: ' + result);",
          codeExplanation: "This function calculates the area of a rectangle.",
          isCorrect: false,
          explanation: "Missing semicolon after 'width * height'. Should be 'const area = width * height;'",
          additionalInfo: "JavaScript statements should end with semicolons for consistency."
        }
      ],
      medium: [
        {
          problem: "Does this array method work correctly?",
          code: "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(function(num) {\n  return num * 2;\n});\nconst sum = doubled.reduce((acc, curr) => acc + curr, 0);\nconsole.log('Sum of doubled numbers:', sum);",
          codeExplanation: "This code doubles array elements and calculates their sum.",
          isCorrect: true,
          explanation: "This correctly uses map() to transform elements and reduce() to sum them.",
          additionalInfo: "Array methods like map() and reduce() are powerful for data transformation."
        }
      ],
      hard: [
        {
          problem: "Does this closure implementation work?",
          code: "function createCounter(initialValue) {\n  let count = initialValue || 0;\n  \n  return {\n    increment: function() {\n      count++;\n      return count;\n    },\n    decrement: function() {\n      count--;\n      return count;\n    },\n    getValue: function() {\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter(5);\nconsole.log(counter.increment());",
          codeExplanation: "This creates a counter object using closures to maintain private state.",
          isCorrect: true,
          explanation: "This correctly implements a closure pattern with private variables and public methods.",
          additionalInfo: "Closures allow functions to access variables from their outer scope even after the outer function returns."
        }
      ]
    },
    html: {
      easy: [
        {
          problem: "Is this HTML structure correct?",
          code: '<div class="welcome-section">\n  <h1>Welcome to Our Website</h1>\n  <p>This is a sample paragraph with some <strong>bold text</strong> and a <a href="#about">link</a>.</p>\n  <img src="welcome.jpg" alt="Welcome image">\n</div>',
          codeExplanation: "This creates a welcome section with heading, paragraph, and image.",
          isCorrect: true,
          explanation: "This HTML is properly structured with correct nesting and attributes.",
          additionalInfo: "Always include alt attributes for images for accessibility."
        },
        {
          problem: "Is this list structure correct?",
          code: '<div class="navigation">\n  <h2>Menu</h2>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</div>',
          codeExplanation: "This creates a navigation menu with a list of links.",
          isCorrect: false,
          explanation: "Missing closing tag </li> for the 'About' list item. Each <li> must have a corresponding </li>.",
          additionalInfo: "All HTML elements must be properly closed to maintain valid document structure."
        }
      ],
      medium: [
        {
          problem: "Is this form structure correct?",
          code: '<form action="/submit" method="post" class="contact-form">\n  <fieldset>\n    <legend>Contact Information</legend>\n    \n    <label for="fullname">Full Name:</label>\n    <input type="text" id="fullname" name="fullname" required>\n    \n    <label for="email">Email Address:</label>\n    <input type="email" id="email" name="email" required>\n    \n    <label for="message">Message:</label>\n    <textarea id="message" name="message" rows="4" cols="50" required></textarea>\n    \n    <button type="submit">Send Message</button>\n  </fieldset>\n</form>',
          codeExplanation: "This creates a contact form with fieldset, labels, and various input types.",
          isCorrect: true,
          explanation: "This form is properly structured with semantic elements, proper labeling, and accessibility features.",
          additionalInfo: "Using fieldset and legend elements helps group related form controls and improves accessibility."
        }
      ],
      hard: [
        {
          problem: "Is this semantic HTML structure correct?",
          code: '<article class="blog-post">\n  <header>\n    <h1>Understanding Web Accessibility</h1>\n    <p class="meta">\n      <time datetime="2024-01-15">January 15, 2024</time>\n      by <span class="author">Jane Smith</span>\n    </p>\n  </header>\n  \n  <section class="content">\n    <h2>Introduction</h2>\n    <p>Web accessibility ensures that websites are usable by people with disabilities.</p>\n    \n    <h2>Key Principles</h2>\n    <ul>\n      <li>Perceivable - Information must be presentable in ways users can perceive</li>\n      <li>Operable - Interface components must be operable</li>\n      <li>Understandable - Information and UI operation must be understandable</li>\n      <li>Robust - Content must be robust enough for various assistive technologies</li>\n    </ul>\n  </section>\n  \n  <footer>\n    <p>Tags: <span class="tag">accessibility</span>, <span class="tag">web development</span></p>\n  </footer>\n</article>',
          codeExplanation: "This uses semantic HTML5 elements to structure a blog post with proper hierarchy.",
          isCorrect: true,
          explanation: "This correctly uses semantic elements like article, header, section, and footer with proper heading hierarchy.",
          additionalInfo: "Semantic HTML improves accessibility, SEO, and code maintainability by providing meaningful structure."
        }
      ]
    },
    css: {
      easy: [
        {
          problem: "Is this CSS styling correct?",
          code: ".header {\n  background-color: #2c3e50;\n  color: white;\n  padding: 20px;\n  text-align: center;\n}\n\n.header h1 {\n  margin: 0;\n  font-size: 2.5em;\n  font-weight: bold;\n}",
          codeExplanation: "This styles a header section with background, text color, and typography.",
          isCorrect: true,
          explanation: "This CSS is properly formatted with correct syntax and semicolons.",
          additionalInfo: "Using specific selectors like '.header h1' helps target elements precisely."
        },
        {
          problem: "Will this button styling work?",
          code: ".button {\n  background-color: #3498db\n  color: white;\n  padding: 12px 24px;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.button:hover {\n  background-color: #2980b9;\n}",
          codeExplanation: "This styles a button with colors, padding, and hover effects.",
          isCorrect: false,
          explanation: "Missing semicolon after 'background-color: #3498db'. Should be '#3498db;'",
          additionalInfo: "Every CSS property declaration must end with a semicolon."
        }
      ],
      medium: [
        {
          problem: "Does this flexbox layout work?",
          code: ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.item {\n  flex: 1;\n  margin: 0 10px;\n  padding: 15px;\n  background-color: #f8f9fa;\n  border-radius: 8px;\n}",
          codeExplanation: "This creates a flexible layout container with evenly distributed items.",
          isCorrect: true,
          explanation: "This correctly uses flexbox properties to create a responsive layout with proper spacing.",
          additionalInfo: "Flexbox is excellent for creating flexible, responsive layouts with minimal code."
        }
      ],
      hard: [
        {
          problem: "Will this CSS Grid and animation work?",
          code: ".grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n  padding: 20px;\n}\n\n.grid-item {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  padding: 30px;\n  border-radius: 12px;\n  color: white;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.grid-item:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.grid-item {\n  animation: fadeInUp 0.6s ease-out;\n}",
          codeExplanation: "This creates a responsive grid layout with gradient backgrounds, hover effects, and animations.",
          isCorrect: true,
          explanation: "This correctly combines CSS Grid, gradients, transitions, and keyframe animations for a modern layout.",
          additionalInfo: "CSS Grid with auto-fit and minmax creates truly responsive layouts that adapt to any screen size."
        }
      ]
    }
  }

  // Get random example from the appropriate difficulty
  const examples = variedFallbacks[language as keyof typeof variedFallbacks][difficulty as keyof typeof variedFallbacks[typeof language]]
  const randomExample = examples[Math.floor(Math.random() * examples.length)]
  
  return {
    ...randomExample,
    id: `fallback-${language}-${difficulty}-${Date.now()}`,
    language,
    difficulty,
    timestamp: Date.now()
  }
}

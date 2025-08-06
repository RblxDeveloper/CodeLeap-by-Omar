import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { difficulty, language } = await request.json()

    // Use the new API key
    const apiKey = "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"

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
        if (isCorrect) {
          return `Create a unique ${diff} HTML coding challenge about ${topic}. Use scenario #${scenario} for uniqueness. Return ONLY valid JSON:

{
  "problem": "Is this HTML code correct?",
  "code": "proper HTML code with actual tags like <div>, <p>, <span>, etc.",
  "codeExplanation": "what this HTML code does with ${topic}",
  "isCorrect": true,
  "explanation": "why this HTML code works correctly",
  "additionalInfo": "learning tip about ${topic}"
}

IMPORTANT: Use real HTML tags like <div>, <p>, <h1>, <img>, <a>, etc. Make sure the HTML code contains actual angle brackets < and >. 
Example: <div class="container"><p>Hello World</p></div>

Create completely different HTML code each time about ${topic}.`
        } else {
          return `Create a unique ${diff} HTML coding challenge about ${topic} with a BUG. Use scenario #${scenario} for uniqueness. Return ONLY valid JSON:

{
  "problem": "Is this HTML code correct?",
  "code": "buggy HTML code with actual tags like <div>, <p>, etc. but with a mistake",
  "codeExplanation": "what this HTML code is supposed to do with ${topic}",
  "isCorrect": false,
  "explanation": "what the HTML bug is and how to fix it",
  "additionalInfo": "learning tip about this ${topic} mistake"
}

IMPORTANT: Use real HTML tags with angle brackets < and >. Include common HTML mistakes like:
- Missing closing tags: <div><p>text</div> (missing </p>)
- Wrong closing tags: <h1>title</h2>
- Invalid nesting: <p><div>content</div></p>
- Missing required attributes: <img src="photo.jpg"> (missing alt)
- Typos in tag names: <dvi>content</dvi>

Example buggy code: <div class="header"><h1>Title</h2></div>`
        }
      } else if (isCorrect) {
        return `Create a unique ${diff} ${lang} coding challenge about ${topic}. Use scenario #${scenario} for uniqueness. Return ONLY valid JSON:

{
  "problem": "Is this ${lang} code correct?",
  "code": "working ${lang} code about ${topic}",
  "codeExplanation": "what this code does with ${topic}",
  "isCorrect": true,
  "explanation": "why this ${topic} code works correctly",
  "additionalInfo": "learning tip about ${topic}"
}

Create completely different code each time. Make it about ${topic} but vary the implementation, variable names, and approach. Be creative and unique.`
      } else {
        return `Create a unique ${diff} ${lang} coding challenge about ${topic} with a BUG. Use scenario #${scenario} for uniqueness. Return ONLY valid JSON:

{
  "problem": "Is this ${lang} code correct?",
  "code": "buggy ${lang} code about ${topic}",
  "codeExplanation": "what this code is supposed to do with ${topic}",
  "isCorrect": false,
  "explanation": "what the bug is and how to fix it",
  "additionalInfo": "learning tip about this ${topic} mistake"
}

Include a subtle bug in ${topic} code like:
- JavaScript: = vs ===, missing semicolon, wrong operator, undefined variable, wrong method
- CSS: missing semicolon, wrong property, invalid value, typos

Make each challenge completely different with unique variable names, scenarios, and implementations.`
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
      // Get the site URL from headers or use default
      const siteUrl = request.headers.get('host') 
        ? `https://${request.headers.get('host')}`
        : "https://codeleap.vercel.app"

      // Use the exact format you provided
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": siteUrl,
          "X-Title": "CodeLeap - AI Coding Challenges",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat-v3-0324:free",
          "messages": [
            {
              "role": "user",
              "content": prompt
            }
          ]
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ OpenRouter API error:', response.status, errorText)
        
        // Parse error details if available
        let errorDetails = errorText
        try {
          const errorJson = JSON.parse(errorText)
          errorDetails = errorJson.error?.message || errorText
        } catch (e) {
          // Keep original error text if not JSON
        }
        
        throw new Error(`OpenRouter API error (${response.status}): ${errorDetails}`)
      }

      const aiResponse = await response.json()
      const content = aiResponse.choices?.[0]?.message?.content
      
      if (!content) {
        throw new Error('No content received from AI')
      }

      let challenge = null

      // Parse JSON response
      try {
        let cleanContent = content.trim()
        cleanContent = cleanContent.replace(/\`\`\`json\s*/gi, '').replace(/\`\`\`\s*/g, '')
        
        const jsonStart = cleanContent.indexOf('{')
        const jsonEnd = cleanContent.lastIndexOf('}')
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1)
        }
        
        challenge = JSON.parse(cleanContent)
      } catch (parseError) {
        console.log('❌ JSON parsing failed:', parseError.message)
        throw new Error('Failed to parse AI response')
      }

      // Clean the code - but preserve HTML tags for HTML challenges
      let cleanCode = challenge.code || ''
      
      if (language === 'html') {
        // For HTML: Only remove syntax highlighting spans, preserve actual HTML tags
        cleanCode = cleanCode
          .replace(/<span[^>]*class="[^"]*text-[^"]*"[^>]*>/gi, '') // Remove syntax highlighting spans
          .replace(/<\/span>/gi, '')                                // Remove closing spans
          .replace(/&lt;/g, '<')                                   // Convert HTML entities to actual brackets
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '  ')
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, '\\')
          .trim()
      } else {
        // For JavaScript and CSS: Remove all HTML tags (they shouldn't be there)
        cleanCode = cleanCode
          .replace(/<[^>]*>/g, '')           // Remove HTML tags
          .replace(/&lt;/g, '<')            // Convert entities
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '  ')
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, '\\')
          .trim()
      }

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
      return NextResponse.json(finalChallenge)

    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }

  } catch (error) {
    console.error('💥 AI generation failed, using fallback:', error)
    
    // More varied fallback examples with proper HTML
    const variedFallbacks = {
      javascript: {
        easy: [
          {
            problem: "Does this variable assignment work?",
            code: "let age = 25;\nconsole.log(age);",
            codeExplanation: "This code declares a variable and prints it.",
            isCorrect: true,
            explanation: "This correctly declares and uses a variable.",
            additionalInfo: "Use 'let' for variables that can change."
          },
          {
            problem: "Will this string concatenation work?",
            code: "let firstName = 'John';\nlet lastName = 'Doe';\nlet fullName = firstName + lastName;",
            codeExplanation: "This code combines two strings together.",
            isCorrect: false,
            explanation: "Missing space between names. Should be firstName + ' ' + lastName.",
            additionalInfo: "Remember to add spaces when concatenating names."
          },
          {
            problem: "Is this array creation correct?",
            code: "const fruits = ['apple', 'banana', 'orange'];\nconsole.log(fruits[0]);",
            codeExplanation: "This creates an array and accesses the first element.",
            isCorrect: true,
            explanation: "This correctly creates an array and accesses index 0.",
            additionalInfo: "Array indices start at 0, not 1."
          },
          {
            problem: "Does this loop work properly?",
            code: "for (let i = 0; i < 5; i++) {\n  console.log(i)\n}",
            codeExplanation: "This loop prints numbers from 0 to 4.",
            isCorrect: false,
            explanation: "Missing semicolon after console.log(i). Should be console.log(i);",
            additionalInfo: "Always end statements with semicolons in JavaScript."
          },
          {
            problem: "Is this function call correct?",
            code: "function greet(name) {\n  return 'Hello ' + name;\n}\nlet message = greet('Alice');",
            codeExplanation: "This function creates a greeting message.",
            isCorrect: true,
            explanation: "This correctly defines and calls a function.",
            additionalInfo: "Functions can return values that can be stored in variables."
          },
          {
            problem: "Will this comparison work?",
            code: "let score = 85;\nif (score = 100) {\n  console.log('Perfect!');\n}",
            codeExplanation: "This checks if the score is perfect.",
            isCorrect: false,
            explanation: "Uses assignment (=) instead of comparison (===). Should be score === 100.",
            additionalInfo: "Use === for comparison, = for assignment."
          }
        ],
        medium: [
          {
            problem: "Does this array method work?",
            code: "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(x => x * 2);",
            codeExplanation: "This doubles each number in the array.",
            isCorrect: true,
            explanation: "This correctly uses map to transform array elements.",
            additionalInfo: "Map creates a new array with transformed elements."
          },
          {
            problem: "Is this object destructuring correct?",
            code: "const person = { name: 'John', age: 30 };\nconst { name, age } = person;",
            codeExplanation: "This extracts properties from an object.",
            isCorrect: true,
            explanation: "This correctly destructures object properties.",
            additionalInfo: "Destructuring makes it easy to extract object properties."
          },
          {
            problem: "Will this arrow function work?",
            code: "const add = (a, b) => {\n  return a + b\n};",
            codeExplanation: "This creates a function to add two numbers.",
            isCorrect: false,
            explanation: "Missing semicolon after return statement. Should be 'return a + b;'",
            additionalInfo: "Even in arrow functions, statements need semicolons."
          }
        ],
        hard: [
          {
            problem: "Does this closure work correctly?",
            code: "function createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}",
            codeExplanation: "This creates a counter using closure.",
            isCorrect: true,
            explanation: "This correctly creates a closure that maintains state.",
            additionalInfo: "Closures allow functions to access outer scope variables."
          },
          {
            problem: "Is this async function correct?",
            code: "async function fetchData() {\n  const response = fetch('/api/data');\n  return response.json();\n}",
            codeExplanation: "This fetches data from an API.",
            isCorrect: false,
            explanation: "Missing 'await' before fetch. Should be 'await fetch('/api/data')'.",
            additionalInfo: "Always use await with promises in async functions."
          }
        ]
      },
      html: {
        easy: [
          {
            problem: "Is this paragraph tag correct?",
            code: "<p>Welcome to my website!</p>",
            codeExplanation: "This creates a paragraph of text.",
            isCorrect: true,
            explanation: "This is a properly formatted paragraph element.",
            additionalInfo: "Paragraph tags are used for blocks of text."
          },
          {
            problem: "Is this link tag correct?",
            code: '<a href="https://example.com">Visit Example</a>',
            codeExplanation: "This creates a clickable link.",
            isCorrect: true,
            explanation: "This correctly creates a link with href attribute.",
            additionalInfo: "The href attribute specifies the link destination."
          },
          {
            problem: "Is this image tag correct?",
            code: '<img src="photo.jpg" alt="My photo">',
            codeExplanation: "This displays an image on the page.",
            isCorrect: false,
            explanation: "Missing closing > bracket. Should end with >",
            additionalInfo: "All HTML tags must be properly closed."
          },
          {
            problem: "Is this heading structure correct?",
            code: '<h1>Main Title</h1>\n<h2>Subtitle</h2>\n<p>Content goes here.</p>',
            codeExplanation: "This creates a heading hierarchy with content.",
            isCorrect: true,
            explanation: "This correctly uses heading tags in proper order.",
            additionalInfo: "Use h1 for main titles, h2 for subtitles, etc."
          },
          {
            problem: "Is this div structure correct?",
            code: '<div class="container">\n  <p>Hello World</p>\n</div>',
            codeExplanation: "This creates a container div with a paragraph inside.",
            isCorrect: true,
            explanation: "This correctly nests a paragraph inside a div container.",
            additionalInfo: "Divs are used to group and style content."
          },
          {
            problem: "Is this list correct?",
            code: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>',
            codeExplanation: "This creates an unordered list with three items.",
            isCorrect: false,
            explanation: "Missing closing tag </li> for 'Item 2'. Each list item needs proper closing.",
            additionalInfo: "All HTML elements must be properly closed."
          }
        ],
        medium: [
          {
            problem: "Is this form correct?",
            code: '<form>\n  <label for="username">Username:</label>\n  <input type="text" id="username">\n</form>',
            codeExplanation: "This creates a form with a text input.",
            isCorrect: true,
            explanation: "This correctly associates label with input using for/id.",
            additionalInfo: "Labels improve form accessibility."
          },
          {
            problem: "Is this table structure correct?",
            code: '<table>\n  <tr>\n    <th>Name</th>\n    <th>Age</th>\n  </tr>\n  <tr>\n    <td>John</td>\n    <td>25</td>\n  </tr>\n</table>',
            codeExplanation: "This creates a simple data table.",
            isCorrect: true,
            explanation: "This correctly structures a table with headers and data.",
            additionalInfo: "Use th for headers and td for data cells."
          },
          {
            problem: "Is this form input correct?",
            code: '<form>\n  <input type="email" placeholder="Enter email">\n  <button type="submit">Submit</button>\n</form>',
            codeExplanation: "This creates a form with email input and submit button.",
            isCorrect: true,
            explanation: "This correctly creates a form with proper input types.",
            additionalInfo: "Use specific input types like 'email' for better validation."
          }
        ],
        hard: [
          {
            problem: "Is this semantic HTML correct?",
            code: '<article>\n  <header>\n    <h1>Article Title</h1>\n  </header>\n  <section>\n    <p>Article content goes here.</p>\n  </section>\n</article>',
            codeExplanation: "This uses semantic HTML5 elements.",
            isCorrect: true,
            explanation: "This correctly uses semantic elements for structure.",
            additionalInfo: "Semantic HTML improves accessibility and SEO."
          },
          {
            problem: "Is this navigation structure correct?",
            code: '<nav>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>',
            codeExplanation: "This creates a navigation menu using semantic HTML.",
            isCorrect: true,
            explanation: "This correctly uses nav element with proper list structure.",
            additionalInfo: "Use nav element for main navigation areas."
          }
        ]
      },
      css: {
        easy: [
          {
            problem: "Is this CSS rule correct?",
            code: ".title {\n  color: blue;\n  font-size: 24px;\n}",
            codeExplanation: "This styles a title with blue color and large font.",
            isCorrect: true,
            explanation: "This correctly sets color and font size properties.",
            additionalInfo: "CSS properties are separated by semicolons."
          },
          {
            problem: "Will this background work?",
            code: ".header {\n  background-color: #f0f0f0;\n  padding: 20px;\n}",
            codeExplanation: "This sets a light gray background with padding.",
            isCorrect: false,
            explanation: "Missing semicolon after background-color. Should be '#f0f0f0;'",
            additionalInfo: "Every CSS declaration must end with a semicolon."
          }
        ],
        medium: [
          {
            problem: "Does this flexbox work?",
            code: ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}",
            codeExplanation: "This creates a flex container with spaced items.",
            isCorrect: true,
            explanation: "This correctly uses flexbox for layout.",
            additionalInfo: "Flexbox is great for one-dimensional layouts."
          },
          {
            problem: "Is this grid layout correct?",
            code: ".grid {\n  display: grid;\n  grid-template-columns: 1fr 2fr;\n  gap: 15px;\n}",
            codeExplanation: "This creates a two-column grid layout.",
            isCorrect: false,
            explanation: "Missing colon after 'gap'. Should be 'gap: 15px;'",
            additionalInfo: "CSS properties need a colon between name and value."
          }
        ],
        hard: [
          {
            problem: "Will this animation work?",
            code: "@keyframes fadeIn {\n  0% { opacity: 0; }\n  100% { opacity: 1; }\n}\n\n.fade {\n  animation: fadeIn 2s ease-in-out;\n}",
            codeExplanation: "This creates a fade-in animation effect.",
            isCorrect: true,
            explanation: "This correctly defines and applies a CSS animation.",
            additionalInfo: "Keyframes define the steps of an animation."
          }
        ]
      }
    }

    // Get random example from the appropriate difficulty
    const examples = variedFallbacks[language as keyof typeof variedFallbacks][difficulty as keyof typeof variedFallbacks[typeof language]]
    const randomExample = examples[Math.floor(Math.random() * examples.length)]
    
    return NextResponse.json({
      ...randomExample,
      id: `fallback-${language}-${difficulty}-${Date.now()}`,
      language,
      difficulty,
      timestamp: Date.now()
    })
  }
}

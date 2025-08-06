# CodeLeap - AI Coding Challenges

## Overview

CodeLeap is an interactive coding challenge application that uses AI to generate unique programming challenges in JavaScript, HTML, and CSS. Test your debugging skills by identifying whether code snippets are correct or contain bugs!

## Features

- **AI-Generated Challenges**: Unique challenges every time using DeepSeek AI
- **Multiple Languages**: JavaScript, HTML, and CSS support
- **Difficulty Levels**: Easy, Medium, and Hard challenges
- **Interactive Learning**: Detailed explanations and learning tips
- **Challenge History**: Track your progress and accuracy
- **HTML Preview**: Live preview for HTML challenges
- **Dark/Light Theme**: Toggle between themes
- **Fallback System**: Curated challenges when AI is unavailable

## How It Works

1. **Select Language & Difficulty**: Choose from JavaScript, HTML, or CSS at Easy, Medium, or Hard levels
2. **Generate Challenge**: AI creates a unique coding challenge with potential bugs
3. **Analyze Code**: Review the code snippet and decide if it's correct or incorrect
4. **Get Feedback**: Receive detailed explanations and learning tips
5. **Track Progress**: View your challenge history and accuracy stats

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI**: DeepSeek Chat v3 via OpenRouter API
- **Deployment**: Vercel-ready

## API Configuration

The application uses the DeepSeek Chat v3 model through OpenRouter API:

- **Model**: `deepseek/deepseek-chat-v3-0324:free`
- **API Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Features**: Free tier available, high-quality code generation

## Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd codeleap
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   \`\`\`
   http://localhost:3000
   \`\`\`

## Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Import your repository to Vercel
   - Deploy automatically

2. **Environment Variables**
   - No additional environment variables needed
   - API key is configured in the code

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Challenge Types

### JavaScript Challenges
- **Easy**: Variables, functions, arrays, basic syntax
- **Medium**: Array methods, destructuring, async/await
- **Hard**: Closures, prototypes, advanced concepts

### HTML Challenges
- **Easy**: Basic tags, structure, attributes
- **Medium**: Forms, tables, semantic elements
- **Hard**: Accessibility, web components, advanced HTML5

### CSS Challenges
- **Easy**: Colors, fonts, basic styling
- **Medium**: Flexbox, grid, responsive design
- **Hard**: Animations, custom properties, advanced layouts

## Error Handling

The application includes robust error handling:

- **AI Timeout**: 25-second timeout for AI requests
- **Fallback System**: Curated challenges when AI fails
- **Error Messages**: Clear feedback for users
- **Retry Logic**: Automatic fallback to backup challenges

## Performance Features

- **Fast Generation**: Optimized prompts for quick AI responses
- **Caching**: Challenge history stored locally
- **Responsive**: Works on desktop and mobile
- **Progressive Enhancement**: Works even if JavaScript fails

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the browser console for error messages
- Verify your internet connection
- Try refreshing the page
- Use fallback challenges if AI is unavailable

The application is designed to work reliably with both AI-generated and fallback challenges, ensuring a consistent learning experience.

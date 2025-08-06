import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey || !apiKey.startsWith('gsk_')) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 400 }
      )
    }

    // Test the API key with a simple request
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
            "content": "Hello"
          }
        ],
        "max_tokens": 5
      })
    })

    if (response.ok) {
      return NextResponse.json({ valid: true })
    } else {
      const errorText = await response.text()
      let errorMessage = 'Invalid API key'
      
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.message || errorMessage
      } catch (e) {
        // Keep default message
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('API key validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate API key' },
      { status: 500 }
    )
  }
}

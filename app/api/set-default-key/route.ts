import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Set the default Groq API key
    const defaultApiKey = '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'
    
    return NextResponse.json({ 
      apiKey: defaultApiKey,
      message: 'Default API key set successfully' 
    })
  } catch (error) {
    console.error('Error setting default API key:', error)
    return NextResponse.json(
      { error: 'Failed to set default API key' },
      { status: 500 }
    )
  }
}

'use server'

import { Id } from '@/convex/_generated/dataModel'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIChatRequest {
  documentId: Id<'documents'>
  conversationHistory: Message[]
  documentContent: string
  latestMessage: Message
}

async function generateResponse({
  conversationHistory,
  documentContent,
  latestMessage
}: AIChatRequest) {
  try {
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an AI assistant. Here's the conversation history:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Here's the content of the document:
${documentContent}

User: ${latestMessage.content}
AI:`

    // Debugging logs
    console.log('Conversation history:', conversationHistory)
    console.log('Document content:', documentContent)
    console.log('Latest message:', latestMessage)

    const result = await model.generateContent(prompt)
    const response = await result.response

    console.log('Generated response:', response.text())

    return response.text() || ''
  } catch (error) {
    console.error('Error getting response:', error)
    return 'Unable to generate a response at this time.'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AIChatRequest = await request.json()

    const response = await generateResponse(body)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

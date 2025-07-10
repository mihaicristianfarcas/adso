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

async function generateStreamResponse({
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

    const result = await model.generateContentStream(prompt)
    return result.stream
  } catch (error) {
    console.error('Error getting response:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AIChatRequest = await request.json()

    const stream = await generateStreamResponse(body)

    // Create a ReadableStream for streaming the response
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const chunkText = chunk.text()
            if (chunkText) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunkText })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

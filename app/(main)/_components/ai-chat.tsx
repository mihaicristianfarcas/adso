'use client'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIChatProps {
  documentId: Id<'documents'>
}

export default function AIChat({ documentId }: AIChatProps) {
  const create = useMutation(api.messages.create)
  const document = useQuery(api.documents.getById, {
    documentId: documentId
  })
  const getConversationHistory = useMutation(
    api.messages.getConversationHistory
  )

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        const conversationHistory = await getConversationHistory({
          documentId
        })
        setMessages(
          conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        )
      } catch (error) {
        console.error('Failed to fetch conversation history:', error)
        toast.error('Failed to load conversation history.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchMessages()
  }, [documentId, getConversationHistory])

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // User's input
    const content = inputRef.current?.value
    if (!content) return

    // Add user message
    let promise = create({
      documentId,
      content,
      role: 'user'
    })

    // Add user message to local state
    messages.push({ role: 'user', content })

    // AI's response
    const apiResponse = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documentId,
        conversationHistory: messages,
        documentContent: document?.content || '',
        latestMessage: { role: 'user', content }
      })
    })

    if (!apiResponse.ok) {
      throw new Error('Failed to get AI response')
    }

    const { response } = await apiResponse.json()

    // Add AI message
    promise = create({
      documentId,
      content: response,
      role: 'assistant'
    })

    // Add AI message to local state
    messages.push({
      role: 'assistant',
      content: response
    })

    setMessages([...messages])

    inputRef.current!.value = ''

    // TODO Remove after testing
    toast.promise(promise, {
      error: 'Failed to send message.'
    })
  }

  if (isLoading)
    return (
      <div className='flex h-full items-center justify-center'>
        <Spinner size='lg' />
      </div>
    )

  return (
    <div className='animate-in fade-in mx-auto flex h-full w-full flex-col rounded-md shadow-lg'>
      {/* Messages */}
      <div className='bg-muted flex-1 space-y-4 overflow-y-auto px-4 py-2'>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
            }
          >
            <div
              className={
                'max-w-[80%] rounded-xl px-3 py-2 text-sm ' +
                (msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground')
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <form
        className='bg-muted flex items-center gap-4 px-4 py-3'
        onSubmit={event => {
          event.preventDefault()
          handleSubmit(event)
        }}
      >
        <Input
          ref={inputRef}
          type='text'
          placeholder='Type your message...'
          className='bg-input focus:ring-ring flex-1 rounded-md px-3 py-2 text-sm transition focus:ring-2 focus:outline-none'
        />
        <Button
          type='submit'
          className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md p-2 transition'
        >
          <Send className='h-4 w-4' />
        </Button>
      </form>
    </div>
  )
}

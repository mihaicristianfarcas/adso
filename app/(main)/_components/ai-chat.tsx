'use client'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
  const messages = useQuery(api.messages.getConversationHistory, {
    documentId
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (
    e?:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e) e.preventDefault()

    // User's input
    const content = inputRef.current?.value?.trim()
    if (!content || !messages) return

    setIsSubmitting(true)

    try {
      // Add user message to database
      await create({
        documentId,
        content,
        role: 'user'
      })

      // Prepare conversation history for AI API
      const conversationHistory: Message[] = [
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content }
      ]

      // AI's response
      const apiResponse = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentId,
          conversationHistory,
          documentContent: document?.content || '',
          latestMessage: { role: 'user', content }
        })
      })

      if (!apiResponse.ok) {
        throw new Error('Failed to get AI response')
      }

      const { response } = await apiResponse.json()

      // Add AI message to database
      await create({
        documentId,
        content: response,
        role: 'assistant'
      })

      inputRef.current!.value = ''
      // Reset textarea height
      inputRef.current!.style.height = 'auto'
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading states
  if (document === undefined || messages === undefined) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Spinner size='lg' />
      </div>
    )
  }

  return (
    <div className='animate-in fade-in mx-auto flex h-full w-full flex-col rounded-md shadow-lg'>
      {/* Messages */}
      <div className='bg-muted flex-1 space-y-4 overflow-y-auto px-4 py-2'>
        {messages.map(msg => (
          <div
            key={msg._id}
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
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form
        className='bg-muted flex items-center gap-4 px-4 py-3'
        onSubmit={event => {
          event.preventDefault()
          handleSubmit(event)
        }}
      >
        <Textarea
          ref={inputRef}
          placeholder='Type your message...'
          disabled={isSubmitting}
          rows={1}
          className='bg-input focus:ring-ring max-h-[120px] min-h-[40px] flex-1 resize-none rounded-md px-3 py-2 text-sm transition focus:ring-2 focus:outline-none disabled:opacity-50'
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          onInput={e => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`
          }}
        />
        <Button
          type='submit'
          disabled={isSubmitting}
          className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md p-2 transition disabled:opacity-50'
        >
          {isSubmitting ? <Spinner size='sm' /> : <Send className='h-4 w-4' />}
        </Button>
      </form>
    </div>
  )
}

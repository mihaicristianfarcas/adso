'use client'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { BotIcon, Send } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@clerk/clerk-react'
import { useDeviceDetect } from '@/hooks/use-device-detect'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

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

  const pathname = usePathname()
  const { isMobile, isTouchDevice } = useDeviceDetect()
  const isResizingRef = useRef(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const [isResetting, setIsResetting] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()
    event.stopPropagation()
    isResizingRef.current = true
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return
    let newWidth = window.innerWidth - event.clientX
    if (newWidth < 320) newWidth = 320
    if (newWidth > 480) newWidth = 480
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  const resetWidth = () => {
    if (sidebarRef.current) {
      setIsResetting(true)
      sidebarRef.current.style.width = isMobile ? '100%' : '360px'
      setTimeout(() => {
        setIsResetting(false)
      }, 200)
    }
  }

  const collapse = () => {
    if (sidebarRef.current) {
      setIsResetting(true)
      sidebarRef.current.style.width = '0'
      setTimeout(() => {
        setIsResetting(false)
      }, 200)
    }
  }

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
      <aside
        className={cn(
          'bg-background border-border fixed top-13 right-0 z-[99998] flex h-[calc(100vh-3.5rem)] border-l shadow-lg transition-all duration-200 ease-in-out',
          'w-[360px] md:w-[400px] lg:w-[440px]',
          isMobile && 'left-0 w-full border-t border-l-0'
        )}
      >
        <div className='flex flex-1 items-center justify-center'>
          <Spinner size='lg' />
        </div>
      </aside>
    )
  }

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        'group/sidebar bg-background border-border fixed top-13 right-0 bottom-0 z-[99998] flex flex-shrink-0 flex-col border shadow-lg',
        'w-[360px] md:w-[400px] lg:w-[440px]',
        isResetting && 'transition-all duration-200 ease-in-out',
        isMobile && 'left-0 w-full border-t border-l-0'
      )}
    >
      <div
        onMouseDown={handleMouseDown}
        onClick={resetWidth}
        className={cn(
          'bg-primary/10 absolute top-0 left-0 z-10 h-full w-1 cursor-ew-resize',
          isMobile
            ? 'hidden' // Hide resize handle on mobile
            : isTouchDevice
              ? 'opacity-100'
              : 'opacity-0 group-hover/sidebar:opacity-100'
        )}
      />
      {/* Chat content */}
      <div className='flex h-full w-full flex-col'>
        {/* Messages */}
        <div className='min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4 md:px-4'>
          {messages.map(msg => (
            <div
              key={msg._id}
              className={cn(
                'gap-x-2',
                msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <Avatar className='h-5 w-5 flex-shrink-0 md:h-6 md:w-6'>
                  <BotIcon className='h-4 w-4 md:h-5 md:w-5' />
                </Avatar>
              )}
              <div
                className={
                  'max-w-[85%] rounded-xl px-3 py-2 text-xs break-words md:max-w-[80%] md:text-sm ' +
                  (msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground prose prose-sm dark:prose-invert border')
                }
              >
                {msg.role === 'assistant' ? (
                  <div className='prose prose-sm dark:prose-invert overflow-hidden'>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        pre: ({ children, ...props }) => (
                          <pre {...props} className="overflow-x-auto whitespace-pre-wrap break-words">
                            {children}
                          </pre>
                        ),
                        code: ({ children, ...props }) => (
                          <code {...props} className="break-words">
                            {children}
                          </code>
                        ),
                        p: ({ children, ...props }) => (
                          <p {...props} className="break-words">
                            {children}
                          </p>
                        ),
                        a: ({ children, ...props }) => (
                          <a {...props} className="break-all">
                            {children}
                          </a>
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === 'user' && (
                <Avatar className='h-5 w-5 flex-shrink-0 md:h-6 md:w-6'>
                  <AvatarImage src={user?.imageUrl} />
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className='border-border flex-shrink-0 border-t p-3 md:p-4'>
          <form
            className='flex items-end gap-2'
            onSubmit={event => {
              event.preventDefault()
              handleSubmit(event)
            }}
          >
            <Textarea
              ref={inputRef}
              placeholder='Ask Adso...'
              disabled={isSubmitting}
              rows={1}
              className='bg-input focus:ring-ring max-h-[100px] min-h-[36px] flex-1 resize-none rounded-md px-3 py-2 text-xs transition focus:ring-2 focus:outline-none disabled:opacity-50 md:max-h-[120px] md:min-h-[40px] md:text-sm'
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                const maxHeight = isMobile ? 100 : 120
                target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`
              }}
            />
            <Button
              type='submit'
              disabled={isSubmitting}
              className='bg-primary text-primary-foreground hover:bg-primary/90 h-[36px] w-[36px] rounded-md p-2 transition disabled:opacity-50 md:h-[40px] md:w-[40px]'
            >
              {isSubmitting ? (
                <Spinner size='sm' />
              ) : (
                <Send className='h-3 w-3 md:h-4 md:w-4' />
              )}
            </Button>
          </form>
        </div>
      </div>
    </aside>
  )
}

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { Send } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

interface AIChatProps {
  documentId: Id<'documents'>
}

export default function AIChat({ documentId }: AIChatProps) {
  const create = useMutation(api.messages.create)
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([])

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // User's input
    let content = inputRef.current?.value
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
    content = 'This is a simulated response from the AI.'

    // Add AI message
    promise = create({
      documentId,
      content,
      role: 'assistant'
    })

    // Add AI message to local state
    messages.push({
      role: 'assistant',
      content
    })

    setMessages([...messages])

    inputRef.current!.value = ''

    // TODO Remove after testing
    toast.promise(promise, {
      error: 'Failed to send message.'
    })
  }

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
        className='bg-popover flex items-center gap-2 rounded-lg px-4 py-3'
        onSubmit={e => {
          e.preventDefault()
          handleSubmit(e)
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

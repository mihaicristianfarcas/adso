import { X, Send } from 'lucide-react'
import { useRef } from 'react'

interface AIChatProps {
  onClose?: () => void
}

export default function AIChat({ onClose }: AIChatProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  // Placeholder messages
  const messages = [
    { role: 'ai', content: 'Hello! How can I help you today?' },
    { role: 'user', content: 'What can you do?' },
    {
      role: 'ai',
      content:
        'I can assist you with your documents, answer questions, and more.'
    }
  ]

  return (
    <div className='bg-popover border-border animate-in fade-in slide-in-from-bottom-4 mx-auto flex h-[400px] w-full max-w-sm flex-col rounded-lg border shadow-lg'>
      {/* Header */}
      <div className='border-border bg-secondary flex items-center justify-between rounded-t-lg border-b px-4 py-2'>
        <span className='text-foreground text-sm font-medium'>Adso Chat</span>
        {onClose && (
          <button
            onClick={onClose}
            className='hover:bg-muted rounded p-1 transition'
          >
            <X className='text-muted-foreground h-4 w-4' />
          </button>
        )}
      </div>
      {/* Messages */}
      <div className='bg-popover flex-1 space-y-2 overflow-y-auto px-4 py-2'>
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
                  : 'bg-muted text-foreground')
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <form
        className='border-border bg-popover flex items-center gap-2 rounded-b-lg border-t px-4 py-3'
        onSubmit={e => {
          e.preventDefault()
          // Placeholder: focus input
          inputRef.current?.blur()
        }}
      >
        <input
          ref={inputRef}
          type='text'
          placeholder='Type your message...'
          className='bg-input border-border focus:ring-ring flex-1 rounded-md border px-3 py-2 text-sm transition focus:ring-2 focus:outline-none'
        />
        <button
          type='submit'
          className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md p-2 transition'
        >
          <Send className='h-4 w-4' />
        </button>
      </form>
    </div>
  )
}

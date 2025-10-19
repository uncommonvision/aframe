import { useState, useRef } from 'react'
import { useKeydownShortcut } from '@/hooks/useKeydownShortcut'

export interface MessageSubmissionProps {
  onSubmit: (message: string) => void
  placeholder?: string
}

export default function MessageSubmission({
  onSubmit,
  placeholder = "Type a message..."
}: MessageSubmissionProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useKeydownShortcut(
    { key: 'm', ctrl: false, alt: false, shift: false, meta: false },
    () => textareaRef.current?.focus(),
    'Focus Message Input',
    'Focus on the message input field'
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSubmit(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background p-4">
      <form onSubmit={handleSubmit}>
        <div className="grid">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="col-start-1 row-start-1 resize-none min-h-9 max-h-32 overflow-auto px-3 py-2 rounded-md border border-input bg-background text-foreground text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground md:text-sm"
          />
          <div
            className="col-start-1 row-start-1 invisible whitespace-pre-wrap break-words px-3 py-2 text-base md:text-sm pointer-events-none"
            aria-hidden="true"
          >
            {message + ' '}
          </div>
        </div>
      </form>
    </div>
  )
}

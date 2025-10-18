import { useState } from 'react'
import MessageItem from '@/components/ui/MessageItem'
import MessageSubmission from '@/components/ui/MessageSubmission'
import type { ChatMessage, User } from '@/types/messages'
import { useKeydownShortcut } from '@/hooks/useKeydownShortcut'

export interface MessagesListProps {
  messages: ChatMessage[]
  currentUser: User
  emptyMessage?: string
  onMessageSubmit?: (message: string) => void
  showInput?: boolean
  inputPlaceholder?: string
}

export default function MessagesList({
  messages,
  currentUser,
  emptyMessage = 'No messages',
  onMessageSubmit,
  showInput = false,
  inputPlaceholder,
}: MessagesListProps) {
  const [timestampsVisible, setTimestampsVisible] = useState(false)

  useKeydownShortcut(
    { key: 's' },
    () => setTimestampsVisible(prev => !prev),
    'Toggle Timestamps',
    'Show or hide message timestamps'
  )

  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center py-12 flex-1 min-h-0">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
        {showInput && onMessageSubmit && (
          <MessageSubmission
            onSubmit={onMessageSubmit}
            placeholder={inputPlaceholder}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isCurrentUser={'sender' in message ? message.sender.id === currentUser.id : false}
            showTimestamp={timestampsVisible}
          />
        ))}
      </div>
      {showInput && onMessageSubmit && (
        <MessageSubmission
          onSubmit={onMessageSubmit}
          placeholder={inputPlaceholder}
        />
      )}
    </div>
  )
}

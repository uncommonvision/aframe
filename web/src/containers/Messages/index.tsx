import { useState } from 'react'
import MessageItem from '@/components/ui/MessageItem'
import type { Message, User } from '@/types/messages'
import { useKeydownShortcut } from '@/hooks/useKeydownShortcut'

export interface MessagesProps {
  messages: Message[]
  currentUser: User
  emptyMessage?: string
}

export default function Messages({
  messages,
  currentUser,
  emptyMessage = 'No messages',
}: MessagesProps) {
  const [timestampsVisible, setTimestampsVisible] = useState(false)

  useKeydownShortcut(
    { key: 's' },
    () => setTimestampsVisible(prev => !prev),
    'Toggle Timestamps',
    'Show or hide message timestamps'
  )

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isCurrentUser={message.sender.id === currentUser.id}
          showTimestamp={timestampsVisible}
        />
      ))}
    </div>
  )
}

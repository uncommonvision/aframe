import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import type { Message } from '@/types/messages'
import { format } from 'date-fns'

export interface MessageItemProps {
  message: Message
  isCurrentUser: boolean
  showTimestamp: boolean
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export default function MessageItem({
  message,
  isCurrentUser,
  showTimestamp,
}: MessageItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="w-10 shrink-0" />
        <span className={`text-xs font-medium text-foreground ${isCurrentUser ? 'text-right pr-3' : 'text-left pl-3'}`}>
          {message.sender.name}
        </span>
      </div>

      <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
        <Avatar className="h-10 w-10 shrink-0">
          {message.sender.imageUrl && (
            <AvatarImage src={message.sender.imageUrl} alt={message.sender.name} />
          )}
          <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-0">
          <Card
            className={`${
              isCurrentUser
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-foreground border-border/30'
            } max-w-[70vw]`}
          >
            <CardContent className="p-3">
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.text}
              </p>
            </CardContent>
          </Card>

          <div className={`w-2 h-4 -mt-1.5 ${isCurrentUser ? 'self-end -mr-1 -rotate-[30deg]' : 'self-start -ml-1 rotate-[30deg]'}`}>
            <svg viewBox="0 0 10 20" className="w-full h-full" preserveAspectRatio="none">
              <polygon 
                points={isCurrentUser ? "0,0 10,0 10,12" : "0,0 10,0 0,12"}
                className={isCurrentUser ? "fill-primary stroke-primary" : "fill-muted stroke-border/30"}
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
      </div>

      {showTimestamp && (
        <div className="flex justify-center w-full">
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.sentAt), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
      )}
    </div>
  )
}

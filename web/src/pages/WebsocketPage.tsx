import { useParams } from 'react-router-dom'
import { useMessagingService } from '@/hooks/useMessagingService'
import { useUserIdentity } from '@/hooks/useUserIdentity'
import { DefaultLayout } from "@/components/layout"
import { useEffect, useState } from 'react'
import { MessagesList } from '@/components/ui'
import UserNameDialog from '@/components/ui/UserNameDialog'

import type { ChatMessage, MessagePayload } from '@/types'



export default function WebsocketPage() {
  const { id } = useParams<{ id: string }>()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const { user, setUser } = useUserIdentity()

  // Ensure we have a valid UUID before attempting connection
  const validUuid = id && id.trim() !== "" ? id : null

  const { connectionState, error, sendMessage, onMessage, reconnect } = useMessagingService({
    uuid: validUuid || "",
    autoConnect: !!validUuid && !!user
  })

  // Send USER_IDENTIFY message when connected
  useEffect(() => {
    if (connectionState === 'connected' && user) {
      import('@/services/websocket').then(({ websocketService }) => {
        websocketService.send('USER_IDENTIFY', {
          userId: user.id,
          userName: user.name
        })
      })
    }
  }, [connectionState, user])

  // Handle incoming messages
  useEffect(() => {
    const unsubscribe = onMessage((wsMessage) => {
      switch (wsMessage.type) {
        case 'MESSAGE':
          setMessages(prev => [...prev, wsMessage.payload])
          break
        case 'USER_JOINED': {
          const joinMessage: ChatMessage = {
            id: `system-${Date.now()}`,
            text: `${wsMessage.payload.user.name} joined the chat`,
            sentAt: wsMessage.timestamp,
            isSystem: true,
            systemType: 'USER_JOINED'
          }
          setMessages(prev => [...prev, joinMessage])
          break
        }
        case 'USER_LEFT': {
          const leaveMessage: ChatMessage = {
            id: `system-${Date.now()}`,
            text: `${wsMessage.payload.user.name} left the chat`,
            sentAt: wsMessage.timestamp,
            isSystem: true,
            systemType: 'USER_LEFT'
          }
          setMessages(prev => [...prev, leaveMessage])
          break
        }
      }
    })

    return unsubscribe
  }, [onMessage])

  const handleUserNameSubmit = (name: string) => {
    setUser(name)
  }

  const handleMessageSubmit = (text: string) => {
    if (!user) return

    const messagePayload: Omit<MessagePayload, 'id' | 'sentAt'> = {
      sender: user,
      channel: { id: 'channel-1', name: 'General' },
      text
    }

    sendMessage(messagePayload)

    const optimisticMessage: ChatMessage = {
      ...messagePayload,
      id: `temp-${Date.now()}`,
      sentAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, optimisticMessage])
  }

  return (
    <DefaultLayout>
      <UserNameDialog open={!user} onSubmit={handleUserNameSubmit} />
      
      <div className="flex flex-col h-full space-y-6 pb-24">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Websocket Example
          </h1>
          <p className="text-sm text-muted-foreground">
            Watch the websocket
          </p>
          {!validUuid && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-800">
                Waiting for valid session ID...
              </p>
            </div>
          )}
          {validUuid && user && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                Signed in as <span className="font-medium text-foreground">{user.name}</span>
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <div className={`w-2 h-2 rounded-full ${
                connectionState === 'connected' ? 'bg-green-500' :
                connectionState === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`} />
              <span className="text-xs text-muted-foreground capitalize">
                {connectionState.replace('_', ' ')}
              </span>
              {error && (
                <span className="text-xs text-red-500">
                  Error: {error.message}
                </span>
              )}
              {connectionState === 'error' && (
                <button
                  onClick={reconnect}
                  className="text-xs text-blue-500 hover:text-blue-700 underline"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>

        {user && (
          <MessagesList
            messages={messages}
            currentUser={user}
            showInput={true}
            onMessageSubmit={handleMessageSubmit}
            inputPlaceholder="Type a message..."
          />
        )}
      </div>
    </DefaultLayout>
  )
}

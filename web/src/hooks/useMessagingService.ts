import { useEffect, useState, useCallback, useRef } from 'react'
import { websocketService, handleConnectionAck, type ConnectionState } from '@/services/websocket'
import type { WebSocketMessage, MessagePayload } from '@/types'

interface UseMessagingServiceOptions {
  uuid: string
  autoConnect?: boolean
  onConnectionChange?: (connected: boolean, state: ConnectionState) => void
}

interface UseMessagingServiceReturn {
  isConnected: boolean
  connectionState: ConnectionState
  error: Error | null
  sendMessage: (message: Omit<MessagePayload, 'id' | 'sentAt'>) => void
  onMessage: (callback: (message: WebSocketMessage) => void) => () => void
  reconnect: () => Promise<void>
  disconnect: () => void
}

export function useMessagingService(options: UseMessagingServiceOptions): UseMessagingServiceReturn {
  const { uuid, autoConnect = true, onConnectionChange } = options

  const [error, setError] = useState<Error | null>(null)
  const [, forceUpdate] = useState({})

  const onConnectionChangeRef = useRef(onConnectionChange)

  useEffect(() => {
    onConnectionChangeRef.current = onConnectionChange
  }, [onConnectionChange])

  useEffect(() => {
    const unsubscribe = websocketService.onStateChange((state) => {
      onConnectionChangeRef.current?.(state === 'connected', state)
      forceUpdate({})
    })

    if (autoConnect && uuid) {
      const connect = async () => {
        try {
          setError(null)
          await websocketService.connect(uuid)
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to connect')
          setError(error)
        }
      }
      connect()
    }

    return unsubscribe
  }, [uuid, autoConnect])

  const connectionState = websocketService.getConnectionState()
  const isConnected = websocketService.isConnected()

  useEffect(() => {
    const unsubscribeAck = handleConnectionAck(() => { })

    return unsubscribeAck
  }, [])

  const reconnect = useCallback(async () => {
    try {
      setError(null)
      await websocketService.connect(uuid)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reconnect')
      setError(error)
    }
  }, [uuid])

  const disconnect = useCallback(() => {
    websocketService.disconnect()
  }, [])

  const sendMessage = (message: Omit<MessagePayload, 'id' | 'sentAt'>) => {
    if (!websocketService.isConnected()) {
      console.error('WebSocket not connected')
      return
    }

    const chatMessage: WebSocketMessage = {
      type: 'MESSAGE',
      payload: {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sentAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    }

    websocketService.send('CHAT_MESSAGE', chatMessage)
  }

  const onMessage = useCallback((callback: (message: WebSocketMessage) => void) => {
    const unsubscribeChatMessage = websocketService.on('CHAT_MESSAGE', (data: WebSocketMessage) => {
      try {
        callback(data)
      } catch (error) {
        console.error('Error in messaging callback:', error)
      }
    })

    const unsubscribeUserJoined = websocketService.on('USER_JOINED', (data: any) => {
      try {
        const userJoinedEvent: WebSocketMessage = {
          type: 'USER_JOINED',
          payload: {
            user: {
              id: data.userId,
              name: data.userName
            },
            channelId: data.sessionId
          },
          timestamp: new Date().toISOString()
        }
        callback(userJoinedEvent)
      } catch (error) {
        console.error('Error in user joined callback:', error)
      }
    })

    const unsubscribeUserLeft = websocketService.on('USER_LEFT', (data: any) => {
      try {
        const userLeftEvent: WebSocketMessage = {
          type: 'USER_LEFT',
          payload: {
            user: {
              id: data.userId,
              name: data.userName
            },
            channelId: data.sessionId
          },
          timestamp: new Date().toISOString()
        }
        callback(userLeftEvent)
      } catch (error) {
        console.error('Error in user left callback:', error)
      }
    })

    return () => {
      unsubscribeChatMessage()
      unsubscribeUserJoined()
      unsubscribeUserLeft()
    }
  }, [])

  return {
    isConnected,
    connectionState,
    error,
    sendMessage,
    onMessage,
    reconnect,
    disconnect
  }
}

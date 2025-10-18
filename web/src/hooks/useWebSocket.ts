import { useEffect, useState, useRef } from 'react'
import { websocketService, type WSMessageType, type MessageHandler } from '@/services/websocket'

interface UseWebSocketOptions {
  uuid: string
  autoConnect?: boolean
  onConnectionChange?: (connected: boolean) => void
}

interface UseWebSocketReturn {
  isConnected: boolean
  error: Error | null
  subscribe: <T>(type: WSMessageType, handler: MessageHandler<T>) => void
  unsubscribe: <T>(type: WSMessageType, handler: MessageHandler<T>) => void
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const { uuid, autoConnect = true, onConnectionChange } = options
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const connectAttemptedRef = useRef(false)

  useEffect(() => {
    if (!autoConnect || !uuid) return

    const connect = async () => {
      try {
        await websocketService.connect(uuid)
        setIsConnected(true)
        setError(null)
        onConnectionChange?.(true)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to connect'))
        setIsConnected(false)
        onConnectionChange?.(false)
      }
    }

    if (!connectAttemptedRef.current) {
      connectAttemptedRef.current = true
      connect()
    }

    const checkConnection = setInterval(() => {
      const connected = websocketService.isConnected()
      if (connected !== isConnected) {
        setIsConnected(connected)
        onConnectionChange?.(connected)
      }
    }, 1000)

    return () => {
      clearInterval(checkConnection)
      websocketService.disconnect()
      connectAttemptedRef.current = false
    }
  }, [uuid, autoConnect, onConnectionChange, isConnected])

  const subscribe = <T>(type: WSMessageType, handler: MessageHandler<T>) => {
    websocketService.on(type, handler)
  }

  const unsubscribe = <T>(type: WSMessageType, handler: MessageHandler<T>) => {
    websocketService.off(type, handler)
  }

  return {
    isConnected,
    error,
    subscribe,
    unsubscribe
  }
}

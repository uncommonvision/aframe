export type WSMessageType =
  | 'CONNECTION_ACK'
  | 'GENERIC_DATA'

export interface WSMessage<T = unknown> {
  type: WSMessageType
  timestamp: string
  data: T
}

export interface GenericPayload {
  data: any
  status: string
  queued_at: string
}

export type MessageHandler<T = unknown> = (data: T) => void

export interface WebSocketConnection {
  connect: (mixId: string) => Promise<void>
  disconnect: () => void
  on: <T>(type: WSMessageType, handler: MessageHandler<T>) => () => void
  off: <T>(type: WSMessageType, handler: MessageHandler<T>) => void
  isConnected: () => boolean
}

function createWebSocketConnection(): WebSocketConnection {
  let ws: WebSocket | null = null
  let id: string | null = null
  let reconnectAttempts = 0
  const maxReconnectAttempts = 5
  const reconnectDelay = 1000
  const handlers = new Map<WSMessageType, Set<MessageHandler>>()
  let isIntentionallyClosed = false

  const handleMessage = (event: MessageEvent) => {
    try {
      const message: WSMessage = JSON.parse(event.data)
      const typeHandlers = handlers.get(message.type)

      if (typeHandlers) {
        typeHandlers.forEach(handler => {
          try {
            handler(message.data)
          } catch (error) {
            console.error(`Error in handler for ${message.type}:`, error)
          }
        })
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  const setupEventListeners = () => {
    if (!ws) return

    ws.addEventListener('message', handleMessage)

    ws.addEventListener('open', () => {
      console.log('WebSocket connected')
      reconnectAttempts = 0
    })

    ws.addEventListener('close', () => {
      console.log('WebSocket closed')
      if (!isIntentionallyClosed && reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => reconnect(), reconnectDelay * Math.pow(2, reconnectAttempts))
        reconnectAttempts++
      }
    })

    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  const reconnect = () => {
    if (id && !isIntentionallyClosed) {
      connect(id)
    }
  }

  const connect = (newId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      id = newId
      isIntentionallyClosed = false

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//localhost:8080/api/v1/ws/${id}`

      try {
        ws = new WebSocket(wsUrl)
        setupEventListeners()

        ws.addEventListener('open', () => resolve(), { once: true })
        ws.addEventListener('error', (error) => reject(error), { once: true })
      } catch (error) {
        reject(error)
      }
    })
  }

  const disconnect = () => {
    isIntentionallyClosed = true
    if (ws) {
      ws.close()
      ws = null
    }
    id = null
  }

  const on = <T>(type: WSMessageType, handler: MessageHandler<T>): (() => void) => {
    if (!handlers.has(type)) {
      handlers.set(type, new Set())
    }
    handlers.get(type)!.add(handler as MessageHandler)

    return () => off(type, handler)
  }

  const off = <T>(type: WSMessageType, handler: MessageHandler<T>) => {
    const typeHandlers = handlers.get(type)
    if (typeHandlers) {
      typeHandlers.delete(handler as MessageHandler)
    }
  }

  const isConnected = (): boolean => {
    return ws?.readyState === WebSocket.OPEN
  }

  return {
    connect,
    disconnect,
    on,
    off,
    isConnected
  }
}

export const websocketService = createWebSocketConnection()

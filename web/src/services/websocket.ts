export type WSMessageType =
  | 'CONNECTION_ACK'
  | 'GENERIC_DATA'
  | 'USER_IDENTIFY'
  | 'USER_JOINED'
  | 'USER_LEFT'
  | 'CHAT_MESSAGE'

export interface ConnectionAckData {
  id: string
  message: string
}

export interface WSMessage<T = unknown> {
  type: WSMessageType
  timestamp: string
  data: T
}

export interface GenericPayload {
  data: unknown
  status: string
  queued_at: string
}

export interface UserIdentifyPayload {
  userId: string
  userName: string
}

export type MessageHandler<T = unknown> = (data: T) => void

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'

export type StateChangeHandler = (state: ConnectionState) => void

export interface WebSocketConnection {
  connect: (uuid: string) => Promise<void>
  disconnect: () => void
  send: <T>(type: WSMessageType, data: T) => void
  on: <T>(type: WSMessageType, handler: MessageHandler<T>) => () => void
  off: <T>(type: WSMessageType, handler: MessageHandler<T>) => void
  isConnected: () => boolean
  getConnectionState: () => ConnectionState
  onStateChange: (handler: StateChangeHandler) => () => void
}

function createWebSocketConnection(): WebSocketConnection {
  let ws: WebSocket | null = null
  let currentUuid: string | null = null
  let connectionState: ConnectionState = 'disconnected'
  const handlers = new Map<WSMessageType, Set<MessageHandler>>()
  const stateChangeHandlers = new Set<StateChangeHandler>()

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

  const connect = (uuid: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // If already connected/connecting to the same UUID, don't reconnect
      if (currentUuid === uuid && ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
        resolve()
        return
      }

      // Close old connection if exists and connecting to different UUID
      if (ws) {
        ws.close()
        ws = null
      }

      currentUuid = uuid
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/api/v1/ws/${uuid}`

      notifyStateChange('connecting')

      try {
        ws = new WebSocket(wsUrl)

        ws.addEventListener('message', handleMessage)

        ws.addEventListener('open', () => {
          notifyStateChange('connected')
          resolve()
        }, { once: true })

        ws.addEventListener('error', (error) => {
          notifyStateChange('error')
          reject(error)
        }, { once: true })

        ws.addEventListener('close', (event) => {
          notifyStateChange(event.wasClean ? 'disconnected' : 'error')
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
    }
    currentUuid = null
    notifyStateChange('disconnected')
  }

  const send = <T>(type: WSMessageType, data: T): void => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected')
    }

    const message: WSMessage<T> = {
      type,
      timestamp: new Date().toISOString(),
      data
    }

    ws.send(JSON.stringify(message))
  }

  const isConnected = (): boolean => {
    return ws?.readyState === WebSocket.OPEN
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

  const notifyStateChange = (newState: ConnectionState) => {
    if (connectionState !== newState) {
      connectionState = newState
      stateChangeHandlers.forEach(handler => {
        try {
          handler(newState)
        } catch (error) {
          console.error('Error in state change handler:', error)
        }
      })
    }
  }

  const getConnectionState = (): ConnectionState => {
    return connectionState
  }

  const onStateChange = (handler: StateChangeHandler): (() => void) => {
    stateChangeHandlers.add(handler)
    return () => {
      stateChangeHandlers.delete(handler)
    }
  }

  return {
    connect,
    disconnect,
    send,
    on,
    off,
    isConnected,
    getConnectionState,
    onStateChange
  }
}

export const websocketService = createWebSocketConnection()

// Helper function to handle connection acknowledgment
export const handleConnectionAck = (callback: (data: ConnectionAckData) => void) => {
  return websocketService.on('CONNECTION_ACK', callback)
}

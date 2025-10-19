import type { User, Channel } from './messages'

export type WebSocketMessage =
  | MessageEvent
  | UserJoinedEvent
  | UserLeftEvent
  | ErrorEvent

export interface MessageEvent {
  type: 'MESSAGE'
  payload: MessagePayload
  timestamp: string
}

export interface UserJoinedEvent {
  type: 'USER_JOINED'
  payload: UserEventPayload
  timestamp: string
}

export interface UserLeftEvent {
  type: 'USER_LEFT'
  payload: UserEventPayload
  timestamp: string
}

export interface ErrorEvent {
  type: 'ERROR'
  payload: ErrorPayload
  timestamp: string
}

export interface MessagePayload {
  id: string
  sender: User
  channel: Channel
  text: string
  sentAt: string
}

export interface UserEventPayload {
  user: User
  channelId: string
}

export interface ErrorPayload {
  message: string
  code?: string
}

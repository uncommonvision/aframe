import type { User, Channel } from './messages'

export type WebSocketMessage =
  | MessageEvent
  | UserJoinedEvent
  | UserLeftEvent
  | ErrorEvent

export interface MessageEvent {
  type: 'message'
  payload: MessagePayload
  timestamp: string
}

export interface UserJoinedEvent {
  type: 'user_joined'
  payload: UserEventPayload
  timestamp: string
}

export interface UserLeftEvent {
  type: 'user_left'
  payload: UserEventPayload
  timestamp: string
}

export interface ErrorEvent {
  type: 'error'
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

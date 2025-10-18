export interface User {
  id: string
  name: string
  imageUrl?: string
}

export interface Channel {
  id: string
  name: string
}

export interface Message {
  id: string
  sender: User
  channel: Channel
  text: string
  sentAt: Date | string
}

export interface SystemMessage {
  id: string
  text: string
  sentAt: string
  isSystem: true
  systemType: 'user_joined' | 'user_left' | 'error'
}

export type ChatMessage = Message | SystemMessage

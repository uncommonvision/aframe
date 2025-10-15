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

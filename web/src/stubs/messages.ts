import type { User, Channel, Message } from '@/types/messages'

export const stubUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
  },
  {
    id: 'user-3',
    name: 'Carol Williams',
  },
]

export const stubChannels: Channel[] = [
  {
    id: 'channel-1',
    name: 'General',
  },
  {
    id: 'channel-2',
    name: 'Random',
  },
  {
    id: 'channel-3',
    name: 'Development',
  },
]

export const stubMessages: Message[] = [
  {
    id: 'msg-1',
    sender: stubUsers[1],
    channel: stubChannels[0],
    text: 'Hey everyone! How is the project going?',
    sentAt: new Date('2025-10-15T09:00:00'),
  },
  {
    id: 'msg-2',
    sender: stubUsers[0],
    channel: stubChannels[0],
    text: 'Going well! Just finished the new Messages component.',
    sentAt: new Date('2025-10-15T09:05:00'),
  },
  {
    id: 'msg-3',
    sender: stubUsers[1],
    channel: stubChannels[0],
    text: 'That sounds great! Can you show me a demo?',
    sentAt: new Date('2025-10-15T09:10:00'),
  },
  {
    id: 'msg-4',
    sender: stubUsers[0],
    channel: stubChannels[0],
    text: 'Sure! The component supports chat-style layouts with avatars, timestamps, and alternating message alignment.',
    sentAt: new Date('2025-10-15T09:12:00'),
  },
  {
    id: 'msg-5',
    sender: stubUsers[2],
    channel: stubChannels[0],
    text: 'This looks awesome! I love the design.',
    sentAt: new Date('2025-10-15T09:15:00'),
  },
  {
    id: 'msg-6',
    sender: stubUsers[0],
    channel: stubChannels[0],
    text: 'Thanks! It uses shadcn components and follows the existing design patterns.',
    sentAt: new Date('2025-10-15T09:18:00'),
  },
  {
    id: 'msg-7',
    sender: stubUsers[1],
    channel: stubChannels[0],
    text: 'Perfect! Let\'s integrate it into the WebSocket page.',
    sentAt: new Date('2025-10-15T09:20:00'),
  },
]

export const currentUser: User = stubUsers[0]

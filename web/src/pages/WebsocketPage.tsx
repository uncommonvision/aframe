import { useParams } from 'react-router-dom'
import { useWebSocket } from '@/hooks/useWebSocket'
import { DefaultLayout } from "@/components/layout"
import { useEffect } from 'react'
import { Messages } from '@/containers'
import { MessageSubmission } from '@/components/ui'
import { stubMessages, currentUser } from '@/stubs/messages'

import type {
  GenericPayload,
} from '@/services/websocket'

export interface WebsocketEventHandlers {
  onGeneric?: (data: GenericPayload) => void
}

export default function WebsocketPage() {
  const { id } = useParams<{ id: string }>()

  const { subscribe, unsubscribe } = useWebSocket({ uuid: id || "" })

  const handlers: WebsocketEventHandlers = {
    onGeneric: (data) => {
      if (data) {
        console.log(data)
      }
    }
  }

  useEffect(() => {
    if (handlers.onGeneric) {
      subscribe('GENERIC_DATA', handlers.onGeneric)
    }
  }, [handlers, subscribe, unsubscribe])

  const handleMessageSubmit = (message: string) => {
    console.log('Message submitted:', message)
    // TODO: Send message via websocket
  }

  return (
    <DefaultLayout>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Websocket Example
          </h1>
          <p className="text-sm text-muted-foreground">
            Watch the websocket
          </p>
        </div>

        <Messages
          messages={stubMessages}
          currentUser={currentUser}
        />
      </div>
      <MessageSubmission onSubmit={handleMessageSubmit} />
    </DefaultLayout>
  )
}

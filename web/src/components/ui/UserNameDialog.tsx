import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface UserNameDialogProps {
  open: boolean
  onSubmit: (name: string) => void
}

export default function UserNameDialog({ open, onSubmit }: UserNameDialogProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (trimmedName) {
      onSubmit(trimmedName)
      setName('')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Join Chat
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your name to start chatting
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!name.trim()}
          >
            Join Chat
          </Button>
        </form>
      </div>
    </div>
  )
}

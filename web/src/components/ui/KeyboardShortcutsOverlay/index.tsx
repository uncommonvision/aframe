import { useState, useRef, useEffect } from 'react'
import { Keyboard } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useKeydownShortcut, getRegisteredShortcuts } from '@/hooks/useKeydownShortcut'

interface KeyComboProps {
  shortcut: {
    key: string
    ctrl?: boolean
    alt?: boolean
    shift?: boolean
    meta?: boolean
  }
}

function KeyCombo({ shortcut }: KeyComboProps) {
  const parts: string[] = []

  if (shortcut.ctrl) parts.push('Ctrl')
  if (shortcut.alt) parts.push('Alt')
  if (shortcut.shift) parts.push('Shift')
  if (shortcut.meta) parts.push('Cmd')

  parts.push(shortcut.key.toUpperCase())

  return (
    <div className="flex items-center gap-1">
      {parts.map((part, index) => (
        <span key={index} className="inline-flex items-center">
          <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
            {part}
          </kbd>
          {index < parts.length - 1 && (
            <span className="mx-1 text-muted-foreground">+</span>
          )}
        </span>
      ))}
    </div>
  )
}

export default function KeyboardShortcutsOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [shortcuts, setShortcuts] = useState<ReturnType<typeof getRegisteredShortcuts>>([])

  const toggleOverlay = () => setIsOpen(prev => !prev)

  useClickOutside(overlayRef, () => setIsOpen(false))

  useKeydownShortcut(
    { key: '?' },
    toggleOverlay,
    'Show Keyboard Shortcuts',
    'Toggle this help overlay'
  )

  useEffect(() => {
    if (isOpen) {
      setShortcuts(getRegisteredShortcuts())
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={overlayRef}
        className="max-w-[85vw] md:max-w-[66.67vw] max-h-[66.67vh] bg-popover border border-border rounded-lg shadow-lg overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Keyboard className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-popover-foreground">
            Keyboard shortcuts
          </h2>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent">
          <div className="space-y-3">
            {shortcuts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No keyboard shortcuts registered
              </p>
            ) : (
              shortcuts.map((shortcut) => (
                <div
                  key={shortcut.id}
                  className="flex items-start justify-between gap-4 md:gap-16 py-2"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-popover-foreground">
                      {shortcut.name || 'Unnamed shortcut'}
                    </div>
                    {shortcut.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {shortcut.description}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <KeyCombo shortcut={shortcut} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

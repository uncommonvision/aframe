import { useEffect } from 'react'

interface ShortcutOptions {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  enabled?: boolean
}

interface RegisteredShortcut {
  id: string
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  name?: string
  description?: string
  callback: () => void
}

const shortcutRegistry = new Map<string, RegisteredShortcut>()

export function getRegisteredShortcuts(): RegisteredShortcut[] {
  return Array.from(shortcutRegistry.values())
}

export function useKeydownShortcut(
  options: ShortcutOptions,
  callback: () => void,
  name?: string,
  description?: string
) {
  const { key, ctrl, alt, shift, meta, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const shortcutId = `${key}-${ctrl}-${alt}-${shift}-${meta}-${Date.now()}`
    
    if (name || description) {
      shortcutRegistry.set(shortcutId, {
        id: shortcutId,
        key,
        ctrl,
        alt,
        shift,
        meta,
        name,
        description,
        callback
      })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return

      if (ctrl !== undefined && event.ctrlKey !== ctrl) return
      if (alt !== undefined && event.altKey !== alt) return
      if (shift !== undefined && event.shiftKey !== shift) return
      if (meta !== undefined && event.metaKey !== meta) return

      const activeElement = document.activeElement
      const isInputFocused =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        (activeElement as HTMLElement)?.isContentEditable === true

      if (isInputFocused) return

      event.preventDefault()
      callback()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      shortcutRegistry.delete(shortcutId)
    }
  }, [key, ctrl, alt, shift, meta, enabled, callback, name, description])
}

import { useEffect } from 'react'

interface ShortcutOptions {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  enabled?: boolean
}

export function useKeydownShortcut(
  options: ShortcutOptions,
  callback: () => void
) {
  const { key, ctrl, alt, shift, meta, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

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
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [key, ctrl, alt, shift, meta, enabled, callback])
}

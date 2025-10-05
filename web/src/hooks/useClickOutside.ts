import { useEffect, type RefObject } from 'react'

interface ClickOutsideOptions {
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  enabled?: boolean
}

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  options?: ClickOutsideOptions
) {
  const { ctrl, alt, shift, meta, enabled = true } = options || {}

  useEffect(() => {
    if (!enabled) return

    const handleMouseDown = (event: MouseEvent) => {
      if (ctrl !== undefined && event.ctrlKey !== ctrl) return
      if (alt !== undefined && event.altKey !== alt) return
      if (shift !== undefined && event.shiftKey !== shift) return
      if (meta !== undefined && event.metaKey !== meta) return

      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [ref, callback, ctrl, alt, shift, meta, enabled])
}

import { useEffect, useRef } from 'react'

export function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLDivElement | HTMLButtonElement

      if (event.target === ref.current || ref.current?.contains(target)) {
        return
      }

      if (target?.contains(ref.current) || target !== ref.current) {
        // console.log('clicked outside')
        callback()
      }
    }

    window && window.addEventListener('click', handleClick, { capture: true })
    return () => {
      window && window.removeEventListener('click', handleClick, { capture: true })
    }
  }, [callback, ref.current])

  return ref
}

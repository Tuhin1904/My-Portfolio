'use client'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

/**
 * ThemeSync — reads `isDark` from Redux and keeps
 * the `data-theme` attribute on <html> in sync.
 * No UI rendered; purely a side-effect component.
 */
export default function ThemeSync() {
  const isDark = useSelector((state: RootState) => state.theme?.isDark ?? true)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.setAttribute('data-theme', 'dark')
      root.classList.add('dark')
    } else {
      root.setAttribute('data-theme', 'light')
      root.classList.remove('dark')
    }
  }, [isDark])

  return null
}

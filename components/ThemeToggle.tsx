'use client'

import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const context = useContext(ThemeContext)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fallback if context not available (during SSR or before mount)
  if (!context) {
    return (
      <button
        className="p-2 rounded-lg text-adventure-text hover:opacity-70 transition-opacity touch-manipulation"
        aria-label="Toggle theme"
        onClick={() => {
          // Fallback toggle for when context is not available
          if (typeof window !== 'undefined') {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
            document.documentElement.classList.toggle('dark', newTheme === 'dark')
            localStorage.setItem('theme', newTheme)
            // Reload to apply theme properly
            window.location.reload()
          }
        }}
      >
        <Sun className="w-5 h-5" />
      </button>
    )
  }
  
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg text-adventure-text hover:opacity-70 transition-opacity touch-manipulation"
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5" />
      </button>
    )
  }

  const { theme, toggleTheme } = context

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-adventure-text hover:opacity-70 transition-opacity touch-manipulation"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
}


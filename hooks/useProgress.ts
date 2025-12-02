'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import type { UserProgress } from '@/types'

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = () => {
    const user = storage.getCurrentUser()
    if (!user) {
      setProgress(null)
      setLoading(false)
      return
    }

    let userProgress = storage.getProgress()
    if (!userProgress || userProgress.user_id !== user.id) {
      userProgress = storage.initializeProgress(user.id)
    }
    setProgress(userProgress)
    setLoading(false)
  }

  const addXP = (amount: number) => {
    const updated = storage.addXP(amount)
    setProgress(updated)
    return updated
  }

  return {
    progress,
    loading,
    addXP,
    refresh: loadProgress,
  }
}


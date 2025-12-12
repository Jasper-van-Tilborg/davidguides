'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { checkAchievements } from '@/lib/achievements'
import { showLevelUp, showWorldUnlocked } from '@/lib/notifications'
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
    const oldProgress = storage.getProgress()
    const updated = storage.addXP(amount)
    setProgress(updated)
    
    // Check for achievements when level or world changes
    if (oldProgress) {
      const levelChanged = updated.level > oldProgress.level
      const worldChanged = updated.current_world > oldProgress.current_world
      
      // Show notifications for level up and world unlock
      if (levelChanged) {
        showLevelUp(updated.level)
      }
      if (worldChanged) {
        showWorldUnlocked(updated.current_world)
      }
      
      if (levelChanged || worldChanged) {
        setTimeout(() => {
          checkAchievements()
        }, 100)
      }
    }
    
    return updated
  }

  return {
    progress,
    loading,
    addXP,
    refresh: loadProgress,
  }
}


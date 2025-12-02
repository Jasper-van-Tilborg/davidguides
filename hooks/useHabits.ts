'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import type { Habit } from '@/types'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = () => {
    const user = storage.getCurrentUser()
    if (!user) {
      setHabits([])
      setLoading(false)
      return
    }

    const userHabits = storage.getHabits().filter(h => h.user_id === user.id)
    setHabits(userHabits)
    setLoading(false)
  }

  const addHabit = (habitData: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const user = storage.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const newHabit = storage.addHabit({
      ...habitData,
      user_id: user.id,
    })
    loadHabits()
    return newHabit
  }

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    const updated = storage.updateHabit(id, updates)
    if (updated) loadHabits()
    return updated
  }

  const deleteHabit = (id: string) => {
    const deleted = storage.deleteHabit(id)
    if (deleted) loadHabits()
    return deleted
  }

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    refresh: loadHabits,
  }
}


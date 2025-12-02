'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHabits } from '@/hooks/useHabits'
import { useProgress } from '@/hooks/useProgress'
import { storage } from '@/lib/storage'
import { isToday, formatDateShort } from '@/lib/utils'
import type { Habit } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Check, X, Trash2, Edit } from 'lucide-react'

interface HabitCardProps {
  habit: Habit
}

export default function HabitCard({ habit }: HabitCardProps) {
  const { t } = useTranslation()
  const { deleteHabit } = useHabits()
  const { addXP, refresh: refreshProgress } = useProgress()
  const [isCompleting, setIsCompleting] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const todayCheckIn = storage.getCheckIn(habit.id, today)
  const isCompleted = todayCheckIn?.completed || false

  const handleComplete = async () => {
    setIsCompleting(true)
    const user = storage.getCurrentUser()
    if (!user) return

    // Toggle completion
    const newCompleted = !isCompleted
    storage.addCheckIn({
      habit_id: habit.id,
      user_id: user.id,
      date: today,
      completed: newCompleted,
    })

    // Add or remove XP
    if (newCompleted) {
      addXP(habit.xp_reward)
    } else {
      // Remove XP if unchecking (simple approach)
      const progress = storage.getProgress()
      if (progress) {
        progress.xp = Math.max(0, progress.xp - habit.xp_reward)
        progress.total_xp = Math.max(0, progress.total_xp - habit.xp_reward)
        storage.saveProgress(progress)
        refreshProgress()
      }
    }

    setIsCompleting(false)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habit.id)
    }
  }

  // Calculate streak
  const checkIns = storage.getCheckInsForHabit(habit.id)
    .filter(ci => ci.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let streak = 0
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)

  for (let i = 0; i < checkIns.length; i++) {
    const checkInDate = new Date(checkIns[i].date)
    checkInDate.setHours(0, 0, 0, 0)
    const expectedDate = new Date(todayDate)
    expectedDate.setDate(todayDate.getDate() - i)

    if (checkInDate.getTime() === expectedDate.getTime()) {
      streak++
    } else {
      break
    }
  }

  return (
    <Card className="relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{habit.name}</h3>
          {habit.description && (
            <p className="text-gray-400 text-sm mb-2">{habit.description}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="text-adventure-purple font-semibold">
            +{habit.xp_reward} {t('adventure.xp')}
          </div>
          {streak > 0 && (
            <div className="text-adventure-cyan">
              🔥 {streak} {t('habits.days')}
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleComplete}
        disabled={isCompleting}
        variant={isCompleted ? 'secondary' : 'primary'}
        className="w-full"
      >
        {isCompleted ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            {t('habits.completed')}
          </>
        ) : (
          <>
            <X className="w-4 h-4 mr-2" />
            {t('habits.completeHabit')}
          </>
        )}
      </Button>
    </Card>
  )
}


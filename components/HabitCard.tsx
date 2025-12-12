'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHabits } from '@/hooks/useHabits'
import { useProgress } from '@/hooks/useProgress'
import { useAchievements } from '@/hooks/useAchievements'
import { storage } from '@/lib/storage'
import { isToday, formatDateShort } from '@/lib/utils'
import type { Habit } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Check, X, Trash2, Edit } from 'lucide-react'
import { useCalendar } from '@/contexts/CalendarContext'

interface HabitCardProps {
  habit: Habit
}

export default function HabitCard({ habit }: HabitCardProps) {
  const { t } = useTranslation()
  const { deleteHabit } = useHabits()
  const { addXP, refresh: refreshProgress } = useProgress()
  const { checkForNewAchievements } = useAchievements()
  const [isCompleting, setIsCompleting] = useState(false)

  // Try to get selected date from calendar context, fallback to today
  let selectedDate: Date
  try {
    const calendar = useCalendar()
    selectedDate = calendar.selectedDate
  } catch {
    selectedDate = new Date()
  }

  const currentDate = selectedDate.toISOString().split('T')[0]
  const currentCheckIn = storage.getCheckIn(habit.id, currentDate)
  const isCompleted = currentCheckIn?.completed || false

  const handleComplete = async () => {
    setIsCompleting(true)
    const user = storage.getCurrentUser()
    if (!user) return

        // Toggle completion
        const newCompleted = !isCompleted
        storage.addCheckIn({
          habit_id: habit.id,
          user_id: user.id,
          date: currentDate,
          completed: newCompleted,
        })

    // Add or remove XP
    if (newCompleted) {
      addXP(habit.xp_reward)
      // Check for new achievements after completing a habit
      setTimeout(() => {
        checkForNewAchievements()
      }, 100)
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
    <Card className="relative" hover>
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-medium mb-2 break-words text-adventure-text">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-adventure-text-secondary text-sm mb-2 break-words leading-relaxed">
              {habit.description}
            </p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-adventure-text-secondary hover:text-adventure-light transition-opacity p-2 rounded-lg touch-manipulation flex-shrink-0"
          aria-label="Delete habit"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <span className="text-adventure-text">
          +{habit.xp_reward} {t('adventure.xp')}
        </span>
        {streak > 0 && (
          <span className="text-adventure-text">
            {streak} {t('habits.days')}
          </span>
        )}
      </div>

      <Button
        onClick={handleComplete}
        disabled={isCompleting}
        variant={isCompleted ? 'secondary' : 'primary'}
        className="w-full touch-manipulation min-h-[44px]"
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


'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHabits } from '@/hooks/useHabits'
import { storage } from '@/lib/storage'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import type { HabitCheckIn } from '@/types'

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const { t } = useTranslation()
  const { habits } = useHabits()
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get check-ins for the month
  const checkIns = storage.getCheckIns()
  const user = storage.getCurrentUser()
  const userCheckIns = user ? checkIns.filter(ci => ci.user_id === user.id && ci.completed) : []

  // Group check-ins by date
  const checkInsByDate = new Map<string, HabitCheckIn[]>()
  userCheckIns.forEach(ci => {
    if (!checkInsByDate.has(ci.date)) {
      checkInsByDate.set(ci.date, [])
    }
    checkInsByDate.get(ci.date)!.push(ci)
  })

  // Get completed habits count per date
  const completedCountByDate = new Map<string, number>()
  checkInsByDate.forEach((checkIns, date) => {
    const uniqueHabits = new Set(checkIns.map(ci => ci.habit_id))
    completedCountByDate.set(date, uniqueHabits.size)
  })

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(new Date(year, month + (direction === 'next' ? 1 : -1), 1))
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const isSameMonth = (date: Date) => {
    return date.getMonth() === month && date.getFullYear() === year
  }

  // Generate calendar days
  const days: (Date | null)[] = []
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }

  const monthNames = [
    t('calendar.january') || 'January',
    t('calendar.february') || 'February',
    t('calendar.march') || 'March',
    t('calendar.april') || 'April',
    t('calendar.may') || 'May',
    t('calendar.june') || 'June',
    t('calendar.july') || 'July',
    t('calendar.august') || 'August',
    t('calendar.september') || 'September',
    t('calendar.october') || 'October',
    t('calendar.november') || 'November',
    t('calendar.december') || 'December',
  ]

  const dayNames = [
    t('calendar.sun') || 'Sun',
    t('calendar.mon') || 'Mon',
    t('calendar.tue') || 'Tue',
    t('calendar.wed') || 'Wed',
    t('calendar.thu') || 'Thu',
    t('calendar.fri') || 'Fri',
    t('calendar.sat') || 'Sat',
  ]

  return (
    <div className="bg-adventure-dark/50 rounded-lg border border-adventure-main/20 p-4 sm:p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 text-adventure-light/70 hover:text-adventure-light hover:bg-adventure-main/20 rounded-lg transition-colors touch-manipulation"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-adventure-main" />
          <h3 className="text-lg sm:text-xl font-semibold">
            {monthNames[month]} {year}
          </h3>
        </div>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 text-adventure-light/70 hover:text-adventure-light hover:bg-adventure-main/20 rounded-lg transition-colors touch-manipulation"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-semibold text-adventure-light/70 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dateStr = date.toISOString().split('T')[0]
          const completedCount = completedCountByDate.get(dateStr) || 0
          const totalHabits = habits.length
          const hasCompletions = completedCount > 0
          const isAllCompleted = totalHabits > 0 && completedCount === totalHabits

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(date)}
              className={`aspect-square p-1 sm:p-2 rounded-lg transition-all touch-manipulation relative ${
                !isSameMonth(date)
                  ? 'opacity-30'
                  : isSelected(date)
                  ? 'bg-adventure-main text-adventure-light scale-110 z-10 shadow-lg'
                  : isToday(date)
                  ? 'bg-adventure-secondary/20 border-2 border-adventure-secondary'
                  : 'hover:bg-adventure-dark/70'
              }`}
            >
              <div className="text-xs sm:text-sm font-medium">
                {date.getDate()}
              </div>
              
              {/* Completion indicators */}
              {isSameMonth(date) && totalHabits > 0 && (
                <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 justify-center">
                  {hasCompletions && (
                    <div className={`h-1 w-full rounded ${
                      isAllCompleted
                        ? 'bg-adventure-secondary'
                        : 'bg-adventure-main/60'
                    }`} />
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-adventure-main/20 flex flex-wrap gap-4 text-xs sm:text-sm text-adventure-light/70">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-adventure-secondary" />
          <span>{t('calendar.allCompleted') || 'All habits completed'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-adventure-main/60" />
          <span>{t('calendar.someCompleted') || 'Some habits completed'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-adventure-secondary" />
          <span>{t('calendar.today') || 'Today'}</span>
        </div>
      </div>
    </div>
  )
}



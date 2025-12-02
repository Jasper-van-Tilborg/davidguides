'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useHabits } from '@/hooks/useHabits'
import { storage } from '@/lib/storage'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { formatDate, isToday } from '@/lib/utils'
import type { HabitCheckIn } from '@/types'

interface DayCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export default function DayCalendar({ selectedDate, onDateSelect }: DayCalendarProps) {
  const { t } = useTranslation()
  const { habits } = useHabits()
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const user = storage.getCurrentUser()
  const checkIns = user ? storage.getCheckIns().filter(ci => ci.user_id === user.id && ci.completed) : []
  
  // Group check-ins by date
  const checkInsByDate = new Map<string, HabitCheckIn[]>()
  checkIns.forEach(ci => {
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

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      navigateDay(1) // Next day
    } else if (isRightSwipe) {
      navigateDay(-1) // Previous day
    }
  }

  const navigateDay = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    onDateSelect(newDate)
  }

  const goToToday = () => {
    onDateSelect(new Date())
  }

  const dateStr = selectedDate.toISOString().split('T')[0]
  const completedCount = completedCountByDate.get(dateStr) || 0
  const totalHabits = habits.length
  const completionPercentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0

  // Get dates for the week view (3 days before, selected day, 3 days after)
  const getWeekDates = () => {
    const dates: Date[] = []
    for (let i = -3; i <= 3; i++) {
      const date = new Date(selectedDate)
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()

  return (
    <div className="bg-adventure-dark/50 rounded-lg border border-adventure-purple/20 overflow-hidden">
      {/* Main Day View */}
      <div
        ref={containerRef}
        className="relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Selected Date Display */}
        <div className="p-6 sm:p-8 text-center bg-gradient-to-br from-adventure-purple/20 to-adventure-pink/10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CalendarIcon className="w-5 h-5 text-adventure-purple" />
            <span className="text-sm text-gray-400">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            {formatDate(selectedDate)}
          </h2>
          {isToday(selectedDate) && (
            <span className="inline-block px-3 py-1 bg-adventure-cyan/20 text-adventure-cyan rounded-full text-xs sm:text-sm font-semibold mt-2">
              {t('calendar.today') || 'Today'}
            </span>
          )}
          
          {/* Progress for selected day */}
          {totalHabits > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-gray-400">
                  {completedCount} / {totalHabits} {t('habits.completed') || 'completed'}
                </span>
                <span className="text-adventure-purple font-semibold">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-adventure-dark/50 rounded-full h-2 sm:h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-adventure-purple to-adventure-pink transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => navigateDay(-1)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-adventure-dark/80 hover:bg-adventure-dark rounded-full text-white transition-all touch-manipulation z-10 shadow-lg"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <button
          onClick={() => navigateDay(1)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-adventure-dark/80 hover:bg-adventure-dark rounded-full text-white transition-all touch-manipulation z-10 shadow-lg"
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Swipe Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {weekDates.map((date, index) => (
            <div
              key={date.toISOString()}
              className={`h-1.5 rounded-full transition-all ${
                index === 3 // Center (selected day)
                  ? 'w-6 bg-adventure-purple'
                  : 'w-1.5 bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Week View - Compact Date Selector */}
      <div className="p-4 bg-adventure-dark/30 border-t border-adventure-purple/20">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 bg-adventure-purple/20 hover:bg-adventure-purple/30 text-adventure-purple rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation"
          >
            {t('calendar.goToToday') || 'Today'}
          </button>
          <span className="text-xs text-gray-400">
            {t('calendar.swipeToNavigate') || 'Swipe to navigate'}
          </span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {weekDates.map((date) => {
            const dateStr = date.toISOString().split('T')[0]
            const completedCount = completedCountByDate.get(dateStr) || 0
            const totalHabits = habits.length
            const isAllCompleted = totalHabits > 0 && completedCount === totalHabits
            const isSelected = date.toDateString() === selectedDate.toDateString()
            const isTodayDate = isToday(date)

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(date)}
                className={`flex-shrink-0 w-16 sm:w-20 p-3 rounded-lg transition-all touch-manipulation ${
                  isSelected
                    ? 'bg-adventure-purple text-white scale-105 shadow-lg'
                    : isTodayDate
                    ? 'bg-adventure-cyan/20 border-2 border-adventure-cyan'
                    : 'bg-adventure-dark/50 hover:bg-adventure-dark/70'
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg sm:text-xl font-bold mb-1">
                  {date.getDate()}
                </div>
                {totalHabits > 0 && (
                  <div className="flex gap-0.5 justify-center">
                    {isAllCompleted ? (
                      <div className="w-full h-1 bg-adventure-cyan rounded" />
                    ) : completedCount > 0 ? (
                      <div className="w-full h-1 bg-adventure-purple/60 rounded" />
                    ) : (
                      <div className="w-full h-1 bg-gray-700 rounded" />
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}


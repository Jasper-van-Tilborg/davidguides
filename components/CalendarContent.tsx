'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useHabits } from '@/hooks/useHabits'
import { validateLanguage } from '@/app/translations'
import { storage } from '@/lib/storage'
import HabitCard from '@/components/HabitCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AddHabitModal from '@/components/AddHabitModal'
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate, isToday, getDateDisplayText } from '@/lib/utils'
import { useCalendar } from '@/contexts/CalendarContext'
import type { HabitCheckIn } from '@/types'

export default function CalendarContent() {
  const { t } = useTranslation()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { habits } = useHabits()
  const router = useRouter()
  const pathname = usePathname()
  const { selectedDate, setSelectedDate } = useCalendar()
  const [dateCheckIns, setDateCheckIns] = useState<HabitCheckIn[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const lang = pathname.split('/')[1] || 'nl'
  const validLang = validateLanguage(lang)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${validLang}/auth/signin`)
    }
  }, [isAuthenticated, authLoading, router, validLang])

  useEffect(() => {
    loadDateCheckIns()
  }, [selectedDate, habits])

  const loadDateCheckIns = () => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    const user = storage.getCurrentUser()
    if (!user) return

    const allCheckIns = storage.getCheckIns()
    const checkIns = allCheckIns.filter(
      ci => ci.user_id === user.id && ci.date === dateStr
    )
    setDateCheckIns(checkIns)
  }

  // Swipe handlers
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
      navigateDay(1, 'left') // Next day
    } else if (isRightSwipe) {
      navigateDay(-1, 'right') // Previous day
    }
  }

  const navigateDay = (days: number, direction?: 'left' | 'right') => {
    if (isAnimating) return // Prevent multiple animations
    
    setIsAnimating(true)
    
    // Set swipe direction for animation
    if (direction) {
      setSwipeDirection(direction)
    } else {
      // Determine direction based on days
      setSwipeDirection(days > 0 ? 'left' : 'right')
    }
    
    // Small delay to ensure animation starts
    setTimeout(() => {
      const newDate = new Date(selectedDate)
      newDate.setDate(newDate.getDate() + days)
      setSelectedDate(newDate)
      
      // Reset animation after it completes
      setTimeout(() => {
        setIsAnimating(false)
        setSwipeDirection(null)
      }, 300) // Match animation duration
    }, 10)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const dateStr = selectedDate.toISOString().split('T')[0]
  const completedHabitIds = new Set(
    dateCheckIns.filter(ci => ci.completed).map(ci => ci.habit_id)
  )
  const habitsForDate = habits.map(habit => {
    const checkIn = dateCheckIns.find(ci => ci.habit_id === habit.id)
    return {
      habit,
      checkIn,
      isCompleted: checkIn?.completed || false,
    }
  })

  const completedCount = completedHabitIds.size
  const totalCount = habits.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Get check-ins for progress calculation
  const user = storage.getCurrentUser()
  const allCheckIns = user ? storage.getCheckIns().filter(ci => ci.user_id === user.id && ci.completed) : []
  const checkInsByDate = new Map<string, HabitCheckIn[]>()
  allCheckIns.forEach(ci => {
    if (!checkInsByDate.has(ci.date)) {
      checkInsByDate.set(ci.date, [])
    }
    checkInsByDate.get(ci.date)!.push(ci)
  })
  const completedCountForDate = checkInsByDate.get(dateStr)?.length || 0

  // Determine animation class
  const getAnimationClass = () => {
    if (!swipeDirection) return ''
    return swipeDirection === 'left' ? 'animate-slide-left' : 'animate-slide-right'
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen pb-20 overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <main 
        ref={contentRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 ${getAnimationClass()}`}
      >
        {/* Day Header - Minimalist */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-adventure-main rounded-xl p-6 sm:p-8 text-center relative">
            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2">
              <button
                onClick={() => navigateDay(-1, 'right')}
                className="p-2 rounded-lg text-adventure-text hover:opacity-70 transition-opacity"
                aria-label="Previous day"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2">
              <button
                onClick={() => navigateDay(1, 'left')}
                className="p-2 rounded-lg text-adventure-text hover:opacity-70 transition-opacity"
                aria-label="Next day"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Date Display */}
            <div className="mb-2">
              <span className="text-sm text-adventure-text-secondary">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </span>
            </div>
            
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-adventure-text">
                {getDateDisplayText(selectedDate, t)}
              </h1>
            </div>

            {/* Progress for selected day */}
            {totalCount > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-adventure-text-secondary">
                    {completedCount} / {totalCount}
                  </span>
                  <span className="text-adventure-text">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="w-full max-w-md mx-auto rounded-full bg-adventure-dark border border-adventure-border h-1">
                  <div
                    className="h-full rounded-full bg-adventure-text transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Habits for Selected Date */}
        {habitsForDate.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-adventure-text-secondary text-lg mb-4">
                {t('calendar.noHabits') || 'No habits yet. Add some habits to track!'}
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="inline-block px-6 py-3 touch-manipulation min-h-[44px]"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                {t('habits.addHabit')}
              </Button>
            </div>
          </Card>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-medium text-adventure-text">
                {t('calendar.habitsForDate') || 'Habits for this day'}
              </h2>
              <Button
                onClick={() => setShowAddModal(true)}
                variant="secondary"
                className="touch-manipulation min-h-[44px]"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                {t('habits.addHabit')}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {habitsForDate.map(({ habit, isCompleted }) => (
                <div key={habit.id} className="relative">
                  <HabitCard habit={habit} />
                  {isCompleted && (
                    <div className="absolute top-2 right-2 rounded-full bg-adventure-text p-1.5">
                      <svg className="w-4 h-4 text-adventure-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {showAddModal && (
          <AddHabitModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false)
              loadDateCheckIns()
            }}
          />
        )}
      </main>
    </div>
  )
}


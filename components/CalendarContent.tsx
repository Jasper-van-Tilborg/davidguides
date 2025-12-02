'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useHabits } from '@/hooks/useHabits'
import { validateLanguage } from '@/app/translations'
import { storage } from '@/lib/storage'
import DayCalendar from '@/components/DayCalendar'
import HabitCard from '@/components/HabitCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AddHabitModal from '@/components/AddHabitModal'
import { Calendar as CalendarIcon, Plus } from 'lucide-react'
import { formatDate, isToday } from '@/lib/utils'
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

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-adventure-purple" />
          {t('calendar.title') || 'Calendar'}
        </h1>

        {/* Day Calendar Component */}
        <div className="mb-6 sm:mb-8">
          <DayCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>


        {/* Habits for Selected Date */}
        {habitsForDate.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">
                {t('calendar.habitsForDate') || 'Habits for this day'}
              </h3>
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
                    <div className="absolute top-2 right-2 bg-adventure-cyan text-white rounded-full p-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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


'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useHabits } from '@/hooks/useHabits'
import { useProgress } from '@/hooks/useProgress'
import Navigation from '@/components/Navigation'
import HabitCard from '@/components/HabitCard'
import ProgressDisplay from '@/components/ProgressDisplay'
import AddHabitModal from '@/components/AddHabitModal'
import Button from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function DashboardContent() {
  const { t } = useTranslation()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { habits, loading: habitsLoading } = useHabits()
  const { progress } = useProgress()
  const router = useRouter()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || habitsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <ProgressDisplay />
        </div>

        {/* Habits Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('habits.title')}</h2>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('habits.addHabit')}
          </Button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">{t('habits.noHabits')}</p>
            <Button onClick={() => setShowAddModal(true)}>
              {t('habits.addHabit')}
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}

        {showAddModal && (
          <AddHabitModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => setShowAddModal(false)}
          />
        )}
      </main>
    </div>
  )
}


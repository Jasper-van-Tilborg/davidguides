// Global types for the application

export interface Habit {
  id: string
  user_id: string
  name: string
  description?: string
  xp_reward: number
  created_at: string
  updated_at: string
}

export interface HabitCheckIn {
  id: string
  habit_id: string
  user_id: string
  date: string
  completed: boolean
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  level: number
  xp: number
  total_xp: number
  current_world: number
  updated_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon?: string
  xp_reward: number
  requirement: number
  type: 'streak' | 'total_completions' | 'level' | 'world' | 'custom'
  category?: 'habits' | 'progress' | 'streaks' | 'special'
}

export interface UserAchievement {
  id: string
  achievement_id: string
  user_id: string
  unlocked_at: string
  progress?: number // Current progress towards requirement
}

export interface HabitTemplate {
  id: string
  name: string
  description?: string
  xp_reward: number
  icon?: string
  category?: string
  is_default?: boolean
  created_at: string
  updated_at: string
}


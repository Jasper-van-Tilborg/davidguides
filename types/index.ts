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
  type: 'streak' | 'total_completions' | 'level' | 'custom'
}


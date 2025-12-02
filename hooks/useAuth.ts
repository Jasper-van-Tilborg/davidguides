'use client'

import { useState, useEffect } from 'react'
import { auth, storage, type User } from '@/lib/storage'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const currentUser = auth.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const signIn = (email: string, password: string) => {
    const user = auth.signIn(email, password)
    setUser(user)
    return user
  }

  const signUp = (email: string, password: string, name?: string) => {
    const user = auth.signUp(email, password, name)
    setUser(user)
    return user
  }

  const signOut = () => {
    auth.signOut()
    setUser(null)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  }
}


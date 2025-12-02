'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CalendarContextType {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <CalendarContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}


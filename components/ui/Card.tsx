'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-adventure-dark/50 rounded-lg border border-adventure-purple/20 p-6 ${className}`}>
      {children}
    </div>
  )
}


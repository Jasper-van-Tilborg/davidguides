'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`
      bg-adventure-main 
      border border-adventure-border 
      rounded-xl
      p-6 
      transition-opacity duration-200
      ${hover ? 'hover:border-adventure-text/50' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}



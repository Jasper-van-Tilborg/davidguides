'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2.5 sm:py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation'
  
  const variants = {
    primary: 'bg-adventure-purple hover:bg-adventure-purple/80 active:bg-adventure-purple/70 text-white',
    secondary: 'bg-adventure-cyan hover:bg-adventure-cyan/80 active:bg-adventure-cyan/70 text-white',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}


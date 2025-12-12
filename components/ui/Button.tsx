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
  const baseStyles = `
    px-6 py-3 
    rounded-lg
    font-medium 
    transition-opacity duration-200 
    disabled:opacity-30 disabled:cursor-not-allowed 
    touch-manipulation
    focus:outline-none focus:ring-1 focus:ring-adventure-text
  `
  
  const variants = {
    primary: `
      bg-adventure-text 
      text-adventure-dark
      hover:opacity-80
    `,
    secondary: `
      bg-adventure-main 
      border border-adventure-text
      text-adventure-text
      hover:bg-adventure-text hover:text-adventure-dark
    `,
    danger: `
      bg-adventure-main 
      border border-red-500
      text-red-500
      hover:bg-red-500 hover:text-adventure-light
    `,
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


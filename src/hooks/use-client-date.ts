'use client'

import { useState, useEffect } from 'react'

export function useClientDate() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

export function formatTimeAgoSafe(date: Date): string {
  // Return a static string during SSR to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return 'recently'
  }
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }
  
  return date.toLocaleDateString()
}

export function formatDateSafe(date: Date | string): string {
  // Use consistent ISO format during SSR to avoid hydration mismatch
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (typeof window === 'undefined') {
    // Return consistent ISO date format during SSR
    return dateObj.toISOString().split('T')[0]
  }
  
  // Use toLocaleDateString on client side
  try {
    return dateObj.toLocaleDateString()
  } catch (error) {
    // Fallback to ISO format
    return dateObj.toISOString().split('T')[0]
  }
}

export function formatCurrencySafe(amount: number, currency = 'USD'): string {
  // Use consistent manual formatting during SSR to avoid hydration mismatch
  if (typeof window === 'undefined') {
    const formatted = amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `$${formatted}`
  }
  
  // Use Intl.NumberFormat on client side
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch (error) {
    // Fallback to manual formatting
    const formatted = amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `$${formatted}`
  }
}
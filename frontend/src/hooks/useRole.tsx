import { useState, useEffect } from 'react'
import { localStorageKeys } from '../lib/constants'

export function useRole() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkRole = () => {
      const apiKey = localStorage.getItem(localStorageKeys.apiKey)
      const role = localStorage.getItem(localStorageKeys.role)

      setIsLoggedIn(!!apiKey)
      setIsAdmin(role === 'admin')
    }

    checkRole()

    // Listen for storage changes (in case of multi-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === localStorageKeys.apiKey || e.key === localStorageKeys.role) {
        checkRole()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return { isAdmin, isLoggedIn }
}
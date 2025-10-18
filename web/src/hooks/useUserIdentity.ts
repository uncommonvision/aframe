import { useState, useEffect } from 'react'
import { userIdentityService } from '@/services/userIdentity'
import type { User } from '@/types'

interface UseUserIdentityReturn {
  user: User | null
  setUser: (name: string) => User
  clearUser: () => void
}

export function useUserIdentity(): UseUserIdentityReturn {
  const [user, setUserState] = useState<User | null>(userIdentityService.getUserIdentity())

  useEffect(() => {
    const unsubscribe = userIdentityService.onUserChange((newUser) => {
      setUserState(newUser)
    })

    return unsubscribe
  }, [])

  const setUser = (name: string): User => {
    return userIdentityService.setUserIdentity(name)
  }

  const clearUser = (): void => {
    userIdentityService.clearUserIdentity()
  }

  return {
    user,
    setUser,
    clearUser
  }
}

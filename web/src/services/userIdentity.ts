import { v4 as uuidv4 } from 'uuid'
import type { User } from '@/types'

type UserChangeHandler = (user: User | null) => void

function createUserIdentityService() {
  let currentUser: User | null = null
  const userChangeHandlers = new Set<UserChangeHandler>()

  const notifyUserChange = (user: User | null) => {
    userChangeHandlers.forEach(handler => {
      try {
        handler(user)
      } catch (error) {
        console.error('Error in user change handler:', error)
      }
    })
  }

  const getUserIdentity = (): User | null => {
    return currentUser
  }

  const setUserIdentity = (name: string): User => {
    const user: User = {
      id: uuidv4(),
      name: name.trim()
    }
    currentUser = user
    notifyUserChange(user)
    return user
  }

  const clearUserIdentity = (): void => {
    currentUser = null
    notifyUserChange(null)
  }

  const onUserChange = (handler: UserChangeHandler): (() => void) => {
    userChangeHandlers.add(handler)
    return () => {
      userChangeHandlers.delete(handler)
    }
  }

  return {
    getUserIdentity,
    setUserIdentity,
    clearUserIdentity,
    onUserChange
  }
}

export const userIdentityService = createUserIdentityService()

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  verifyBeforeUpdateEmail,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      async createAccount(email, password) {
        await createUserWithEmailAndPassword(auth, email, password)
      },
      async login(email, password) {
        await signInWithEmailAndPassword(auth, email, password)
      },
      async logout() {
        await signOut(auth)
      },
      async changeEmail(currentPassword, newEmail) {
        if (!auth.currentUser?.email) throw new Error('You must be signed in.')
        const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
        await reauthenticateWithCredential(auth.currentUser, cred)
        await verifyBeforeUpdateEmail(auth.currentUser, newEmail)
      },
      async changePassword(currentPassword, newPassword) {
        if (!auth.currentUser?.email) throw new Error('You must be signed in.')
        const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
        await reauthenticateWithCredential(auth.currentUser, cred)
        await updatePassword(auth.currentUser, newPassword)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

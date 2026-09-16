import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthScreen, SetupScreen } from './components/AuthScreens'
import { Dashboard } from './components/Dashboard'
import { isFirebaseConfigured } from './firebase'

function Gate() {
  const { user, loading, configured } = useAuth()

  if (!configured || !isFirebaseConfigured) return <SetupScreen />
  if (loading) {
    return (
      <div className="splash">
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    )
  }
  if (user) return <Dashboard />
  return <AuthScreen />
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}

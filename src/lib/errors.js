export function isOfflineError(err) {
  const message = String(err?.message || '').toLowerCase()
  const code = String(err?.code || '')
  return (
    code === 'unavailable' ||
    message.includes('client is offline') ||
    message.includes('failed to get document') ||
    message.includes('network-request-failed')
  )
}

export function formatAuthError(err) {
  if (isOfflineError(err)) {
    return 'Cannot reach Firestore. Create a Firestore database in this Firebase project, publish firestore.rules, then try again.'
  }

  const code = err?.code || ''
  const map = {
    'auth/email-already-in-use': 'That email is already in use.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/wrong-password': 'Email or password is incorrect.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/requires-recent-login': 'Please enter your current password again.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/operation-not-allowed': 'Email/password sign-in is not enabled in Firebase.',
    'permission-denied': 'Firestore blocked this request. Publish the rules from firestore.rules.',
  }
  return map[code] || err?.message || 'Something went wrong.'
}

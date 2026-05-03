import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ id: 1, full_name: 'Admin K3' })
  const [loading, setLoading] = useState(false)

  const value = {
    user,
    login: async () => ({ success: true }),
    logout: () => {},
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

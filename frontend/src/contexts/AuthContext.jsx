import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest, getProfile }  from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
	const [ user, setUser ] = useState(null)
	const [ token, setToken ] = useState(localStorage.getItem('token') || null)
	const [ loading, setLoading ] = useState(true)

	useEffect(() => {
		async function loadProfile() {
			if (token) {
				try {
					const data = await getProfile()
					setUser(data)
				} catch (error) {
					console.error('Token inválido ou expirado:', error)
					logout()
				}
			}
			setLoading(false)
		}
		loadProfile()
	}, [token])

	async function login(email, password) {
		try {
			const data = await loginRequest(email, password)
			setToken(data.token)
			localStorage.setItem('token', data.token)
			setUser(data.user)
			return {
				success: true
			}
		} catch (error) {
			const message = error.response?.data?.message || 'Credenciais inválidas ou erro de rede.'
      return { success: false, message }			
		}
	}

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
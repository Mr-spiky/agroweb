"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("agrowebUser")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = (email, password) => {
    // This is a mock login function
    // In a real app, you would make an API call to authenticate
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock user data based on email
        if (email && password) {
          const isFarmer = email.includes("farmer")
          const user = {
            id: Math.random().toString(36).substr(2, 9),
            name: isFarmer ? "Rajesh Patel" : "Amit Kumar",
            email,
            role: isFarmer ? "farmer" : "buyer",
            avatar: `https://ui-avatars.com/api/?name=${isFarmer ? "Rajesh+Patel" : "Amit+Kumar"}&background=059669&color=fff`,
          }

          setCurrentUser(user)
          localStorage.setItem("agrowebUser", JSON.stringify(user))
          resolve(user)
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  }

  // Register function
  const register = (name, email, password, role) => {
    // This is a mock register function
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password && role) {
          const user = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            role,
            avatar: `https://ui-avatars.com/api/?name=${name.replace(" ", "+")}&background=random`,
          }

          setCurrentUser(user)
          localStorage.setItem("agrowebUser", JSON.stringify(user))
          resolve(user)
        } else {
          reject(new Error("Please fill all required fields"))
        }
      }, 1000)
    })
  }

  // Logout function
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("agrowebUser")
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

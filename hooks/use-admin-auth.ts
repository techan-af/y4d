"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface AdminUser {
  username: string
  role: string
}

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/verify", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAdmin(data.admin)
        setIsAuthenticated(true)
      } else {
        setAdmin(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Admin auth check failed:", error)
      setAdmin(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setAdmin(data.admin)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setAdmin(null)
      setIsAuthenticated(false)
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAdminAuth,
  }
}

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getAdminSession, signOutAdmin } from "@/lib/supabase"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const { success, session, error } = await getAdminSession()

        // If there's a Supabase configuration error
        if (error?.message?.includes("Supabase URL and Anon Key are required")) {
          setError("Supabase configuration missing")
          setLoading(false)
          return
        }

        // If not authenticated, redirect to login
        if (!success || !session) {
          router.push("/admin/login")
          return
        }

        setAuthenticated(true)
        setLoading(false)
      } catch (err: any) {
        console.error("Error in admin layout:", err)
        setError("Failed to check authentication")
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault()
    await signOutAdmin()
    router.push("/admin/login")
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-peach-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state for Supabase configuration issues
  if (error === "Supabase configuration missing") {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Supabase Configuration Missing</h1>
          <p className="mb-4 text-gray-700">
            The admin dashboard requires Supabase environment variables to be configured:
          </p>
          <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-1">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          </ul>
          <p className="mb-6 text-gray-700">
            Please add these environment variables to your project and restart the application.
          </p>
          <Link
            href="/"
            className="block w-full text-center bg-peach-500 hover:bg-peach-600 text-white py-2 px-4 rounded transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  // Show generic error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Dashboard Error</h1>
          <p className="mb-6 text-gray-700">
            There was an error loading the admin dashboard. Please check your configuration and try again.
          </p>
          <Link
            href="/"
            className="block w-full text-center bg-peach-500 hover:bg-peach-600 text-white py-2 px-4 rounded transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  // Show authenticated layout
  if (authenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-peach-600">PixelNextDigital Admin</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/admin" className="text-gray-600 hover:text-peach-500">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/orders" className="text-gray-600 hover:text-peach-500">
                    Orders
                  </Link>
                </li>
                <li>
                  <button onClick={handleSignOut} className="text-gray-600 hover:text-peach-500">
                    Sign Out
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    )
  }

  // Default fallback (should not reach here due to redirects)
  return null
}

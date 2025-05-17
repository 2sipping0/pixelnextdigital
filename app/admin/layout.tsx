import type React from "react"
import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/supabase"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    // Check if user is authenticated
    const { success, session } = await getAdminSession()

    if (!success || !session) {
      redirect("/admin/login")
    }

    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-peach-600">PixelNextDigital Admin</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="/admin" className="text-gray-600 hover:text-peach-500">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/admin/orders" className="text-gray-600 hover:text-peach-500">
                    Orders
                  </a>
                </li>
                <li>
                  <form action="/api/auth/signout" method="post">
                    <button type="submit" className="text-gray-600 hover:text-peach-500">
                      Sign Out
                    </button>
                  </form>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    )
  } catch (error) {
    // If there's an error with Supabase initialization, redirect to login
    console.error("Error in admin layout:", error)
    redirect("/admin/login")
  }
}

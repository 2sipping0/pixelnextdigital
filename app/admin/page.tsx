"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getOrders } from "@/lib/supabase"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<any[] | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { success, data, error } = await getOrders()

        if (error?.message?.includes("Supabase URL and Anon Key are required")) {
          setError("Supabase configuration missing")
          setLoading(false)
          return
        }

        if (!success) {
          setError("Failed to load orders")
          setLoading(false)
          return
        }

        setOrders(data || [])
        setLoading(false)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("An error occurred while loading orders")
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-peach-500"></div>
          <span className="ml-2">Loading orders...</span>
        </div>
      </div>
    )
  }

  // Show error state for Supabase configuration issues
  if (error === "Supabase configuration missing") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            Supabase configuration is missing. Please add the required environment variables.
          </p>
        </div>
        <p>The admin dashboard requires Supabase to be properly configured. Please check your environment variables.</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0
  const paidOrders = orders?.filter((order) => order.status === "paid").length || 0
  const totalRevenue =
    orders
      ?.filter((order) => order.status === "paid")
      .reduce((sum, order) => {
        const amount = order.total_amount.replace(/[^0-9.]/g, "")
        return sum + Number.parseFloat(amount || "0")
      }, 0) || 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">Total Orders</h2>
          <p className="text-3xl font-bold text-gray-800">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">Pending Orders</h2>
          <p className="text-3xl font-bold text-yellow-500">{pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">Completed Orders</h2>
          <p className="text-3xl font-bold text-green-500">{paidOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">Total Revenue</h2>
          <p className="text-3xl font-bold text-peach-600">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.business_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.selected_plan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/admin/orders/${order.order_id}`} className="text-peach-600 hover:text-peach-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t">
          <Link href="/admin/orders" className="text-peach-600 hover:text-peach-900">
            View all orders
          </Link>
        </div>
      </div>
    </div>
  )
}

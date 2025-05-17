"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getOrderById } from "@/lib/supabase"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<any | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      if (!params.id) {
        router.push("/admin/orders")
        return
      }

      try {
        const { success, data, error } = await getOrderById(params.id as string)

        if (error?.message?.includes("Supabase URL and Anon Key are required")) {
          setError("Supabase configuration missing")
          setLoading(false)
          return
        }

        if (!success || !data) {
          setError("Order not found")
          setLoading(false)
          return
        }

        setOrder(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("An error occurred while loading the order")
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, router])

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-peach-500"></div>
          <span className="ml-2">Loading order details...</span>
        </div>
      </div>
    )
  }

  // Show error state for Supabase configuration issues
  if (error === "Supabase configuration missing") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            Supabase configuration is missing. Please add the required environment variables.
          </p>
        </div>
        <Link href="/admin/orders" className="text-peach-600 hover:text-peach-900">
          Back to Orders
        </Link>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
        <Link href="/admin/orders" className="text-peach-600 hover:text-peach-900">
          Back to Orders
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <p className="text-gray-600 mb-4">Order not found</p>
        <Link href="/admin/orders" className="text-peach-600 hover:text-peach-900">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Order Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Order ID</p>
              <p className="mt-1 text-sm text-gray-900">{order.order_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="mt-1 text-sm text-gray-900">{new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="mt-1">
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
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Method</p>
              <p className="mt-1 text-sm text-gray-900">{order.payment_method}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Selected Plan</p>
              <p className="mt-1 text-sm text-gray-900">{order.selected_plan}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="mt-1 text-sm font-bold text-peach-600">{order.total_amount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Customer Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Business Name</p>
              <p className="mt-1 text-sm text-gray-900">{order.business_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-sm text-gray-900">{order.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="mt-1 text-sm text-gray-900">{order.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Social Media</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Facebook</p>
              <p className="mt-1 text-sm text-gray-900">{order.social_media?.facebook || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Instagram</p>
              <p className="mt-1 text-sm text-gray-900">{order.social_media?.instagram || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Twitter</p>
              <p className="mt-1 text-sm text-gray-900">{order.social_media?.twitter || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Website Details</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-900 whitespace-pre-line">{order.website_details}</p>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin/orders" className="text-peach-600 hover:text-peach-900">
          Back to Orders
        </Link>
      </div>
    </div>
  )
}

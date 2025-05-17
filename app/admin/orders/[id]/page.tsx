import { getOrderById } from "@/lib/supabase"
import { notFound } from "next/navigation"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const { success, data: order } = await getOrderById(params.id)

  if (!success || !order) {
    notFound()
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
    </div>
  )
}

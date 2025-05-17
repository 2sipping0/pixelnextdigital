import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if the required environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and Anon Key are required. Please check your environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
}

// Use the client getter in all functions
export async function saveOrderToDatabase(orderData: any) {
  try {
    const supabase = getSupabaseClient()

    // First, insert the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderData.orderId,
        business_name: orderData.businessName,
        email: orderData.email,
        phone: orderData.phone,
        website_details: orderData.websiteDetails,
        selected_plan: orderData.selectedPlan,
        payment_method: orderData.paymentMethod,
        order_date: orderData.orderDate,
        total_amount: orderData.totalAmount,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Then, insert social media details
    if (order) {
      const { error: socialError } = await supabase.from("social_media").insert({
        order_id: order.id,
        facebook: orderData.socialMedia.facebook,
        instagram: orderData.socialMedia.instagram,
        twitter: orderData.socialMedia.twitter,
      })

      if (socialError) throw socialError
    }

    return { success: true, order }
  } catch (error) {
    console.error("Error saving order to Supabase:", error)
    return { success: false, error }
  }
}

export async function getOrders() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        social_media (*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return { success: false, error }
  }
}

export async function getOrderById(id: string) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        social_media (*)
      `)
      .eq("order_id", id)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching order:", error)
    return { success: false, error }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("orders").update({ status }).eq("order_id", orderId).select().single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, error }
  }
}

// Payment-related functions
export async function savePaymentDetails(paymentData: any) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("payments")
      .insert({
        order_id: paymentData.orderId,
        payment_method: paymentData.paymentMethod,
        payment_id: paymentData.paymentId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentData.status,
        metadata: paymentData.metadata,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error saving payment details:", error)
    return { success: false, error }
  }
}

// Admin authentication
export async function signInAdmin(email: string, password: string) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error signing in:", error)
    return { success: false, error }
  }
}

export async function signOutAdmin() {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error signing out:", error)
    return { success: false, error }
  }
}

export async function getAdminSession() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return { success: true, session: data.session }
  } catch (error) {
    console.error("Error getting session:", error)
    return { success: false, error }
  }
}

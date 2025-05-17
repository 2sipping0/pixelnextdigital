import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json()

    // Validate the request
    if (!amount || !orderId) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 })
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        orderId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ message: error.message || "Failed to create payment intent" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import Stripe from "stripe"
import { updateOrderStatus, savePaymentDetails } from "@/lib/supabase"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const payload = await request.text()
  const sig = request.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`)

      // Update order status
      if (paymentIntent.metadata.orderId) {
        await updateOrderStatus(paymentIntent.metadata.orderId, "paid")

        // Update payment details
        await savePaymentDetails({
          orderId: paymentIntent.metadata.orderId,
          paymentMethod: "stripe",
          paymentId: paymentIntent.id,
          amount: (paymentIntent.amount / 100).toFixed(2),
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          metadata: {
            paymentIntentId: paymentIntent.id,
            paymentMethodId: paymentIntent.payment_method,
          },
        })
      }
      break

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`Payment failed: ${failedPaymentIntent.id}`)

      // Update order status
      if (failedPaymentIntent.metadata.orderId) {
        await updateOrderStatus(failedPaymentIntent.metadata.orderId, "payment_failed")
      }
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

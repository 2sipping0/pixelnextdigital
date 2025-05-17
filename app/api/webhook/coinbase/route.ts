import { NextResponse } from "next/server"
import crypto from "crypto"
import { updateOrderStatus, savePaymentDetails } from "@/lib/supabase"

// Coinbase webhook secret
const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const payload = await request.text()
    const signature = request.headers.get("x-cc-webhook-signature") as string

    // Verify the signature
    const hmac = crypto.createHmac("sha256", webhookSecret)
    hmac.update(payload)
    const computedSignature = hmac.digest("hex")

    if (computedSignature !== signature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(payload)

    // Handle the event
    switch (event.type) {
      case "charge:confirmed":
        console.log("Charge confirmed:", event.data.id)

        // Update order status
        if (event.data.metadata.orderId) {
          await updateOrderStatus(event.data.metadata.orderId, "paid")

          // Update payment details
          await savePaymentDetails({
            orderId: event.data.metadata.orderId,
            paymentMethod: "crypto",
            paymentId: event.data.id,
            amount: event.data.pricing.local.amount,
            currency: event.data.pricing.local.currency,
            status: "confirmed",
            metadata: {
              chargeId: event.data.id,
              confirmedAt: new Date().toISOString(),
            },
          })
        }
        break

      case "charge:failed":
        console.log("Charge failed:", event.data.id)

        // Update order status
        if (event.data.metadata.orderId) {
          await updateOrderStatus(event.data.metadata.orderId, "payment_failed")
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ message: error.message || "Webhook processing failed" }, { status: 500 })
  }
}

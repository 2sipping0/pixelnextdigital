import type { Stripe, StripeElements, StripeCardElement } from "@stripe/stripe-js"
import { savePaymentDetails } from "./supabase"

// Stripe payment processing
export async function processStripePayment(
  stripe: Stripe | null,
  elements: StripeElements,
  cardElement: StripeCardElement,
  orderDetails: any,
) {
  try {
    if (!stripe) throw new Error("Stripe has not loaded yet")

    // Create payment intent on the server
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: getAmountInCents(orderDetails.selectedPlan),
        orderId: orderDetails.orderId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create payment intent")
    }

    const { clientSecret } = await response.json()

    // Confirm the payment with the card element
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: orderDetails.businessName,
          email: orderDetails.email,
          phone: orderDetails.phone,
        },
      },
    })

    if (result.error) {
      throw new Error(result.error.message || "Payment failed")
    }

    if (result.paymentIntent?.status === "succeeded") {
      // Save payment details to database
      await savePaymentDetails({
        orderId: orderDetails.orderId,
        paymentMethod: "stripe",
        paymentId: result.paymentIntent.id,
        amount: (result.paymentIntent.amount / 100).toFixed(2),
        currency: result.paymentIntent.currency,
        status: result.paymentIntent.status,
        metadata: {
          paymentIntentId: result.paymentIntent.id,
          paymentMethodId: result.paymentIntent.payment_method,
        },
      })

      return {
        success: true,
        paymentId: result.paymentIntent.id,
      }
    } else {
      throw new Error("Payment processing failed")
    }
  } catch (error: any) {
    console.error("Stripe payment error:", error)
    return {
      success: false,
      error: error.message || "Payment processing failed",
    }
  }
}

// Coinbase Commerce payment processing
export async function processCryptoPayment(orderDetails: any) {
  try {
    // Create a charge on the server
    const response = await fetch("/api/create-crypto-charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${orderDetails.selectedPlan} Website Package`,
        description: `Website development services for ${orderDetails.businessName}`,
        amount: getAmountInUSD(orderDetails.selectedPlan),
        orderId: orderDetails.orderId,
        customerEmail: orderDetails.email,
        customerName: orderDetails.businessName,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create crypto charge")
    }

    const { chargeData } = await response.json()

    // Save initial payment record
    await savePaymentDetails({
      orderId: orderDetails.orderId,
      paymentMethod: "crypto",
      paymentId: chargeData.id,
      amount: chargeData.pricing.local.amount,
      currency: chargeData.pricing.local.currency,
      status: "pending",
      metadata: {
        chargeId: chargeData.id,
        hostedUrl: chargeData.hosted_url,
        expiresAt: chargeData.expires_at,
      },
    })

    // Return the hosted URL for the customer to complete payment
    return {
      success: true,
      chargeId: chargeData.id,
      hostedUrl: chargeData.hosted_url,
    }
  } catch (error: any) {
    console.error("Crypto payment error:", error)
    return {
      success: false,
      error: error.message || "Crypto payment processing failed",
    }
  }
}

// Helper function to get amount in cents for Stripe
function getAmountInCents(plan: string): number {
  switch (plan) {
    case "Basic":
      return 30000 // $300.00
    case "Professional":
      return 90000 // $900.00
    case "E-commerce":
      return 270000 // $2,700.00
    default:
      return 0
  }
}

// Helper function to get amount in USD for Coinbase
function getAmountInUSD(plan: string): string {
  switch (plan) {
    case "Basic":
      return "300.00"
    case "Professional":
      return "900.00"
    case "E-commerce":
      return "2700.00"
    default:
      return "0.00"
  }
}

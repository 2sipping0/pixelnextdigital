"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { processStripePayment } from "@/lib/payment"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Load Stripe outside of component to avoid recreating it on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentFormProps {
  orderDetails: any
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
}

// Wrapper component to provide Stripe context
export function StripePaymentWrapper(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm {...props} />
    </Elements>
  )
}

// The actual form component
function StripePaymentForm({ orderDetails, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handlePayment = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError("Card element not found")
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Pass the stripe instance to ensure we use the same instance
      const result = await processStripePayment(stripe, elements, cardElement, orderDetails)

      if (result.success) {
        onSuccess(result.paymentId!)
      } else {
        setError(result.error || "Payment processing failed")
        onError(result.error || "Payment processing failed")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
      onError(err.message || "An error occurred")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || processing}
        className="w-full bg-peach-500 hover:bg-peach-600 text-white"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${orderDetails.totalAmount}`
        )}
      </Button>
    </div>
  )
}

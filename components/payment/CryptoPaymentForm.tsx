"use client"

import { useState } from "react"
import { processCryptoPayment } from "@/lib/payment"
import { Button } from "@/components/ui/button"
import { Loader2, Shield } from "lucide-react"

interface CryptoPaymentFormProps {
  orderDetails: any
  onSuccess: (chargeId: string, hostedUrl: string) => void
  onError: (error: string) => void
}

export function CryptoPaymentForm({ orderDetails, onSuccess, onError }: CryptoPaymentFormProps) {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setProcessing(true)
    setError(null)

    try {
      const result = await processCryptoPayment(orderDetails)

      if (result.success) {
        onSuccess(result.chargeId!, result.hostedUrl!)
      } else {
        setError(result.error || "Crypto payment processing failed")
        onError(result.error || "Crypto payment processing failed")
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
      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-green-600">More Secured Payment Option</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Pay with cryptocurrency for enhanced security and privacy. We accept:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
          <li>Bitcoin (BTC)</li>
          <li>Ethereum (ETH)</li>
          <li>USD Coin (USDC)</li>
          <li>And many more...</li>
        </ul>
        <p className="text-sm text-gray-600">
          You'll be redirected to Coinbase Commerce to complete your payment securely.
        </p>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button
        type="button"
        onClick={handlePayment}
        disabled={processing}
        className="w-full bg-peach-500 hover:bg-peach-600 text-white"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${orderDetails.totalAmount} with Crypto`
        )}
      </Button>
    </div>
  )
}

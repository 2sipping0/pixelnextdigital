import { NextResponse } from "next/server"
import { Client, resources } from "coinbase-commerce-node"

// Initialize Coinbase Commerce client
Client.init(process.env.COINBASE_COMMERCE_API_KEY!)
const { Charge } = resources

export async function POST(request: Request) {
  try {
    const { name, description, amount, orderId, customerEmail, customerName } = await request.json()

    // Validate the request
    if (!name || !description || !amount || !orderId) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 })
    }

    // Create a charge
    const chargeData = await Charge.create({
      name,
      description,
      local_price: {
        amount,
        currency: "USD",
      },
      pricing_type: "fixed_price",
      metadata: {
        orderId,
        customerEmail,
        customerName,
      },
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?orderId=${orderId}`,
    })

    return NextResponse.json({ chargeData })
  } catch (error: any) {
    console.error("Error creating crypto charge:", error)
    return NextResponse.json({ message: error.message || "Failed to create crypto charge" }, { status: 500 })
  }
}

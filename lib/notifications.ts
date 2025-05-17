// This file handles sending notifications to administrators

import { Resend } from "resend"
import type { OrderDetails } from "@/app/actions/send-confirmation-email"

// Initialize Resend with proper error handling for the API key
const getResendClient = () => {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error("RESEND_API_KEY environment variable is not set")
    return null
  }

  return new Resend(resendApiKey)
}

// List of admin email addresses to notify
const ADMIN_EMAILS = ["info@pixelnextdigital.com"]

/**
 * Send notification to administrators about a new order
 *
 * This function sends an email notification to all administrators
 * when a new order is placed. It includes all relevant order details.
 */
export async function sendAdminNotification(orderDetails: OrderDetails): Promise<void> {
  try {
    const resend = getResendClient()

    if (!resend) {
      console.error("Failed to initialize Resend client - missing API key")
      return Promise.resolve() // Resolve without sending to prevent disrupting the main flow
    }

    const { businessName, email, phone, selectedPlan, orderId, orderDate, totalAmount } = orderDetails

    // Create HTML content for admin notification
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px 5px 0 0; border-bottom: 3px solid #ff6b43; text-align: center;">
          <h1 style="color: #ff6b43; font-size: 24px; margin: 0;">🔔 New Order Alert</h1>
        </div>
        
        <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 5px 5px;">
          <p style="font-size: 16px; line-height: 1.5; margin: 16px 0;">
            A new order has been placed on the website. Here are the details:
          </p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="font-size: 18px; color: #ff6b43; margin-top: 0; margin-bottom: 15px;">Order Information</h2>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold;">Order ID:</span>
              <span style="color: #555;">${orderId}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold;">Date:</span>
              <span style="color: #555;">${orderDate}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold;">Package:</span>
              <span style="color: #555;">${selectedPlan} Website Package</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold;">Total Amount:</span>
              <span style="color: #555; font-weight: bold;">${totalAmount}</span>
            </div>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="font-size: 18px; color: #ff6b43; margin-top: 0; margin-bottom: 15px;">Customer Information</h2>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold;">Business Name:</span>
              <span style="color: #555;">${businessName}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold;">Email:</span>
              <span style="color: #555;">${email}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold;">Phone:</span>
              <span style="color: #555;">${phone}</span>
            </div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5; margin: 16px 0;">
            Please contact the customer within 24 hours to discuss their project requirements.
          </p>
          
          <a href="https://admin.pixelnextdigital.com/orders/${orderId}" style="display: inline-block; background-color: #ff6b43; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            View Order Details
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #888; margin: 5px 0;">© ${new Date().getFullYear()} PixelNextDigital. All rights reserved.</p>
        </div>
      </div>
    `

    // Send notification to all administrators
    for (const adminEmail of ADMIN_EMAILS) {
      await resend.emails.send({
        from: "PixelNextDigital <support@pixelnextdigital.com>",
        to: [adminEmail],
        subject: `New Order Alert - ${selectedPlan} Package - ${orderId}`,
        html: htmlContent,
      })
    }

    // You could also implement other notification methods here:
    // - SMS notifications using Twilio
    // - Push notifications
    // - Slack/Discord webhooks

    console.log("Admin notification sent successfully")
    return Promise.resolve()
  } catch (error) {
    console.error("Error sending admin notification:", error)
    // Don't throw the error to prevent disrupting the main order flow
    return Promise.resolve()
  }
}

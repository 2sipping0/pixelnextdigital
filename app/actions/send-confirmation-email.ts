"use server"

import { Resend } from "resend"
import { saveOrderToDatabase } from "@/lib/supabase"
import { sendAdminNotification } from "@/lib/notifications"

// Initialize Resend with proper error handling for the API key
const getResendClient = () => {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error("RESEND_API_KEY environment variable is not set")
    return null
  }

  return new Resend(resendApiKey)
}

export type OrderDetails = {
  businessName: string
  email: string
  phone: string
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
  }
  websiteDetails: string
  selectedPlan: string
  paymentMethod: string
  orderId: string
  orderDate: string
  totalAmount: string
}

export async function sendConfirmationEmail(orderDetails: OrderDetails) {
  try {
    const resend = getResendClient()

    if (!resend) {
      console.error("Failed to initialize Resend client - missing API key")
      return { success: false, error: "Email service configuration error" }
    }

    const { email, businessName, orderId, orderDate, selectedPlan, paymentMethod, totalAmount } = orderDetails

    // 4. Store order data in database
    try {
      await saveOrderToDatabase(orderDetails)
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Continue with email sending even if database save fails
    }

    // 5. Send notification to administrators about the new order
    try {
      await sendAdminNotification(orderDetails)
    } catch (notifyError) {
      console.error("Admin notification error:", notifyError)
      // Continue with customer email even if admin notification fails
    }

    // Create a simple HTML email instead of using React components
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: #fff7f5; padding: 20px; border-radius: 5px 5px 0 0; border-bottom: 3px solid #ff6b43; text-align: center;">
          <h1 style="color: #ff6b43; font-size: 24px; margin: 0;">Order Confirmation</h1>
        </div>
        
        <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 5px 5px;">
          <p style="font-size: 16px; line-height: 1.5; margin: 16px 0;">Dear ${businessName},</p>
          
          <p style="font-size: 16px; line-height: 1.5; margin: 16px 0;">
            Thank you for your order! We're excited to help you build your new website. Below are the details of your purchase:
          </p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="font-size: 18px; color: #ff6b43; margin-top: 0; margin-bottom: 15px;">Order Summary</h2>
            
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
              <span style="font-weight: bold;">Payment Method:</span>
              <span style="color: #555;">${paymentMethod === "stripe" ? "Credit Card (Stripe)" : "Cryptocurrency"}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold;">Total Amount:</span>
              <span style="color: #555;">${totalAmount}</span>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 18px; color: #ff6b43; margin-top: 0; margin-bottom: 15px;">Next Steps</h2>
            
            <p style="font-size: 16px; line-height: 1.5; margin: 16px 0;">
              Our team will contact you within 24 hours to discuss your project in more detail and begin the development process. Here's what to expect:
            </p>
            
            <ol style="padding-left: 20px;">
              <li style="margin: 8px 0;">Initial consultation to discuss your requirements in detail</li>
              <li style="margin: 8px 0;">Design mockups for your approval</li>
              <li style="margin: 8px 0;">Development phase</li>
              <li style="margin: 8px 0;">Review and revisions</li>
              <li style="margin: 8px 0;">Final approval and website launch</li>
            </ol>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5; margin: 16px 0;">
            If you have any questions or need assistance, please don't hesitate to contact us at
            <a href="mailto:info@pixelnextdigital.com" style="color: #ff6b43; text-decoration: none;"> info@pixelnextdigital.com</a>
            or call us at
            <a href="tel:+17344081791" style="color: #ff6b43; text-decoration: none;"> (734) 408-1791</a>.
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; margin: 16px 0;">We look forward to working with you!</p>
          
          <p style="font-style: italic; margin-top: 30px;">The PixelNextDigital Team</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #888; margin: 5px 0;">© ${new Date().getFullYear()} PixelNextDigital. All rights reserved.</p>
          <p style="font-size: 14px; color: #888; margin: 5px 0;">1725 Deerfield Pt, Alpharetta, GA 30096</p>
        </div>
      </div>
    `

    const data = await resend.emails.send({
      from: "PixelNextDigital <info@pixelnextdigital.com>",
      to: [email],
      subject: `Order Confirmation - ${orderId}`,
      html: htmlContent,
    })

    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

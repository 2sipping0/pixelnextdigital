import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PixelNextDigital | Custom Web Design for Small Businesses",
  description:
    "Affordable custom website design and development services for small businesses. Boost your online presence with our responsive, SEO-friendly websites.",
  keywords:
    "small business website, affordable web design, custom website, responsive design, local business website, small business web development, SEO-friendly websites",
  authors: [{ name: "PixelNextDigital" }],
  creator: "PixelNextDigital",
  publisher: "PixelNextDigital",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pixelnextdigital.com",
    title: "PixelNextDigital | Custom Web Design for Small Businesses",
    description:
      "Affordable custom website design and development services for small businesses. Boost your online presence with our responsive, SEO-friendly websites.",
    siteName: "PixelNextDigital",
    images: [
      {
        url: "https://pixelnextdigital.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PixelNextDigital - Custom Web Design for Small Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelNextDigital | Custom Web Design for Small Businesses",
    description:
      "Affordable custom website design and development services for small businesses. Boost your online presence with our responsive, SEO-friendly websites.",
    creator: "@pixelnxtdigital",
    images: ["https://pixelnextdigital.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
  alternates: {
    canonical: "https://pixelnextdigital.com",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

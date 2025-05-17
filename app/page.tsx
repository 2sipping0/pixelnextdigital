"use client"

import type React from "react"

import { useEffect, useState, useRef, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Code,
  CreditCard,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Quote,
  Shield,
  Smartphone,
  Twitter,
  Users,
  X,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { StripePaymentWrapper } from "@/components/payment/StripePaymentForm"
import { CryptoPaymentForm } from "@/components/payment/CryptoPaymentForm"
import { sendConfirmationEmail } from "./actions/send-confirmation-email"

export default function Home() {
  const currentYear = new Date().getFullYear()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    websiteDetails: "",
    selectedPlan: "",
    paymentMethod: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string
    orderDate: string
    totalAmount: string
  } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cryptoPaymentUrl, setCryptoPaymentUrl] = useState<string | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)

  const projects = [
    {
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047",
      title: "Sunrise Cafe",
      description: "Restaurant Website",
    },
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
      title: "Elegance Boutique",
      description: "E-commerce Store",
    },
    {
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
      title: "PowerFit Studio",
      description: "Fitness Website",
    },
    {
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070",
      title: "Justice Partners",
      description: "Legal Services Website",
    },
    {
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073",
      title: "Prime Properties",
      description: "Real Estate Platform",
    },
    {
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070",
      title: "Taste of Italy",
      description: "Restaurant Website",
    },
  ]

  const faqs = [
    {
      question: "How long does it take to build a website?",
      answer:
        "Our typical timeline is 1-2 weeks for basic websites, 3-4 weeks for professional websites, and 5-6 weeks for e-commerce websites. The exact timeline depends on the complexity of your project and how quickly you provide feedback and content.",
    },
    {
      question: "Do I need to provide my own content?",
      answer:
        "Yes, you'll need to provide the content for your website, including text and images. However, we can help with basic content structuring and can recommend professional copywriters and photographers if needed. We also have access to stock photos that can be used on your website.",
    },
    {
      question: "Will my website work on mobile devices?",
      answer:
        "All our websites are fully responsive, meaning they automatically adjust to look great on all devices - smartphones, tablets, laptops, and desktop computers. Mobile-friendliness is not just a feature but a standard part of our development process.",
    },
    {
      question: "Do you offer website maintenance services?",
      answer:
        "Yes, we offer free monthly maintenance for the first 6 months to keep your website secure, updated, and running smoothly. Our maintenance includes regular backups, security updates, performance optimization, and minor content updates. We can discuss maintenance options after your website is completed.",
    },
    {
      question: "Can I update the website myself after it's built?",
      answer:
        "Yes, our Professional and E-commerce packages include a content management system (CMS) that allows you to easily update content yourself without any technical knowledge. We'll provide training on how to use the CMS to make updates to your website.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept payments via credit card through Stripe and various cryptocurrencies through Coinbase Commerce.",
    },
  ]

  const handleOrderClick = (plan: string) => {
    setFormData({ ...formData, selectedPlan: plan })
    setShowOrderForm(true)
    setFormStep(1)
    setOrderSuccess(false)
    setOrderDetails(null)
    setCryptoPaymentUrl(null)
    // Scroll to the form
    setTimeout(() => {
      document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const generateOrderId = () => {
    return `PND-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const getPlanAmount = (plan: string) => {
    switch (plan) {
      case "Basic":
        return "$300"
      case "Professional":
        return "$900"
      case "E-commerce":
        return "$2,700"
      default:
        return "$0"
    }
  }

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (formStep < 3) {
      setFormStep(formStep + 1)
    } else {
      // For the final step, we don't submit the form here
      // Payment processing is handled by the payment components
    }
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      // Generate order details
      const orderId = orderDetails?.orderId || generateOrderId()
      const orderDate = orderDetails?.orderDate || formatDate(new Date())
      const totalAmount = orderDetails?.totalAmount || getPlanAmount(formData.selectedPlan)

      // Save order details for display if not already set
      if (!orderDetails) {
        setOrderDetails({
          orderId,
          orderDate,
          totalAmount,
        })
      }

      // Send confirmation email
      await sendConfirmationEmail({
        ...formData,
        orderId,
        orderDate,
        totalAmount,
      })

      // Show success state
      setOrderSuccess(true)

      // Reset form after 10 seconds
      setTimeout(() => {
        setShowOrderForm(false)
        setFormStep(1)
        setFormData({
          businessName: "",
          email: "",
          phone: "",
          socialMedia: {
            facebook: "",
            instagram: "",
            twitter: "",
          },
          websiteDetails: "",
          selectedPlan: "",
          paymentMethod: "",
        })
        setCryptoPaymentUrl(null)
      }, 10000)
    } catch (error) {
      console.error("Error processing order:", error)
      alert("There was an error processing your order. Please try again.")
    }
  }

  const handleCryptoPaymentSuccess = (chargeId: string, hostedUrl: string) => {
    // For crypto payments, we'll redirect to the Coinbase Commerce hosted checkout
    setCryptoPaymentUrl(hostedUrl)

    // Generate order details if not already set
    if (!orderDetails) {
      setOrderDetails({
        orderId: generateOrderId(),
        orderDate: formatDate(new Date()),
        totalAmount: getPlanAmount(formData.selectedPlan),
      })
    }
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    alert(`Payment error: ${error}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as Record<string, string>),
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [projects.length])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-peach-100 backdrop-blur supports-[backdrop-filter]:bg-peach-100/90">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-2xl tracking-tight text-peach-600 font-serif">
                Pixel<span className="text-peach-800">Next</span>Digital
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="flex flex-1 items-center justify-end space-x-4">
              <div className="relative group" ref={menuRef}>
                <button
                  className="flex items-center space-x-2 rounded-md px-3 py-2 bg-peach-200 text-peach-600 hover:bg-peach-300 transition-colors"
                  onClick={toggleMenu}
                >
                  <span>Menu</span>
                  {menuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 z-50 ${
                    menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  <div className="py-1">
                    <a
                      href="#services"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-peach-50"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
                        setMenuOpen(false)
                      }}
                    >
                      <Globe className="h-4 w-4 text-peach-500 mr-2" />
                      <span>Services</span>
                    </a>
                    <a
                      href="#work"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-peach-50"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
                        setMenuOpen(false)
                      }}
                    >
                      <Briefcase className="h-4 w-4 text-peach-500 mr-2" />
                      <span>Work</span>
                    </a>
                    <a
                      href="#testimonials"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-peach-50"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" })
                        setMenuOpen(false)
                      }}
                    >
                      <Quote className="h-4 w-4 text-peach-500 mr-2" />
                      <span>Testimonials</span>
                    </a>
                    <a
                      href="#pricing"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-peach-50"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                        setMenuOpen(false)
                      }}
                    >
                      <Check className="h-4 w-4 text-peach-500 mr-2" />
                      <span>Pricing</span>
                    </a>
                    <a
                      href="#faq"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-peach-50"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })
                        setMenuOpen(false)
                      }}
                    >
                      <MessageSquare className="h-4 w-4 text-peach-500 mr-2" />
                      <span>FAQ</span>
                    </a>
                    <a
                      href="#contact"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-peach-50"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                        setMenuOpen(false)
                      }}
                    >
                      <Mail className="h-4 w-4 text-peach-500 mr-2" />
                      <span>Contact</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          {/* Hero background image overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070"
              alt="Hero background"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-peach-100 to-transparent opacity-70"></div>
            <div className="absolute inset-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="opacity-10">
                <defs>
                  <pattern id="dotPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="currentColor" className="text-peach-500" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dotPattern)" />
              </svg>
            </div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-peach-300 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-peach-300 rounded-full filter blur-3xl opacity-20"></div>
          </div>
          <div className="container relative z-10 px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Elevate Your Small Business with Custom Websites
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  We create beautiful, functional websites that help small businesses grow online.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                <Button
                  className="bg-peach-500 hover:bg-peach-600 w-full sm:w-auto justify-center"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto justify-center"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  View Our Work
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-peach-50">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Services</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We offer a range of web development services tailored for small businesses.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto max-w-5xl py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-peach-300 to-peach-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex flex-col items-center space-y-4 rounded-lg bg-white p-8 shadow-lg">
                    <div className="rounded-full bg-peach-100 p-4">
                      <Globe className="h-6 w-6 text-peach-500" />
                    </div>
                    <h3 className="text-xl font-bold">Website Design</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Custom website designs that reflect your brand identity and engage your audience.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative group md:mt-12"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-peach-300 to-peach-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex flex-col items-center space-y-4 rounded-lg bg-white p-8 shadow-lg">
                    <div className="rounded-full bg-peach-100 p-4">
                      <Smartphone className="h-6 w-6 text-peach-500" />
                    </div>
                    <h3 className="text-xl font-bold">Responsive Development</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Mobile-friendly websites that look great on all devices and screen sizes.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-peach-300 to-peach-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex flex-col items-center space-y-4 rounded-lg bg-white p-8 shadow-lg">
                    <div className="rounded-full bg-peach-100 p-4">
                      <Code className="h-6 w-6 text-peach-500" />
                    </div>
                    <h3 className="text-xl font-bold">E-commerce Solutions</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Online stores with secure payment processing and inventory management.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Work</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Check out some of our recent projects for small businesses.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto max-w-5xl py-12">
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {projects.map((project, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="relative h-[400px] w-full">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                          <h3 className="text-2xl font-bold">{project.title}</h3>
                          <p className="text-sm text-gray-200">{project.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-peach-50">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Testimonials</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Hear what our clients have to say about working with us.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-white"
              >
                <div className="rounded-full bg-peach-100 p-2">
                  <Users className="h-6 w-6 text-peach-500" />
                </div>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  "PixelNextDigital transformed our online presence. Our new website has increased our customer
                  inquiries by 40%!"
                </p>
                <div>
                  <h4 className="text-lg font-bold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bloom Flower Shop</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-white"
              >
                <div className="rounded-full bg-peach-100 p-2">
                  <Users className="h-6 w-6 text-peach-500" />
                </div>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  "Working with PixelNextDigital was a breeze. They understood our needs and delivered a website that
                  exceeded our expectations."
                </p>
                <div>
                  <h4 className="text-lg font-bold">Mark Thompson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Thompson's Bakery</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-white"
              >
                <div className="rounded-full bg-peach-100 p-2">
                  <Users className="h-6 w-6 text-peach-500" />
                </div>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  "Our e-commerce sales have doubled since launching our new website. The team at PixelNextDigital are
                  true professionals."
                </p>
                <div>
                  <h4 className="text-lg font-bold">Lisa Chen</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Artisan Crafts Co.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Pricing</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Transparent pricing with no hidden fees. Choose the plan that works for your business.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto max-w-5xl py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 gap-6 md:grid-cols-3"
              >
                <div className="rounded-lg border bg-white p-4 sm:p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-bold">Basic</h3>
                    <p className="text-sm text-gray-500">Perfect for small businesses just getting started</p>
                    <div className="flex items-baseline">
                      <span className="text-2xl md:text-3xl font-bold">$300</span>
                      <span className="ml-1 text-sm text-gray-500">one-time</span>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">1-3 page responsive website</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Contact form</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Mobile-friendly design</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Basic SEO setup</span>
                    </li>
                  </ul>
                  <Button
                    className="mt-6 w-full bg-peach-500 hover:bg-peach-600 text-xs sm:text-sm md:text-base py-2 md:py-3 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleOrderClick("Basic")}
                  >
                    Get Started
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <div className="rounded-lg border bg-white p-4 sm:p-5 md:p-6 shadow-lg relative transition-all duration-300 hover:shadow-xl">
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-peach-500 px-3 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-bold">Professional</h3>
                    <p className="text-sm text-gray-500">For established businesses looking to grow</p>
                    <div className="flex items-baseline">
                      <span className="text-2xl md:text-3xl font-bold">$900</span>
                      <span className="ml-1 text-sm text-gray-500">one-time</span>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">4-8 page responsive website</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Advanced contact forms</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Content management system</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Advanced SEO optimization</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Social media integration</span>
                    </li>
                  </ul>
                  <Button
                    className="mt-6 w-full bg-peach-500 hover:bg-peach-600 text-xs sm:text-sm md:text-base py-2 md:py-3 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                    onClick={() => handleOrderClick("Professional")}
                  >
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                    <span className="absolute inset-0 bg-peach-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Button>
                </div>
                <div className="rounded-lg border bg-white p-4 sm:p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-bold">E-commerce</h3>
                    <p className="text-sm text-gray-500">For businesses selling products online</p>
                    <div className="flex items-baseline">
                      <span className="text-2xl md:text-3xl font-bold">$2,700</span>
                      <span className="ml-1 text-sm text-gray-500">one-time</span>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Full e-commerce website</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Product management</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Secure payment processing</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Inventory management</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-peach-500" />
                      <span className="text-sm">Marketing integrations</span>
                    </li>
                  </ul>
                  <Button
                    className="mt-6 w-full bg-peach-500 hover:bg-peach-600 text-xs sm:text-sm md:text-base py-2 md:py-3 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleOrderClick("E-commerce")}
                  >
                    Get Started
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {showOrderForm && (
              <div
                id="order-form"
                className="mx-auto max-w-3xl mt-12 bg-white rounded-lg shadow-lg p-6 border border-peach-200"
              >
                {orderSuccess ? (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <div className="rounded-full bg-green-100 p-3">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for your order. A confirmation email has been sent to{" "}
                      <span className="font-medium">{formData.email}</span>
                    </p>

                    <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left max-w-md mx-auto">
                      <h4 className="font-semibold text-lg mb-4 text-peach-600">Order Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">{orderDetails?.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{orderDetails?.orderDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Package:</span>
                          <span className="font-medium">{formData.selectedPlan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold text-peach-600">{orderDetails?.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">
                      Our team will contact you within 24 hours to discuss your project in detail.
                    </p>

                    <Button
                      onClick={() => setShowOrderForm(false)}
                      className="bg-peach-500 hover:bg-peach-600 text-white"
                    >
                      Close
                    </Button>
                  </div>
                ) : cryptoPaymentUrl ? (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <div className="rounded-full bg-peach-100 p-3">
                        <Shield className="h-12 w-12 text-peach-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Crypto Payment</h3>
                    <p className="text-gray-600 mb-6">
                      You'll be redirected to Coinbase Commerce to complete your payment securely.
                    </p>

                    <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left max-w-md mx-auto">
                      <h4 className="font-semibold text-lg mb-4 text-peach-600">Order Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">{orderDetails?.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Package:</span>
                          <span className="font-medium">{formData.selectedPlan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold text-peach-600">{orderDetails?.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => window.open(cryptoPaymentUrl, "_blank")}
                        className="bg-peach-500 hover:bg-peach-600 text-white"
                      >
                        Proceed to Payment
                      </Button>
                      <Button variant="outline" onClick={() => setCryptoPaymentUrl(null)}>
                        Go Back
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Order {formData.selectedPlan} Package</h3>
                      <button
                        onClick={() => setShowOrderForm(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close form"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-peach-500 flex items-center justify-center text-white font-bold mr-3">
                          {formStep}
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-peach-500 rounded-full transition-all duration-300"
                            style={{ width: `${(formStep / 3) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formStep === 1 && "Step 1: Business Information"}
                        {formStep === 2 && "Step 2: Website Details"}
                        {formStep === 3 && "Step 3: Payment Method"}
                      </p>
                    </div>

                    <form onSubmit={handleFormSubmit}>
                      {formStep === 1 && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                              Business Name *
                            </label>
                            <input
                              type="text"
                              id="businessName"
                              name="businessName"
                              value={formData.businessName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
                              placeholder="Your Business Name"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
                              placeholder="you@example.com"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
                              placeholder="(123) 456-7890"
                            />
                          </div>
                        </div>
                      )}

                      {formStep === 2 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Social Media Pages (Optional)
                            </label>
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                                <input
                                  type="text"
                                  name="socialMedia.facebook"
                                  value={formData.socialMedia.facebook}
                                  onChange={handleInputChange}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
                                  placeholder="Facebook URL"
                                />
                              </div>
                              <div className="flex items-center">
                                <Instagram className="h-5 w-5 text-pink-600 mr-2" />
                                <input
                                  type="text"
                                  name="socialMedia.instagram"
                                  value={formData.socialMedia.instagram}
                                  onChange={handleInputChange}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
                                  placeholder="Instagram URL"
                                />
                              </div>
                              <div className="flex items-center">
                                <Twitter className="h-5 w-5 text-blue-400 mr-2" />
                                <input
                                  type="text"
                                  name="socialMedia.twitter"
                                  value={formData.socialMedia.twitter}
                                  onChange={handleInputChange}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
                                  placeholder="Twitter URL"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label htmlFor="websiteDetails" className="block text-sm font-medium text-gray-700 mb-1">
                              Website Details *
                            </label>
                            <textarea
                              id="websiteDetails"
                              name="websiteDetails"
                              value={formData.websiteDetails}
                              onChange={handleInputChange}
                              required
                              rows={5}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
                              placeholder="Please describe your business and what you'd like to achieve with your new website. Include any specific features or pages you need."
                            ></textarea>
                          </div>
                        </div>
                      )}

                      {formStep === 3 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Select Payment Method *
                            </label>
                            <div className="space-y-3">
                              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-peach-50 transition-colors">
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value="stripe"
                                  checked={formData.paymentMethod === "stripe"}
                                  onChange={handleInputChange}
                                  required
                                  className="h-4 w-4 text-peach-500 focus:ring-peach-500 border-gray-300"
                                />
                                <span className="ml-2 flex items-center">
                                  <CreditCard className="h-5 w-5 text-peach-500 mr-2" />
                                  Pay with Card (Stripe)
                                </span>
                              </label>
                              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-peach-50 transition-colors">
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value="crypto"
                                  checked={formData.paymentMethod === "crypto"}
                                  onChange={handleInputChange}
                                  required
                                  className="h-4 w-4 text-peach-500 focus:ring-peach-500 border-gray-300"
                                />
                                <span className="ml-2 flex items-center">
                                  <Shield className="h-5 w-5 text-peach-500 mr-2" />
                                  Pay with Crypto
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                    More Secured
                                  </span>
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Package:</span>
                              <span className="font-medium">{formData.selectedPlan}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-medium">
                                {formData.selectedPlan === "Basic" && "$300"}
                                {formData.selectedPlan === "Professional" && "$900"}
                                {formData.selectedPlan === "E-commerce" && "$2,700"}
                              </span>
                            </div>
                            <div className="border-t border-gray-200 my-2 pt-2">
                              <div className="flex justify-between">
                                <span className="font-medium">Total:</span>
                                <span className="font-bold text-peach-600">
                                  {formData.selectedPlan === "Basic" && "$300"}
                                  {formData.selectedPlan === "Professional" && "$900"}
                                  {formData.selectedPlan === "E-commerce" && "$2,700"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {formData.paymentMethod === "stripe" && (
                            <div className="mt-4">
                              <StripePaymentWrapper
                                orderDetails={{
                                  ...formData,
                                  orderId: orderDetails?.orderId || generateOrderId(),
                                  orderDate: orderDetails?.orderDate || formatDate(new Date()),
                                  totalAmount: orderDetails?.totalAmount || getPlanAmount(formData.selectedPlan),
                                }}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                              />
                            </div>
                          )}

                          {formData.paymentMethod === "crypto" && (
                            <div className="mt-4">
                              <CryptoPaymentForm
                                orderDetails={{
                                  ...formData,
                                  orderId: orderDetails?.orderId || generateOrderId(),
                                  orderDate: orderDetails?.orderDate || formatDate(new Date()),
                                  totalAmount: orderDetails?.totalAmount || getPlanAmount(formData.selectedPlan),
                                }}
                                onSuccess={handleCryptoPaymentSuccess}
                                onError={handlePaymentError}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-8 flex justify-between">
                        {formStep > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFormStep(formStep - 1)}
                            className="px-4 py-2"
                          >
                            Back
                          </Button>
                        )}
                        {formStep < 3 ? (
                          <Button
                            type="submit"
                            className="bg-peach-500 hover:bg-peach-600 text-white px-4 py-2 ml-auto"
                          >
                            Continue
                          </Button>
                        ) : (
                          formData.paymentMethod === "" && (
                            <Button
                              type="button"
                              className="bg-peach-500 hover:bg-peach-600 text-white px-4 py-2 ml-auto"
                              disabled={true}
                            >
                              Select a Payment Method
                            </Button>
                          )
                        )}
                      </div>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-peach-50">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Find answers to common questions about our web development services.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto max-w-3xl py-12">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-lg border bg-white overflow-hidden"
                  >
                    <button
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                      onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                    >
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      {activeQuestion === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    <div className={`px-4 pb-4 ${activeQuestion === index ? "block" : "hidden"}`}>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">Still have questions?</p>
                <Button
                  className="bg-peach-500 hover:bg-peach-600 px-6"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get In Touch</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Ready to elevate your online presence? Contact us today.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto max-w-5xl py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-8 md:grid-cols-3"
              >
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm text-center bg-white">
                  <div className="rounded-full bg-peach-100 p-4">
                    <Mail className="h-6 w-6 text-peach-500" />
                  </div>
                  <h3 className="text-xl font-bold">Email Us</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Send us an email and we'll get back to you within 24 hours.
                  </p>
                  <a
                    href="mailto:info@pixelnextdigital.com"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-peach-500 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-peach-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    info@pixelnextdigital.com
                  </a>
                </div>
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm text-center bg-white">
                  <div className="rounded-full bg-peach-100 p-4">
                    <Phone className="h-6 w-6 text-peach-500" />
                  </div>
                  <h3 className="text-xl font-bold">Call Us</h3>
                  <p className="text-gray-500 dark:text-gray-400">Give us a call during business hours (9am-5pm).</p>
                  <a
                    href="tel:+17344081791"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-peach-500 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-peach-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    (734) 408-1791
                  </a>
                </div>
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm text-center bg-white">
                  <div className="rounded-full bg-peach-100 p-4">
                    <MessageSquare className="h-6 w-6 text-peach-500" />
                  </div>
                  <h3 className="text-xl font-bold">WhatsApp</h3>
                  <p className="text-gray-500 dark:text-gray-400">Chat with us directly on WhatsApp.</p>
                  <a
                    href="https://wa.me/message/YHKXDMAWCVG4B1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-peach-500 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-peach-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Message on WhatsApp
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © {currentYear} PixelNextDigital. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Terms
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Privacy
            </Link>
            <a
              href="https://twitter.com/pixelnxtdigital"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-peach-500 transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://instagram.com/pixelnextdigital"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-peach-500 transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

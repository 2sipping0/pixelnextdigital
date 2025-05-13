"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Briefcase,
  Check,
  ChevronDown,
  Code,
  Globe,
  Instagram,
  Mail,
  MessageSquare,
  MessageSquareQuote,
  Phone,
  Smartphone,
  Twitter,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  const currentYear = new Date().getFullYear()
  const [currentSlide, setCurrentSlide] = useState(0)

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
              <div className="relative group">
                <button className="flex items-center space-x-2 rounded-md px-3 py-2 bg-peach-200 text-peach-600 hover:bg-peach-300 transition-colors">
                  <span>Menu</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <a
                      href="#services"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-peach-50"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
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
                      }}
                    >
                      <MessageSquareQuote className="h-4 w-4 text-peach-500 mr-2" />
                      <span>Testimonials</span>
                    </a>
                    <a
                      href="#pricing"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-peach-50"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      <Check className="h-4 w-4 text-peach-500 mr-2" />
                      <span>Pricing</span>
                    </a>
                    <a
                      href="#contact"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-peach-50"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
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
              <div className="space-x-4">
                <Button
                  asChild
                  className="bg-peach-500 hover:bg-peach-600"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <Link href="#contact">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <Link href="#work">View Our Work</Link>
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
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-bold">Basic</h3>
                    <p className="text-sm text-gray-500">Perfect for small businesses just getting started</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">$300</span>
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
                  <Button className="mt-6 w-full bg-peach-500 hover:bg-peach-600">Get Started</Button>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-lg relative">
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-peach-500 px-3 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-bold">Professional</h3>
                    <p className="text-sm text-gray-500">For established businesses looking to grow</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">$900</span>
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
                  <Button className="mt-6 w-full bg-peach-500 hover:bg-peach-600">Get Started</Button>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-bold">E-commerce</h3>
                    <p className="text-sm text-gray-500">For businesses selling products online</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">$2,700</span>
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
                  <Button className="mt-6 w-full bg-peach-500 hover:bg-peach-600">Get Started</Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-peach-50">
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

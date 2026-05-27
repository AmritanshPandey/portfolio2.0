import "./globals.css"
import type { Metadata } from "next"
import Navbar from "@/components/layout/navigation/navbar"
import Footer from "@/components/layout/footer/footer"
import { FancyCursor } from "@/components/shared/cursor"
import { SmoothScroll } from "@/components/shared/smooth-scroll"
import { ScrollToHash } from "@/app/scroll-to-hash"
import { Montserrat, Caveat } from "next/font/google"
import { ThemeProvider } from "next-themes"
import clsx from "clsx"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-caveat",
})

export const metadata: Metadata = {
  title: {
    default: "Amritansh Pandey | Senior Product Designer | Mastercard",
    template: "%s | Amritansh Pandey",
  },
  description:
    "Amritansh Pandey — Senior Product Designer at Mastercard. 8 years building fintech systems end to end. Agent Pay, PartnerBank, agentic commerce, and the React demo the CPO used at Money20/20.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(caveat.variable)}
    >
      <body
        className={clsx(
          montserrat.className,
          "bg-background text-foreground",
          "antialiased",
          "[text-rendering:optimizeLegibility]"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Lenis smooth scroll */}
          <SmoothScroll />

          {/* Scroll restore */}
          <ScrollToHash />

          <FancyCursor />

          {/* Navbar */}
          <Navbar />

          {/* Content */}
          <main className="relative [transform:translateZ(0)]">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
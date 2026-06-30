import "./globals.css"
import type { Metadata } from "next"
import Navbar from "@/components/layout/navigation/navbar"
import Footer from "@/components/layout/footer/footer"
import { FancyCursor } from "@/components/shared/cursor"
import { ThemeFab } from "@/components/shared/theme-fab"
import { SiteBackground } from "@/components/shared/site-background"
import { Grain } from "@/components/shared/motion"
import { SmoothScroll } from "@/components/shared/smooth-scroll"
import { ScrollToHash } from "@/app/scroll-to-hash"
import { Montserrat, Caveat } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { MotionConfig } from "framer-motion"
import { Analytics } from "@vercel/analytics/next"
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
  metadataBase: new URL("https://portfolio2-0-beta-one.vercel.app"),
  title: {
    default: "Amritansh Pandey | Product Thinker | Mastercard",
    template: "%s | Amritansh Pandey",
  },
  description:
    "Amritansh Pandey, Product Thinker at Mastercard. 7 years building fintech end to end. Agent Pay, PartnerBank, agentic commerce, and the React demo the CPO used at Money20/20.",
  openGraph: {
    type: "website",
    siteName: "Amritansh Pandey",
    url: "https://portfolio2-0-beta-one.vercel.app",
    title: "Amritansh Pandey | Product Thinker | Mastercard",
    description:
      "7 years building fintech end to end, from early demo to CPO stage. Agent Pay, PartnerBank, agentic commerce, and the demo the CPO used at Money20/20.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amritansh Pandey | Product Thinker | Mastercard",
    description: "7 years building fintech end to end, from early demo to CPO stage.",
  },
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
      <head>
        {/* Progressive enhancement: mark that scripting is available BEFORE
            first paint. Framer Motion writes its `initial` opacity:0 into the
            SSR HTML; if JS never runs (disabled / hydration failure) the CSS
            rule `html:not(.js) main [style*="opacity:0"]` (globals.css) forces
            that content visible. Adding `.js` here keeps the animation intact
            whenever JS does run — no flash, nothing disabled. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
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
          {/* Honour prefers-reduced-motion across all Framer Motion animations */}
          <MotionConfig reducedMotion="user">
            {/* Lenis smooth scroll */}
            <SmoothScroll />

            {/* Scroll restore */}
            <ScrollToHash />

            <FancyCursor />

            {/* Interactive dot field — a standalone, full-viewport background
                layer (independent of the hero). Sits behind all content; the
                opaque section bands scroll over it. */}
            <SiteBackground />

            {/* Film grain — one quiet texture across every page */}
            <Grain />

            {/* Navbar */}
            <Navbar />

            {/* Floating theme toggle — bottom-right, site-wide */}
            <ThemeFab />

            {/* Content */}
            <main className="relative overflow-x-clip [transform:translateZ(0)]">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            <Analytics />
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  )
}

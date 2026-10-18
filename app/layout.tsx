import "./globals.css"
import type { Metadata, Viewport } from "next"
import Navbar from "@/components/layout/navigation/navbar"
import Footer from "@/components/layout/footer/footer"
import { FooterGate } from "@/components/layout/footer/footer-gate"
import { FancyCursor } from "@/components/shared/cursor"
import { SettleObserver } from "@/components/shared/settle-observer"
import { RulePluck } from "@/components/shared/rule-pluck"
import { SettleGuard } from "@/components/shared/settle-guard"
import { ScrollToHash } from "@/app/scroll-to-hash"
import { Archivo, Martian_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { ViewTransition } from "react"
import { ReducedMotion } from "@/components/shared/reduced-motion"
import { Analytics } from "@vercel/analytics/next"
import clsx from "clsx"
import { SITE_URL } from "@/lib/site"

// Ledger type: one family, two voices. Archivo's width axis carries the
// hierarchy (expanded display, normal reading text); Martian Mono sets every
// figure, reference and caption. Both are self-hosted and subset by next/font.
const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--ff-sans",
  display: "swap",
})

const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--ff-mono",
  display: "swap",
})

const analyticsEnabled = process.env.VERCEL === "1"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Amritansh Pandey | Senior UX Designer | Mastercard",
    template: "%s | Amritansh Pandey",
  },
  description:
    "Amritansh Pandey, Senior UX Designer at Mastercard. 6+ years building products end to end: PartnerBank demo systems, agentic commerce, enterprise product systems, and front-end prototypes.",
  openGraph: {
    type: "website",
    siteName: "Amritansh Pandey",
    url: SITE_URL,
    title: "Amritansh Pandey | Senior UX Designer | Mastercard",
    description:
      "6+ years building products end to end: PartnerBank demo systems, agentic commerce, enterprise product systems, and front-end prototypes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amritansh Pandey | Senior UX Designer | Mastercard",
    description: "6+ years building products end to end, from early demo to CPO stage.",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F0EB" },
    { media: "(prefers-color-scheme: dark)", color: "#101010" },
  ],
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
      className={clsx(sans.variable, mono.variable)}
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
          "bg-background text-foreground",
          "antialiased",
          "[text-rendering:optimizeLegibility]"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Honour prefers-reduced-motion across all Framer Motion animations */}
          <ReducedMotion />
          <>

            {/* Scroll restore */}
            <ScrollToHash />

            {/* Reveal failsafe — forces stalled entrance reveals visible */}
            <SettleGuard />

            <FancyCursor />

            {/* The settle: rules draw and content lands as it scrolls in */}
            <SettleObserver />

            {/* Rules pluck like strings under a desktop pointer */}
            <RulePluck />

            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
            >
              Skip to content
            </a>

            {/* Navbar */}
            <Navbar />

            {/* Content */}
            <main id="main-content" className="relative overflow-x-clip [transform:translateZ(0)]">
              <ViewTransition>{children}</ViewTransition>
            </main>

            {/* Footer */}
            <FooterGate>
              <Footer />
            </FooterGate>

            {analyticsEnabled && <Analytics />}
          </>
        </ThemeProvider>
      </body>
    </html>
  )
}

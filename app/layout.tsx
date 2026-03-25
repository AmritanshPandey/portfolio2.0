import "./globals.css"
import Navbar from "@/components/layout/navigation/navbar"
import Footer from "@/components/layout/footer/footer"
import { FancyCursor } from "@/components/shared/cursor"
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx("scroll-smooth", caveat.variable)}
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
          {/* Cursor (safe) */}
          {typeof window !== "undefined" && <FancyCursor />}

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
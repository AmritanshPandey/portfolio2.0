import "./globals.css"
import Navbar from "@/components/layout/navigation/navbar"
import Footer from "@/components/layout/footer/footer"
import { FancyCursor } from "@/components/shared/cursor"
import { ScrollToHash } from "@/app/scroll-to-hash"
import { Montserrat } from "next/font/google"
import { ThemeProvider } from "next-themes"
import clsx from "clsx"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className="scroll-smooth"
    >
      <body
        className={clsx(
          montserrat.className,
          "bg-background text-foreground"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Cursor */}
          <FancyCursor />

          {/* Scroll restore */}
          <ScrollToHash />

          {/* Navbar */}
          <Navbar />

          {/* Content */}
          <main className="relative">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
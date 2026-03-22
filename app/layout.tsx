import "./globals.css"
import Navbar from "@/components/layout/navigation/navbar"
import Footer from "@/components/layout/footer/footer"
import { FancyCursor } from "@/components/shared/cursor"
import { Montserrat } from "next/font/google"
import { ThemeProvider } from "next-themes"

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          *, *::before, *::after { cursor: none !important; }
          a, button, input, select, textarea, label,
          [role="button"], [role="link"], [tabindex] {
            cursor: none !important;
          }
        `}</style>
      </head>

      <body className={montserrat.className}>
        
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          
          <FancyCursor />

          <Navbar />

          <main>
            {children}
          </main>

          <Footer />

        </ThemeProvider>

      </body>
    </html>
  )
}
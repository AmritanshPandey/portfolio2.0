import "./globals.css"
import Navbar from "@/components/layout/navigation/navbar"
import Footer from "@/components/layout/footer/footer"
import { FancyCursor } from "@/components/shared/cursor"
import { Montserrat } from "next/font/google"

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
    <html lang="en">
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

       
        <FancyCursor />

        <Navbar />

        <main>
          {children}
        </main>

        <Footer />

      </body>
    </html>
  )
}
import "./globals.css"
import Navbar from "@/components/layout/navigation/navbar"
import Footer from "@/components/layout/footer/footer"
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
      <body className={montserrat.className}>

        <Navbar />

               <main className="pt-8 md:pt-32 lg:pt-32">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  )
}
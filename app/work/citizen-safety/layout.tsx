import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dror, Building a Citizen Safety Platform, Then Pivoting Under COVID",
  description:
    "Sole PM, designer, and React developer across two products in eleven months, a consumer safety app, a COVID-forced B2B pivot, ₹1.98Cr revenue, and a hard lesson about PMF.",
}

export default function CitizenSafetyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

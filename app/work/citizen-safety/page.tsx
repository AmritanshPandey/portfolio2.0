import { redirect } from "next/navigation"

export const metadata = {
  title: "Citizen Safety Platform — Dror",
  description:
    "Sole PM, designer, and React frontend dev across two products in eleven months — a consumer safety app, a COVID-forced B2B pivot, and a lesson about PMF you can't own.",
}

export default function Page() {
  redirect("/case-studies/citizen-safety.html")
}

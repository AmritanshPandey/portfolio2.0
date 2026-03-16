import Hero from "@/components/hero/hero"
import CaseStudy from "@/components/work/case-study"
import ExplorationsSection from "@/components/work/exploration"
import SystemsSection from "@/components/work/system"

export default function Page() {
  return (
    <main>
      <Hero />
      <CaseStudy />
      <SystemsSection />
      <ExplorationsSection />
    </main>
  )
}
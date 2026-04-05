import data from "@/data/case-studies/d2c-platform.json"
import { CaseStudyRenderer } from "@/components/case-study/case-study-renderer"
import type { CaseStudy } from "@/lib/types/case-study"

export const metadata = {
  title: (data as unknown as CaseStudy).hero.title,
  description: (data as unknown as CaseStudy).hero.subtitle,
}

export default function Page() {
  return <CaseStudyRenderer data={data as unknown as CaseStudy} />
}

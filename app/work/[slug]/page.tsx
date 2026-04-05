import { notFound } from "next/navigation"
import { readFileSync, readdirSync } from "fs"
import path from "path"
import type { CaseStudy } from "@/lib/types/case-study"
import { CaseStudyRenderer } from "@/components/case-study/case-study-renderer"

// ── Data loader ────────────────────────────────────────────────
function getCaseStudy(slug: string): CaseStudy | null {
  try {
    const filePath = path.join(process.cwd(), "data", "case-studies", `${slug}.json`)
    const raw = readFileSync(filePath, "utf-8")
    return JSON.parse(raw) as CaseStudy
  } catch {
    return null
  }
}

// ── Static params for build ────────────────────────────────────
export function generateStaticParams() {
  try {
    const dir = path.join(process.cwd(), "data", "case-studies")
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => ({ slug: f.replace(".json", "") }))
  } catch {
    return []
  }
}

// ── Metadata ───────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = getCaseStudy(slug)
  if (!data) return {}
  return {
    title: data.hero.title,
    description: data.hero.subtitle,
  }
}

// ── Page ───────────────────────────────────────────────────────
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = getCaseStudy(slug)
  if (!data) notFound()

  return <CaseStudyRenderer data={data} />
}

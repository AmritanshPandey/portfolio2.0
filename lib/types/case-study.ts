export interface CaseStudyMeta {
  role?: string
  duration?: string
  platform?: string
  team?: string
}

export interface CaseStudyDecision {
  title: string
  problem: string
  decision: string
  tradeoff: string
  impact?: string
}

export interface TimelineItem {
  week: string
  label: string
  detail: string
}

export interface CaseStudy {
  slug: string
  hero: {
    title: string
    subtitle: string
    meta: CaseStudyMeta
  }
  context: {
    points: string[]
  }
  problem: {
    statement: string
  }
  constraints: {
    points: string[]
  }
  role: {
    ownership: string[]
    collaboration: string[]
  }
  approach: {
    inputs: string[]
    insights: string[]
    implications: string[]
  }
  decisions: CaseStudyDecision[]
  system: {
    shared: string[]
    brandSpecific: string[]
  }
  solution: {
    flows: string[]
    highlights: string[]
  }
  impact: {
    points: string[]
  }
  tradeoffs: string[]
  evolution: {
    timeline: TimelineItem[]
  }
  takeaway: string
  visuals?: {
    architecture?: string
    flow?: string
    beforeAfter?: string
    components?: string[]
    system?: string
  }
}

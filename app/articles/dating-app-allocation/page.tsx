"use client"

import { motion } from "framer-motion"
import { articleItems } from "@/lib/data"
import { ArticleHeader, RelatedArticles } from "@/components/articles/article-ui"
import {
  LineageStrip,
  DiscoveryVsAllocation,
  ConcentrationDemo,
  TradeoffFrontier,
  EngineComparison,
  WeeklyLoop,
} from "@/components/shared/matching-lab"

const HREF = "/articles/dating-app-allocation"
const article = articleItems.find(a => a.href === HREF)!

// ─── primitives ─────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Section({ children }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <section className="border-b border-border/40 bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">{children}</div>
    </section>
  )
}

function Eyebrow({ num, tag }: { num: string; tag: string }) {
  return (
    <div className="mb-4 font-mono text-[12px] text-muted-foreground">
      <span className="tabular-nums text-foreground/50">{num}</span>
      <span className="mx-2 text-border">/</span>
      {tag}
    </div>
  )
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="max-w-3xl text-[1.55rem] md:text-[1.8rem] font-semibold leading-[1.15] text-foreground mb-4">{children}</h2>
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="max-w-3xl text-[16px] md:text-[17px] leading-[1.8] text-foreground/80 mb-4">{children}</p>
}
function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-9 relative max-w-3xl pl-6">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-accent" />
      <p className="text-[1.2rem] md:text-[1.3rem] font-medium leading-[1.6] text-foreground/85">{children}</p>
    </blockquote>
  )
}
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 max-w-3xl rounded-lg border border-accent/20 bg-accent/[0.04] p-5 md:p-6 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent/60 rounded-l-xl" />
      <p className="text-[14px] md:text-[15px] leading-[1.7] text-foreground/80 pl-2">{children}</p>
    </div>
  )
}
function Figure({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <FadeIn className="my-9">
      {children}
      {caption && <p className="mt-3 text-[12px] text-muted-foreground text-center px-4">{caption}</p>}
    </FadeIn>
  )
}

// ─── hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return <ArticleHeader article={article} />
}

// ─── takeaways + related ───────────────────────────────────────────────────────

function Takeaways({ items }: { items: string[] }) {
  return (
    <div className="my-4 rounded-2xl border border-border/50 bg-foreground/[0.02] dark:bg-white/[0.02] overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-4 h-[2px] bg-accent rounded-full" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Key Takeaways</p>
      </div>
      <div className="px-6 py-5 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 items-start">
            <span className="text-[11px] font-mono font-bold text-accent/70 mt-1 w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <p className="text-[14px] md:text-[15px] leading-[1.65] text-foreground/75">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main>
      <Hero />

      {/* intro */}
      <Section>
        <FadeIn>
          <p className="text-[18px] md:text-[19px] leading-[1.75] font-medium text-foreground/90">
            {article.intro}
          </p>
        </FadeIn>
      </Section>

      {/* 01 */}
      <Section>
        <FadeIn><Eyebrow num="01" tag="The reframe" /></FadeIn>
        <FadeIn><H2>Most apps solved the easy half</H2></FadeIn>
        <FadeIn>
          <P>Ask a founder what their app does and you get some version of &ldquo;we help you find the right person.&rdquo; Watch the actual product and it does something smaller. It helps you browse people fast. Those are not the same thing. Browsing is discovery. You take a messy pool of strangers and make it scrollable and filterable. We are very good at that now. Nobody built the part that decides who you should actually meet this week, out of everyone you could meet.</P>
        </FadeIn>
        <Figure caption="Discovery is a search problem. Allocation is about who gets the scarce thing. We solved the first one and hoped the second would sort itself out.">
          <DiscoveryVsAllocation />
        </Figure>
        <FadeIn>
          <P>Allocation is hard because attention runs out. There are only so many people you can seriously consider in a week. When an app hands that attention out badly, it does not break in an obvious way. It quietly sends almost all of it to a small group of very desirable people. Everyone else swipes into nothing. The dashboards still look healthy. The market underneath them is not.</P>
        </FadeIn>
        <Quote>Discovery means making the haystack easy to search. Allocation means deciding who gets the scarce thing. We spent ten years on the first one and barely touched the second.</Quote>
      </Section>

      {/* 02 */}
      <Section muted>
        <FadeIn><Eyebrow num="02" tag="The objective" /></FadeIn>
        <FadeIn><H2>Optimizing for engagement works against the user</H2></FadeIn>
        <FadeIn>
          <P>Here is the uncomfortable part for product people. When you tune a dating app for engagement, more time in app, more swipes, more daily actives, you are picking a goal. That goal fights the thing the user actually wants, which is to leave. Someone who finds a real partner stops opening the app. So an app built to maximize swiping is, in practice, built to keep you single but busy.</P>
        </FadeIn>
        <Figure caption="An engagement goal drifts toward concentration on its own. The most wanted few soak up almost everything. Capping attention is what spreads it back.">
          <ConcentrationDemo />
        </Figure>
        <FadeIn>
          <P>This is a plain incentive problem. The concentration is not a bug someone forgot to fix. It is where an engagement goal naturally lands, because the most desirable profiles pull swipes from everyone else.</P>
        </FadeIn>
        <Callout>If you make more money when people keep searching, you built a search company and called it matchmaking. The goal you optimize for is the product. Everything after that is detail.</Callout>
      </Section>

      {/* 03 */}
      <Section>
        <FadeIn><Eyebrow num="03" tag="The core" /></FadeIn>
        <FadeIn><H2>Gale&ndash;Shapley got the important part right</H2></FadeIn>
        <FadeIn>
          <P>People have studied this for sixty years, just not inside an app. Two old algorithms taught me how matching should feel, and where they fall short for someone trying to get married.</P>
        </FadeIn>
        <Figure caption="Sixty years of matching theory, and the question each one was really asking.">
          <LineageStrip />
        </Figure>
        <FadeIn>
          <P>Gale&ndash;Shapley (1962) is the one I build on, and I keep it at the center. The idea is simple and it holds up. Only put two people together when the interest runs both ways. No match should be great for one person and miserable for the other. It also guarantees stability, which means no two people will both want to drop their match for each other. That guarantee is the core of what I do. I did not throw it out.</P>
        </FadeIn>
        <FadeIn>
          <P>What Gale&ndash;Shapley does not handle is the shape of the problem, not the idea behind it. It gives each person one partner, once. Real matchmaking is a few introductions every week. It needs two clean sides. And on its own it lets the most desirable people take everything while others get skipped. Irving (1985) fixed the two-sides issue by putting everyone in one pool, but it can come back and say no stable matching exists at all. You cannot tell a paying user the system could not seat them this week.</P>
        </FadeIn>
      </Section>

      {/* 04 */}
      <Section muted>
        <FadeIn><Eyebrow num="04" tag="The new question" /></FadeIn>
        <FadeIn><H2>I changed the question, not the engine</H2></FadeIn>
        <FadeIn>
          <P>So I changed the question I was asking. &ldquo;What is the one stable pairing of everyone&rdquo; is the wrong question for a market that keeps running. The better question is more practical. Given how compatible people are, and how fairly each person has been treated so far, who should meet whom this week?</P>
        </FadeIn>
        <FadeIn>
          <P>That one change does a lot. A single pairing becomes a weekly allocation. One partner becomes a few introductions. Last week&apos;s results feed into this week&apos;s. And because it is an optimization with limits, it always returns something. The system can fail to find a great match. It cannot fail to run.</P>
        </FadeIn>
        <Quote>Going from &ldquo;solve the market once&rdquo; to &ldquo;allocate it fairly every week&rdquo; is the whole idea. Once it is a weekly allocation, the math stops being a wall and becomes a tool.</Quote>
      </Section>

      {/* 05 */}
      <Section>
        <FadeIn><Eyebrow num="05" tag="How it works" /></FadeIn>
        <FadeIn><H2>How FairMatch actually works</H2></FadeIn>
        <FadeIn>
          <P>FairMatch is Gale&ndash;Shapley at the center with two things wrapped around it. Fairness, and a calendar. Every week it runs the same four steps.</P>
        </FadeIn>
        <Figure caption="The same four steps run every week. Score is pure Gale-Shapley. Balance and the weekly cap are what we add.">
          <WeeklyLoop />
        </Figure>
        <FadeIn>
          <P>First it filters. Hard rules like age, location, and dealbreakers decide who is even possible. Second it scores. For every possible pair it works out a compatibility number, built so a match only counts as good when it is good for both sides. That scoring is Gale&ndash;Shapley&apos;s mutuality, kept as is. Third it balances. It tracks who has been under-served and steers desirable partners toward them. Fourth it introduces. Everyone gets the same small number of introductions, and next week the loop runs again with new feedback.</P>
        </FadeIn>
        <FadeIn>
          <P>The balance step has one dial, called lambda. At zero, the system only cares about compatibility and ignores who gets left out. Turn it up and it actively pushes sought-after people toward those who keep getting skipped. Drag it below and watch quality trade against reach.</P>
        </FadeIn>
        <Figure caption="A real model, run live on six people. Drag the dial and watch match quality trade against reach for the under-served.">
          <TradeoffFrontier />
        </Figure>
        <FadeIn>
          <P>One detail here took me a while to get right. The fairness bonus has to reward a pairing, not a person. The obvious version is &ldquo;give lonely people extra points,&rdquo; and it does nothing. With a fixed number of introductions per person, a per-person bonus cancels out in the math and changes the result by zero. The bonus only works when it rewards connecting a lonely person to a desirable one. It has to be about the pair. You only catch that by writing the objective down and checking it.</P>
        </FadeIn>
        <FadeIn>
          <P>Underneath all of it, the thing we optimize for is still a stable, mutual match. Gale&ndash;Shapley&apos;s guarantee is the target. Fairness and the weekly cap sit on top of it, not in place of it.</P>
        </FadeIn>
      </Section>

      {/* 06 */}
      <Section muted>
        <FadeIn><Eyebrow num="06" tag="Honesty" /></FadeIn>
        <FadeIn><H2>Show the tradeoff, do not hide it</H2></FadeIn>
        <FadeIn>
          <P>None of this is free, and I would rather be straight about that. Spreading desirable partners around costs you some raw match quality. The system measures exactly how much and reports it.</P>
        </FadeIn>
        <Figure caption="On pure stability, Gale-Shapley and Irving are hard to beat. FairMatch keeps that core and adds reach and multiple introductions, without ever failing to run.">
          <EngineComparison />
        </Figure>
        <FadeIn>
          <P>I think the honesty is part of the product. Most platforms hide what they optimize for, because if you saw it you would not like it. I would rather count the blocking pairs and put the number on screen. A product that can show you the tradeoff it picked, and why, is making a different promise about who it is for.</P>
        </FadeIn>
      </Section>

      {/* 07 */}
      <Section>
        <FadeIn><Eyebrow num="07" tag="The point" /></FadeIn>
        <FadeIn><H2>This is a product problem, not a math problem</H2></FadeIn>
        <FadeIn>
          <P>It is tempting to file this under &ldquo;neat algorithm.&rdquo; It is not really about the algorithm. That part is the easy half. B-matching and min-cost flow are standard, fast, and decades old. The hard half is the set of calls a product person actually owns. Deciding the job is allocation, not engagement. Deciding fairness belongs in the objective at all. Deciding where on the tradeoff to sit. Deciding to show the stability cost instead of burying it.</P>
        </FadeIn>
        <FadeIn>
          <P>Each of those is a judgment about who the product serves. The math just does what you tell it. The biggest decision in a matching product is not how you compute the matches. It is what you chose to optimize for in the first place. Get that wrong and a brilliant algorithm will efficiently give you the wrong result. Get it right and a basic solver gives you a market people can trust.</P>
        </FadeIn>
        {article.takeaways && (
          <FadeIn className="mt-10"><Takeaways items={article.takeaways} /></FadeIn>
        )}
      </Section>

      <RelatedArticles currentHref={HREF} />
    </main>
  )
}

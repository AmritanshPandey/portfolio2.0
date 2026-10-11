import { notFound } from "next/navigation"
import { articleItems } from "@/lib/data"
import { ArticleHeader, RelatedArticles } from "@/components/articles/article-ui"
import { FadeIn } from "@/components/shared/fade-in"
import { ReadingProgress } from "@/components/shared/reading-progress"
import {
  LineageStrip,
  DiscoveryVsAllocation,
  ConcentrationDemo,
  TradeoffFrontier,
  EngineComparison,
  WeeklyLoop,
} from "@/components/shared/matching-lab"

const HREF = "/articles/dating-app-allocation"

function getArticle() {
  const article = articleItems.find((item) => item.href === HREF)
  if (!article) notFound()
  return article
}

function Section({ children }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <section className="border-b border-border/40 bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">{children}</div>
    </section>
  )
}

function Eyebrow({ num, tag }: { num: string; tag: string }) {
  return (
    <div className="mb-4 font-mono text-[12px] text-muted-foreground">
      <span className="tabular-nums text-muted-foreground">{num}</span>
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
  return <ArticleHeader article={getArticle()} />
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
            <span className="text-[11px] font-mono font-bold text-accent mt-1 w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <p className="text-[14px] md:text-[15px] leading-[1.65] text-foreground/75">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const article = getArticle()

  return (
    <div>
      <ReadingProgress />
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
          <P>Ask a founder what their app does and you hear &ldquo;we help you find the right person.&rdquo; Watch the product and it does something smaller: it helps you browse people fast. Browsing is discovery, and we are very good at it now. Nobody built the part that decides who you should actually meet this week.</P>
        </FadeIn>
        <Figure caption="Discovery is a search problem. Allocation is about who gets the scarce thing. We solved the first one and hoped the second would sort itself out.">
          <DiscoveryVsAllocation />
        </Figure>
        <FadeIn>
          <P>Allocation is hard because attention runs out. When an app hands it out badly, nothing visibly breaks. Almost all of it flows to a few very desirable people, and everyone else swipes into nothing. The dashboards look healthy. The market underneath does not.</P>
        </FadeIn>
        <Quote>Discovery means making the haystack easy to search. Allocation means deciding who gets the scarce thing. We spent ten years on the first one and barely touched the second.</Quote>
      </Section>

      {/* 02 */}
      <Section muted>
        <FadeIn><Eyebrow num="02" tag="The objective" /></FadeIn>
        <FadeIn><H2>Optimizing for engagement works against the user</H2></FadeIn>
        <FadeIn>
          <P>Here is the uncomfortable part. Tuning for engagement (time in app, swipes, daily actives) picks a goal that fights what the user wants, which is to leave. An app built to maximize swiping is built to keep you single but busy.</P>
        </FadeIn>
        <Figure caption="An engagement goal drifts toward concentration on its own. The most wanted few soak up almost everything. Capping attention is what spreads it back.">
          <ConcentrationDemo />
        </Figure>
        <FadeIn>
          <P>This is an incentive problem, not a bug. It is where an engagement goal lands, because the most desirable profiles pull swipes from everyone else.</P>
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
          <P>Gale&ndash;Shapley (1962) is the one I build on. Only pair two people when the interest runs both ways, so no match is great for one and miserable for the other. It also guarantees stability: no two people would both rather drop their matches for each other. That guarantee is still the core of what I do.</P>
        </FadeIn>
        <FadeIn>
          <P>What it does not handle is the shape of the problem. It gives each person one partner, once; real matchmaking is a few introductions a week. It needs two clean sides, and it lets the most desirable people take everything. Irving (1985) fixed the two-sides issue with one pool, but it can report that no stable matching exists. You cannot tell a paying user the system could not seat them this week.</P>
        </FadeIn>
      </Section>

      {/* 04 */}
      <Section muted>
        <FadeIn><Eyebrow num="04" tag="The new question" /></FadeIn>
        <FadeIn><H2>I changed the question, not the engine</H2></FadeIn>
        <FadeIn>
          <P>So I changed the question. Not &ldquo;what is the one stable pairing of everyone,&rdquo; but: given how compatible people are, and how fairly each person has been treated so far, who should meet whom this week?</P>
        </FadeIn>
        <FadeIn>
          <P>That turns one pairing into a weekly allocation of a few introductions, where last week feeds this week. And because it is an optimization with limits, it always returns something. It can fail to find a great match. It cannot fail to run.</P>
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
          <P>It filters: hard rules like age, location, and dealbreakers decide who is possible. It scores every pair so a match only counts when it is good for both sides, which is Gale&ndash;Shapley&apos;s mutuality kept as is. It balances, steering desirable partners toward people who have been under-served. And it introduces: everyone gets the same few introductions, and next week the loop runs again.</P>
        </FadeIn>
        <FadeIn>
          <P>The balance step has one dial, lambda. At zero it only cares about compatibility. Turn it up and it pushes sought-after people toward those who keep getting skipped. Drag it below and watch quality trade against reach.</P>
        </FadeIn>
        <Figure caption="A real model, run live on six people. Drag the dial and watch match quality trade against reach for the under-served.">
          <TradeoffFrontier />
        </Figure>
        <FadeIn>
          <P>One detail took me a while. The fairness bonus has to reward a pairing, not a person. &ldquo;Give lonely people extra points&rdquo; does nothing: with a fixed number of introductions each, a per-person bonus cancels out. It only works when it rewards connecting a lonely person with a desirable one. You only catch that by writing the objective down.</P>
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
          <P>I think the honesty is part of the product. Most platforms hide what they optimize for. I would rather count the blocking pairs and put the number on screen. A product that shows the tradeoff it picked is making a different promise about who it is for.</P>
        </FadeIn>
      </Section>

      {/* 07 */}
      <Section>
        <FadeIn><Eyebrow num="07" tag="The point" /></FadeIn>
        <FadeIn><H2>This is a product problem, not a math problem</H2></FadeIn>
        <FadeIn>
          <P>It is tempting to file this under &ldquo;neat algorithm.&rdquo; But the algorithm is the easy half: b-matching and min-cost flow are standard and decades old. The hard half is the calls a product person owns: that the job is allocation, not engagement; that fairness belongs in the objective; where to sit on the tradeoff; and whether to show the stability cost.</P>
        </FadeIn>
        <FadeIn>
          <P>The math does what you tell it. The biggest decision in a matching product is what you optimize for. Get that wrong and a brilliant algorithm efficiently gives you the wrong result. Get it right and a basic solver gives you a market people can trust.</P>
        </FadeIn>
        {article.takeaways && (
          <FadeIn className="mt-10"><Takeaways items={article.takeaways} /></FadeIn>
        )}
      </Section>

      <RelatedArticles currentHref={HREF} />
    </div>
  )
}

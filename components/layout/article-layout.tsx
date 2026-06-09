import { notFound } from "next/navigation"
import { CategoryPill, ReadingMeta, ArticleProse } from "@/components/articles/article-ui"
import { ArticleCard } from "@/components/shared/article-card"
import { articleItems } from "@/lib/data"
import type { ArticleSection } from "@/lib/types/content"

// ─── helpers ─────────────────────────────────────────────────────────────────

function getArticle(slug: string) {
  return articleItems.find(a => a.href === `/articles/${slug}`) ?? null
}

function getRelated(currentHref: string) {
  return articleItems.filter(a => a.href !== currentHref).slice(0, 3)
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function ArticleHero({
  title,
  description,
  category,
  readTime,
  date,
  tags,
  accent,
}: {
  title:       string
  description: string
  category?:   string
  readTime?:   string
  date?:       string
  tags?:       string[]
  accent?:     string
}) {
  return (
    <header className="relative overflow-hidden border-b border-border/45 bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-70"
        style={{ background: accent ?? "linear-gradient(135deg,#ea580c,#c2410c)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.42) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.12,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/10 via-background/40 to-background" />

      <div className="relative mx-auto max-w-5xl px-6 pb-14 pt-32 md:pb-16 md:pt-40">
        <div className="max-w-[760px]">
          <div className="flex flex-wrap items-center gap-3">
            {category ? <CategoryPill className="bg-background/70 backdrop-blur">{category}</CategoryPill> : null}
            <ReadingMeta date={date} readTime={readTime} />
          </div>

          <h1 className="mt-6 text-[34px] font-semibold leading-[1.08] text-foreground md:text-[52px]">
            {title}
          </h1>

          <p className="mt-5 max-w-[62ch] text-[17px] leading-8 text-muted-foreground md:text-[19px]">
            {description}
          </p>

          {tags && tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map(tag => (
                <CategoryPill key={tag}>{tag}</CategoryPill>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

// ─── Section renderers ────────────────────────────────────────────────────────

function PullQuote({ body }: { body: string }) {
  return (
    <blockquote className="relative my-12 border-l-2 border-orange-500/70 pl-6">
      <p className="text-[22px] font-medium leading-[1.55] text-foreground/90 md:text-[26px]">
        {body}
      </p>
    </blockquote>
  )
}

function Callout({ body }: { body: string }) {
  return (
    <aside className="relative my-10 overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-5 md:p-6">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500/60" />
      <p className="pl-2 text-[15px] leading-7 text-foreground/82">
        {body}
      </p>
    </aside>
  )
}

function ProseSection({ section }: { section: ArticleSection }) {
  const paragraphs = (section.body ?? "").split("\n\n").filter(Boolean)

  return (
    <section className="space-y-5">
      {section.heading && (
        <h2 className="mt-14 flex items-center gap-3 text-[24px] font-semibold leading-[1.2] text-foreground md:text-[28px]">
          <span className="h-[2px] w-5 flex-shrink-0 rounded-full bg-orange-500" />
          {section.heading}
        </h2>
      )}
      {paragraphs.map((para, i) => (
        <p key={i} className="text-[17px] leading-[1.85] text-foreground/82">
          {para}
        </p>
      ))}
    </section>
  )
}

// ─── Image visual components ──────────────────────────────────────────────────

/**
 * image-full — wide bleed that punches outside the prose column.
 * Good for panoramic screenshots, full interface reveals, or any image that
 * benefits from more horizontal breathing room.
 */
function ImageFull({ section }: { section: ArticleSection }) {
  return (
    <figure className="my-12">
      <div className="-mx-6 md:-mx-20 lg:-mx-36 overflow-hidden rounded-xl border border-border/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={section.src ?? ""}
          alt={section.alt ?? ""}
          className="w-full h-auto block"
        />
      </div>
      {(section.caption || section.source) && (
        <figcaption className="mt-3 text-center text-[12px] text-muted-foreground px-6">
          {section.caption}
          {section.source && (
            <span className="ml-2 opacity-60">· {section.source}</span>
          )}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * image-captioned — prose-width image with a caption and optional source credit.
 * The arrow marker keeps it consistent with the article's visual language.
 * Best for illustrations, diagrams, and annotated screenshots.
 */
function ImageCaptioned({ section }: { section: ArticleSection }) {
  return (
    <figure className="my-10">
      <div className="overflow-hidden rounded-xl border border-border/30 bg-muted/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={section.src ?? ""}
          alt={section.alt ?? ""}
          className="w-full h-auto block"
        />
      </div>
      {(section.caption || section.source) && (
        <figcaption className="mt-3 flex gap-2 items-start">
          <span className="text-orange-500 flex-shrink-0 text-[13px] leading-5">↑</span>
          <span className="text-[13px] text-muted-foreground leading-relaxed">
            {section.caption}
            {section.source && (
              <cite className="not-italic ml-1.5 opacity-60">— {section.source}</cite>
            )}
          </span>
        </figcaption>
      )}
    </figure>
  )
}

/**
 * image-compare — two images side by side with before/after badge labels.
 * Use for design iterations, A/B decisions, or any "this vs that" moment.
 */
function ImageCompare({ section }: { section: ArticleSection }) {
  const b = section.before
  const a = section.after
  if (!b && !a) return null

  return (
    <figure className="my-10">
      <div className="grid grid-cols-2 gap-3">
        {b && (
          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-xl border border-border/30 bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.src} alt={b.alt ?? ""} className="w-full h-auto block" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                {b.label ?? "Before"}
              </span>
            </div>
          </div>
        )}
        {a && (
          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-xl border border-orange-500/25 bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.src} alt={a.alt ?? ""} className="w-full h-auto block" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-orange-500/80 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                {a.label ?? "After"}
              </span>
            </div>
          </div>
        )}
      </div>
      {section.caption && (
        <figcaption className="mt-3 text-center text-[12px] text-muted-foreground">
          {section.caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * image-grid — 2 or 3 column grid of images, each with an optional caption.
 * Good for process documentation, multiple states, or a shot sequence.
 */
function ImageGrid({ section }: { section: ArticleSection }) {
  const cols = section.columns ?? 2
  const images = section.images ?? []
  if (images.length === 0) return null

  return (
    <figure className="my-10">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {images.map((img, i) => (
          <div key={i} className="space-y-1.5">
            <div className="overflow-hidden rounded-xl border border-border/30 bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt ?? ""}
                className="w-full h-auto block object-cover"
              />
            </div>
            {img.caption && (
              <p className="text-[11px] text-muted-foreground text-center leading-snug">
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>
      {section.caption && (
        <figcaption className="mt-3 text-center text-[12px] text-muted-foreground">
          {section.caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * image-float — image pinned to one side with prose flowing alongside it.
 * side="left" (default) or side="right". On mobile the image stacks above the text.
 * The body field is required for the text column; heading is optional.
 */
function ImageFloat({ section }: { section: ArticleSection }) {
  const isRight = section.side === "right"
  const paragraphs = (section.body ?? "").split("\n\n").filter(Boolean)

  return (
    <div
      className={`my-10 flex flex-col gap-5 items-start ${
        isRight ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Image column */}
      <figure className="w-full md:w-[42%] flex-shrink-0 space-y-2">
        <div className="overflow-hidden rounded-xl border border-border/30 bg-muted/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={section.src ?? ""}
            alt={section.alt ?? ""}
            className="w-full h-auto block"
          />
        </div>
        {section.caption && (
          <figcaption className="text-[11px] text-muted-foreground leading-relaxed">
            {section.caption}
          </figcaption>
        )}
      </figure>

      {/* Text column */}
      <div className="flex-1 space-y-3">
        {section.heading && (
          <h2 className="text-[1.1rem] md:text-[1.2rem] font-semibold tracking-tight text-foreground flex items-center gap-3">
            <span className="w-4 h-[2px] bg-orange-500 rounded-full flex-shrink-0" />
            {section.heading}
          </h2>
        )}
        {paragraphs.map((para, i) => (
          <p key={i} className="text-[15px] md:text-[16px] leading-[1.8] text-foreground/80">
            {para}
          </p>
        ))}
      </div>
    </div>
  )
}

/**
 * image-device — image inside a CSS-only browser or phone frame.
 * device="browser" (default) renders a macOS-style chrome with traffic lights + URL bar.
 * device="phone" renders a rounded smartphone with a notch and home indicator.
 */
function BrowserFrame({
  src, alt, url,
}: { src: string; alt: string; url?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border/40 shadow-xl shadow-black/10">
      {/* Chrome bar */}
      <div className="bg-muted/80 dark:bg-muted/60 px-4 py-2.5 flex items-center gap-3 border-b border-border/40">
        {/* Traffic lights */}
        <div className="flex gap-1.5 flex-shrink-0">
          <div className="w-[11px] h-[11px] rounded-full bg-red-400/80" />
          <div className="w-[11px] h-[11px] rounded-full bg-yellow-400/80" />
          <div className="w-[11px] h-[11px] rounded-full bg-green-400/80" />
        </div>
        {/* URL bar */}
        <div className="flex-1 bg-background/70 rounded-md px-3 py-1 text-[11px] font-mono text-muted-foreground/70 text-center truncate min-w-0">
          {url ?? "example.com"}
        </div>
        {/* Spacer to visually balance traffic lights */}
        <div className="w-[52px] flex-shrink-0" />
      </div>
      {/* Screenshot */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-auto block" />
    </div>
  )
}

function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto w-[240px] md:w-[270px]">
      <div className="rounded-[2.8rem] border-[8px] border-foreground/20 dark:border-foreground/15 overflow-hidden shadow-2xl shadow-black/20 bg-black">
        {/* Status bar area with notch */}
        <div className="bg-black px-5 pt-3 pb-1 flex justify-center">
          <div className="w-24 h-6 bg-black rounded-full border border-white/10" />
        </div>
        {/* Screen content */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-auto block" />
        {/* Home indicator */}
        <div className="bg-black flex justify-center py-2.5">
          <div className="w-24 h-[4px] rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  )
}

function ImageDevice({ section }: { section: ArticleSection }) {
  const src = section.src ?? ""
  const alt = section.alt ?? ""
  const isPhone = section.device === "phone"

  return (
    <figure className={`my-12 ${isPhone ? "flex flex-col items-center" : ""}`}>
      {isPhone ? (
        <PhoneFrame src={src} alt={alt} />
      ) : (
        <BrowserFrame src={src} alt={alt} url={section.deviceUrl} />
      )}
      {(section.caption || section.source) && (
        <figcaption className="mt-3 text-center text-[12px] text-muted-foreground">
          {section.caption}
          {section.source && (
            <span className="ml-2 opacity-60">· {section.source}</span>
          )}
        </figcaption>
      )}
    </figure>
  )
}

// ─── Section dispatcher ───────────────────────────────────────────────────────

function ArticleSection({ section }: { section: ArticleSection }) {
  if (section.type === "quote")          return <PullQuote    body={section.body ?? ""} />
  if (section.type === "callout")        return <Callout      body={section.body ?? ""} />
  if (section.type === "image-full")     return <ImageFull     section={section} />
  if (section.type === "image-captioned") return <ImageCaptioned section={section} />
  if (section.type === "image-compare")  return <ImageCompare  section={section} />
  if (section.type === "image-grid")     return <ImageGrid     section={section} />
  if (section.type === "image-float")    return <ImageFloat    section={section} />
  if (section.type === "image-device")   return <ImageDevice   section={section} />
  return <ProseSection section={section} />
}

// ─── Takeaways ────────────────────────────────────────────────────────────────

function Takeaways({ items }: { items: string[] }) {
  return (
    <div className="my-12 rounded-2xl border border-border/50 bg-foreground/[0.02] dark:bg-white/[0.02] overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-4 h-[2px] bg-orange-500 rounded-full" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
          Key Takeaways
        </p>
      </div>
      <div className="px-6 py-5 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 items-start">
            <span className="text-[11px] font-mono font-bold text-orange-500/70 mt-1 w-5 flex-shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-[14px] md:text-[15px] leading-[1.65] text-foreground/75">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ArticleLayout({ slug }: { slug: string }) {
  const article = getArticle(slug)
  if (!article) notFound()

  const related = getRelated(article.href)

  return (
    <main>
      {/* Hero */}
      <ArticleHero
        title={article.title}
        description={article.description}
        category={article.category}
        readTime={article.readTime}
        date={article.date}
        tags={article.tags}
        accent={article.accent}
      />

      {/* Body */}
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,70ch)_220px] lg:items-start lg:py-18">
        <ArticleProse>
          {/* Intro */}
          {article.intro && (
            <p className="mb-10 border-b border-border/45 pb-10 text-[19px] font-medium leading-[1.75] text-foreground/90 md:text-[21px]">
              {article.intro}
            </p>
          )}

          {/* Sections */}
          {article.sections?.map((section, i) => (
            <ArticleSection key={i} section={section} />
          ))}

          {/* Takeaways */}
          {article.takeaways && article.takeaways.length > 0 && (
            <Takeaways items={article.takeaways} />
          )}
        </ArticleProse>

        <aside className="hidden lg:sticky lg:top-28 lg:block">
          <div className="rounded-2xl border border-border/55 bg-card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Reading
            </p>
            <div className="mt-4 space-y-4">
              {article.category ? (
                <div>
                  <p className="text-[11px] text-muted-foreground">Category</p>
                  <p className="mt-1 text-[13px] font-medium text-foreground">{article.category}</p>
                </div>
              ) : null}
              <ReadingMeta date={article.date} readTime={article.readTime} className="flex-col items-start gap-2" />
              {article.tags && article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border/45 bg-foreground/[0.015] dark:bg-white/[0.015]" aria-labelledby="more-articles">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-7 flex items-center gap-4">
              <div className="h-px w-6 bg-orange-500/70" />
              <h2 id="more-articles" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                More articles
              </h2>
              <div className="h-px flex-1 bg-border/60" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(a => (
                <ArticleCard
                  key={a.href}
                  title={a.title}
                  description={a.description}
                  href={a.href}
                  date={a.date}
                  category={a.category}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

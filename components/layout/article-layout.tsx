import { notFound } from "next/navigation"
import {
  ArticleHeader,
  ArticleProse,
  RelatedArticles,
} from "@/components/articles/article-ui"
import { ReadingProgress } from "@/components/shared/reading-progress"
import { Reveal } from "@/components/shared/motion"
import { articleItems } from "@/lib/data"
import type { ArticleSection } from "@/lib/types/content"

// ─── helpers ─────────────────────────────────────────────────────────────────

function getArticle(slug: string) {
  return articleItems.find(a => a.href === `/articles/${slug}`) ?? null
}

// ─── Section renderers ────────────────────────────────────────────────────────

function PullQuote({ body }: { body: string }) {
  return (
    <blockquote className="relative my-14 px-6 md:px-10">
      <span
        aria-hidden
        className="absolute -top-7 left-0 select-none text-[88px] font-black leading-none text-accent/25"
      >
        &ldquo;
      </span>
      <p className="text-[22px] font-medium leading-[1.55] tracking-[-0.01em] text-foreground/90 md:text-[27px]">
        {body}
      </p>
    </blockquote>
  )
}

function Callout({ body }: { body: string }) {
  return (
    <aside className="relative my-10 overflow-hidden rounded-2xl border border-accent/20 bg-accent/[0.04] p-5 md:p-6">
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
          <span className="h-[2px] w-5 flex-shrink-0 rounded-full bg-accent" />
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
          loading="lazy"
          decoding="async"
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
          loading="lazy"
          decoding="async"
          className="w-full h-auto block"
        />
      </div>
      {(section.caption || section.source) && (
        <figcaption className="mt-3 flex gap-2 items-start">
          <span className="text-accent flex-shrink-0 text-[13px] leading-5">↑</span>
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
              <img src={b.src} alt={b.alt ?? ""} loading="lazy" decoding="async" className="w-full h-auto block" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                {b.label ?? "Before"}
              </span>
            </div>
          </div>
        )}
        {a && (
          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-xl border border-accent/25 bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.src} alt={a.alt ?? ""} loading="lazy" decoding="async" className="w-full h-auto block" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-accent/80 text-[10px] font-bold uppercase tracking-wider text-background backdrop-blur-sm">
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
                loading="lazy"
                decoding="async"
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
            loading="lazy"
            decoding="async"
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
            <span className="w-4 h-[2px] bg-accent rounded-full flex-shrink-0" />
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
      <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-auto block" />
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
        <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-auto block" />
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
        <div className="w-4 h-[2px] bg-accent rounded-full" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          Key Takeaways
        </p>
      </div>
      <div className="px-6 py-5 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 items-start">
            <span className="text-[11px] font-mono font-bold text-accent/70 mt-1 w-5 flex-shrink-0">
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

  return (
    <main>
      <ReadingProgress />
      <ArticleHeader article={article} />

      {/* Body — a measured reading column (~72ch); wide visuals punch out */}
      <div className="mx-auto max-w-[760px] px-6 py-14 lg:py-20">
        <ArticleProse>
          {/* Intro */}
          {article.intro && (
            <Reveal as="p" y={20} className="mb-10 border-b border-border/45 pb-10 text-[19px] font-medium leading-[1.75] text-foreground/90 md:text-[21px]">
              {article.intro}
            </Reveal>
          )}

          {/* Sections */}
          {article.sections?.map((section, i) => (
            <Reveal key={i} y={22} start="top 92%">
              <ArticleSection section={section} />
            </Reveal>
          ))}

          {/* Takeaways */}
          {article.takeaways && article.takeaways.length > 0 && (
            <Reveal y={22} start="top 92%">
              <Takeaways items={article.takeaways} />
            </Reveal>
          )}
        </ArticleProse>
      </div>

      <RelatedArticles currentHref={article.href} />
    </main>
  )
}

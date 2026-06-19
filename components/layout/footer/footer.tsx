import Link from "next/link"
import type { CSSProperties } from "react"
import {
  IconArrowUpRight,
  IconBrandBehance,
  IconBrandDribbble,
  IconBrandGithub,
  IconBrandLinkedin,
  IconFileText,
  IconFolder,
} from "@tabler/icons-react"
import { ShaderHaze } from "@/components/shared/shader-haze"
import { CopyEmail } from "./copy-email"

const EMAIL = "amritansh.pandey6@gmail.com"

const FOOTER_LINKS = [
  {
    label: "Work",
    href: "/#work",
    icon: IconFolder,
    external: false,
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    icon: IconFileText,
    external: false,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/amritansh-pandey-bb5b3087",
    icon: IconBrandLinkedin,
    external: true,
    brandColor: "#0A66C2",
    brandGlow: "rgba(10, 102, 194, 0.42)",
  },
  {
    label: "GitHub",
    href: "https://github.com/AmritanshPandey",
    icon: IconBrandGithub,
    external: true,
    brandColor: "#f0f6fc",
    brandGlow: "rgba(240, 246, 252, 0.32)",
  },
  {
    label: "Behance",
    href: "https://www.behance.net/amritanshpandey",
    icon: IconBrandBehance,
    external: true,
    brandColor: "#1769FF",
    brandGlow: "rgba(23, 105, 255, 0.42)",
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/amrit10",
    icon: IconBrandDribbble,
    external: true,
    brandColor: "#EA4C89",
    brandGlow: "rgba(234, 76, 137, 0.42)",
  },
]

function FooterLink({
  label,
  href,
  icon: Icon,
  external,
  brandColor,
  brandGlow,
}: (typeof FOOTER_LINKS)[number]) {
  const isSocial = Boolean(brandColor)
  const style = isSocial
    ? ({
        "--footer-link-brand": brandColor,
        "--footer-link-glow": brandGlow,
      } as CSSProperties)
    : undefined

  const className = `
    group ${isSocial ? "footer-social-link" : ""} inline-flex min-h-10 items-center gap-2 rounded-full border border-border/70
    bg-background/50 px-3.5 text-sm font-medium text-muted-foreground
    backdrop-blur-sm transition-all duration-200
    hover:border-accent/40 hover:bg-background hover:text-foreground
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
  `

  const content = (
    <>
      <Icon
        size={15}
        strokeWidth={1.8}
        className={isSocial ? "footer-social-icon transition-[color,filter] duration-200" : undefined}
        aria-hidden="true"
      />
      <span>{label}</span>
      {external ? (
        <IconArrowUpRight
          size={13}
          strokeWidth={2}
          className="text-muted-foreground/60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden="true"
        />
      ) : null}
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className} style={style}  target="_blank">
      {content}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted/50 dark:bg-neutral-950">
      <ShaderHaze lightAlpha={0.16} darkAlpha={0.28} speed={0.55} />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/70 dark:from-neutral-950/10 dark:to-neutral-950/80" />

      <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-18">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="max-w-3xl">
         
            <p className=" text-[16px] leading-7 text-muted-foreground md:text-base">
              I work where product logic, interface craft, and financial systems meet. If the work here
              connects with something you are building, I am easy to reach.
            </p>
          </div>

          <div className="flex flex-col gap-5 lg:items-end">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:justify-end">
              <CopyEmail email={EMAIL} />
              <Link
                href="/#work"
                className="
                  inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full
                  bg-accent text-white dark:bg-accent/90 dark:text-neutral-950 px-5 text-sm font-semibold
                  transition-colors duration-200 hover:bg-accent/90 dark:hover:bg-accent/80
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  sm:w-auto
                "
              >
                View work
                <IconArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>

          
          </div>
        </div>

        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <nav aria-label="Footer links" className="flex flex-wrap gap-2.5">
            {FOOTER_LINKS.map(link => (
              <FooterLink key={link.label} {...link} />
            ))}
          </nav>

          <div className="flex flex-col gap-2 text-xs text-muted-foreground md:items-end">
            <p>© {new Date().getFullYear()} Amritansh Pandey</p>
           
          </div>
        </div>
      </div>
    </footer>
  )
}

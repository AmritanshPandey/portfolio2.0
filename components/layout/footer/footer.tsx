import Link from "next/link"
import {
  IconArrowUpRight,
  IconBrandBehance,
  IconBrandDribbbleFilled,
  IconBrandGithubFilled,
  IconBrandLinkedinFilled,
} from "@tabler/icons-react"
import { CopyEmail } from "./copy-email"
import { FooterSea } from "./footer-sea"
import { EMAIL, EMAIL_HREF, LINKEDIN_HREF, RESUME_HREF } from "@/lib/contact"

interface FooterLinkItem {
  label: string
  href: string
  external: boolean
  /** A network's own mark, in its own colour (GitHub's is white on the ink). */
  logo?: typeof IconBrandGithubFilled
  brand?: string
}

const FOOTER_LINKS: FooterLinkItem[] = [
  { label: "Work", href: "/#work", external: false },
  // A file, not a route: a plain link, so it isn't prefetched as a page.
  { label: "Resume", href: RESUME_HREF, external: true },
  { label: "LinkedIn", href: LINKEDIN_HREF, external: true, logo: IconBrandLinkedinFilled, brand: "#0A66C2" },
  { label: "GitHub", href: "https://github.com/AmritanshPandey", external: true, logo: IconBrandGithubFilled, brand: "var(--foreground)" },
  { label: "Behance", href: "https://www.behance.net/amritanshpandey", external: true, logo: IconBrandBehance, brand: "#1769FF" },
  { label: "Dribbble", href: "https://dribbble.com/amrit10", external: true, logo: IconBrandDribbbleFilled, brand: "#EA4C89" },
]

function FooterLink({ label, href, external, logo: Logo, brand }: FooterLinkItem) {
  const className =
    "group inline-flex items-center gap-1 text-[15px] font-medium text-foreground link-underline"
  const content = (
    <>
      {Logo && <Logo size={17} aria-hidden className="mr-1 shrink-0" style={{ color: brand }} />}
      {label}
      {external && (
        <IconArrowUpRight
          size={14}
          stroke={2}
          aria-hidden
          className="text-muted-foreground transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
        />
      )}
    </>
  )
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
  ) : (
    <Link href={href} className={className}>{content}</Link>
  )
}

/**
 * The closing line of the ledger, set on ink: the sign-off large and the
 * direct way in beside it (write, or copy the address), then the links and
 * the colophon on a hairline, and under them the sea the page runs out into.
 */
export default function Footer() {
  return (
    // Set on the ink band (.ink-band): every page closes on its darkest
    // moment, with the way in at the centre of it.
    // A half beat of paper above it, so the last section has room to end.
    <footer
      className="ink-band relative bg-background text-foreground"
      style={{ marginTop: "calc(var(--section-y) / 2)", paddingTop: "var(--section-y)" }}
    >
      <div className="ledger pb-10">
        <div aria-hidden data-settle="rule" className="rule-ink" />

        <div className="ledger-grid mt-6 gap-y-10 md:mt-10">
          <p
            data-settle
            className="col-span-12 max-w-[26ch] text-[clamp(1.75rem,3.4vw,3.5rem)] font-[760] leading-[1.02] tracking-[-0.035em] [font-variation-settings:'wdth'_110] lg:col-span-8 text-balance"
          >
            If the work here connects with something you are building, I am easy to reach.
          </p>

          <div
            data-settle
            style={{ ["--i" as string]: 1 }}
            className="col-span-12 flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-stretch lg:pt-2"
          >
            <a href={EMAIL_HREF} className="btn-ink">
              Start a conversation
              <IconArrowUpRight size={16} stroke={2} aria-hidden className="btn-arrow" />
            </a>
            <CopyEmail email={EMAIL} />
          </div>
        </div>

        <div className="rule-hair mt-16 md:mt-24" />

        <div className="flex flex-col gap-6 pt-6 md:flex-row md:items-baseline md:justify-between">
          <nav aria-label="Footer links" className="flex flex-wrap gap-x-7 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <FooterLink key={link.label} {...link} />
            ))}
          </nav>
          <p className="ledger-label">© {new Date().getFullYear()} Amritansh Pandey</p>
        </div>
      </div>
      <FooterSea />
    </footer>
  )
}

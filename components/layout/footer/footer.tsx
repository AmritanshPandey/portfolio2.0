import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"
import { CopyEmail } from "./copy-email"
import { EMAIL, LINKEDIN_HREF, RESUME_HREF } from "@/lib/contact"

const FOOTER_LINKS = [
  { label: "Work", href: "/#work", external: false },
  // A file, not a route: a plain link, so it isn't prefetched as a page.
  { label: "Resume", href: RESUME_HREF, external: true },
  { label: "LinkedIn", href: LINKEDIN_HREF, external: true },
  { label: "GitHub", href: "https://github.com/AmritanshPandey", external: true },
  { label: "Behance", href: "https://www.behance.net/amritanshpandey", external: true },
  { label: "Dribbble", href: "https://dribbble.com/amrit10", external: true },
]

function FooterLink({ label, href, external }: (typeof FOOTER_LINKS)[number]) {
  const className =
    "group inline-flex items-center gap-1 text-[15px] font-medium text-foreground link-underline"
  const content = (
    <>
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
 * The closing line of the ledger: the sign-off set large, the two ways in
 * beside it, then the links and the colophon on a hairline.
 */
export default function Footer() {
  return (
    <footer className="relative bg-background text-foreground" style={{ paddingTop: "var(--section-y)" }}>
      <div className="ledger pb-10">
        <div aria-hidden data-settle="rule" className="rule-ink" />

        <div className="ledger-grid mt-6 gap-y-10 md:mt-10">
          <p
            data-settle
            className="col-span-12 max-w-[26ch] text-[clamp(1.75rem,3.4vw,3.5rem)] font-[760] leading-[1.02] tracking-[-0.035em] [font-variation-settings:'wdth'_110] lg:col-span-8 text-balance"
          >
            I work where product logic, interface craft, and financial systems meet. If the work here
            connects with something you are building, I am easy to reach.
          </p>

          <div
            data-settle
            style={{ ["--i" as string]: 1 }}
            className="col-span-12 flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-stretch lg:pt-2"
          >
            <CopyEmail email={EMAIL} />
            <Link href="/#work" className="btn-line">
              View work
              <IconArrowUpRight size={16} stroke={2} aria-hidden className="btn-arrow" />
            </Link>
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
    </footer>
  )
}

import { IconArrowUpRight } from "@tabler/icons-react"
import { advisoryItems, teachingItems, menteeItems } from "@/lib/data"

import { EMAIL, EMAIL_HREF } from "@/lib/contact"

/**
 * Advisory, compressed to its evidence.
 *
 * This is a side door for a "maybe" audience, so it stays short: one proof
 * line a visitor can actually check on the left with the ask under it, and
 * the people and engagements as ruled line items on the right, the same
 * grammar as the rest of the sheet. The Section header carries the framing;
 * nothing here repeats it.
 */
const ROW =
  "group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-border py-3.5 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto]"

function Row({ href, name, detail }: { href: string; name: string; detail: string }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${ROW} rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50`}>
        <span className="text-[15px] leading-snug text-foreground md:text-base">{name}</span>
        <span className="col-start-1 row-start-2 text-[14px] leading-snug text-muted-foreground sm:col-start-2 sm:row-start-1 sm:text-[15px]">
          {detail}
        </span>
        <IconArrowUpRight
          size={14}
          stroke={2}
          aria-hidden
          className="row-span-2 text-muted-foreground transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none sm:row-span-1"
        />
      </a>
    </li>
  )
}

export default function AdvisorySection() {
  const engagements = [...advisoryItems, ...teachingItems]

  return (
    <div className="ledger-grid gap-y-12">
      {/* The proof, and the ask kept secondary: the footer carries the
          page's main call to start a conversation. */}
      <div data-settle className="col-span-12 flex flex-col gap-8 lg:col-span-4">
        <p className="text-[clamp(1.25rem,1.7vw,1.625rem)] font-[560] leading-[1.28] tracking-[-0.018em] text-foreground text-pretty">
          Designers I&apos;ve mentored now work at Microsoft, Zomato, Aleph
          Alpha, and Mastercard.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={EMAIL_HREF}
            className="btn-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Ask about advisory
            <IconArrowUpRight size={16} stroke={2} aria-hidden className="btn-arrow" />
          </a>
          <span className="ledger-label">{EMAIL}</span>
        </div>
      </div>

      {/* Checkable people, then the engagements: one ruled line each. */}
      <div data-settle style={{ ["--i" as string]: 1 }} className="col-span-12 space-y-12 lg:col-span-7 lg:col-start-6">
        <div>
          <p className="ledger-label mb-3">Mentored</p>
          <ul className="border-t border-border">
            {menteeItems.map((m) => (
              <Row key={m.name} href={m.link} name={m.name} detail={m.company.replace("•", "at")} />
            ))}
          </ul>
        </div>
        <div>
          <p className="ledger-label mb-3">Advised and taught</p>
          <ul className="border-t border-border">
            {engagements.map((item) => {
              const cut = item.title.indexOf(",")
              return (
                <Row
                  key={item.title}
                  href={item.link}
                  name={cut === -1 ? item.title : item.title.slice(0, cut)}
                  detail={cut === -1 ? "" : item.title.slice(cut + 1).trim()}
                />
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

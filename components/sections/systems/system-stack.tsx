import { Fragment } from "react"
import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import { partnerBankCase, partnerBankLayers } from "@/lib/data/partnerbank"
import { TokenSkin } from "./token-skin"

const ARGUMENT = [
  { term: "Constraint", text: partnerBankCase.constraint },
  { term: "Decision", text: partnerBankCase.decision },
  { term: "Trade-off", text: partnerBankCase.tradeoff },
  { term: "Outcome", text: partnerBankCase.outcome, strong: true },
] as const

/**
 * One system, taken apart: PartnerBank's four layers as ruled line items, the
 * brand layer marked in the accent with the per-bank token files that feed
 * it, which re-skin a live account card (<TokenSkin>, the one client island),
 * and beside them the case for the design (constraint, decision, trade-off,
 * outcome). Rows settle in like the rest of the page.
 */
export function SystemStack() {
  return (
    <div className="ledger-grid gap-y-12">
      <ol className="col-span-12 lg:col-span-7">
        {partnerBankLayers.map((layer, i) => (
          <li
            key={layer.num}
            data-settle
            style={{ ["--i" as string]: i }}
            className={clsx(
              "relative grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 border-t border-border py-6",
              i === partnerBankLayers.length - 1 && "border-b",
            )}
          >
            {layer.isCore && <span aria-hidden className="absolute -left-px top-0 h-full w-[2px] bg-accent" />}
            {/* .ledger-label sets its own colour; the inner span carries ours. */}
            <span className="ledger-label pt-[0.35em]">
              <span className={layer.isCore ? "text-accent" : "text-foreground"}>{layer.num}</span>
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[clamp(1.125rem,1.6vw,1.5rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground">
                  {layer.title}
                </h3>
                {layer.isCore && (
                  <span className="ledger-label">
                    <span className="text-accent">brand lives here</span>
                  </span>
                )}
              </div>
              <p className="mt-1.5 max-w-[52ch] text-[15px] leading-[1.55] text-muted-foreground">{layer.body}</p>
              {layer.meta && <p className="ledger-label mt-2">{layer.meta.join(" · ")}</p>}
              {layer.isCore && <TokenSkin />}
            </div>
          </li>
        ))}
      </ol>

      <div className="col-span-12 lg:col-span-4 lg:col-start-9">
        <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-5 text-[15px] leading-[1.55]">
          {ARGUMENT.map((entry, i) => (
            <Fragment key={entry.term}>
              <dt data-settle style={{ ["--i" as string]: i + 1 }} className="ledger-label pt-[0.2em]">
                <span className={"strong" in entry ? "text-accent" : undefined}>{entry.term}</span>
              </dt>
              <dd
                data-settle
                style={{ ["--i" as string]: i + 1 }}
                className={"strong" in entry ? "text-foreground tabular-nums" : "text-muted-foreground"}
              >
                {entry.text}
              </dd>
            </Fragment>
          ))}
        </dl>
        <Link
          href={partnerBankCase.href}
          className="group/cta link-underline mt-8 inline-flex items-center gap-1.5 text-[15px] font-semibold text-foreground"
        >
          Read the PartnerBank case study
          <IconArrowUpRight
            size={15}
            stroke={2}
            aria-hidden
            className="transition-transform duration-200 group-hover/cta:translate-x-[2px] group-hover/cta:-translate-y-[2px]"
          />
        </Link>
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EMAIL_HREF } from "@/lib/contact"
import { GATE_COOKIE, hasAccess, safeNext } from "@/lib/gate"
import { UnlockForm } from "./unlock-form"

// Root layout's openGraph still applies, so a link shared to a locked visitor
// (or a preview bot) still shows the site's card.
export const metadata: Metadata = {
  title: "Private portfolio",
  robots: { index: false, follow: false },
}

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const { next } = await searchParams
  const cookie = (await cookies()).get(GATE_COOKIE)?.value
  const env = { password: process.env.SITE_PASSWORD, nodeEnv: process.env.NODE_ENV }
  if (await hasAccess(cookie, env)) redirect(safeNext(next))

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-[28rem]">
        <span aria-hidden className="block h-3 w-3 bg-accent" />
        <h1 className="mt-6 text-[clamp(2.25rem,6vw,3rem)] font-[800] leading-[0.95] tracking-[-0.04em] text-foreground [font-variation-settings:'wdth'_112]">
          Amritansh Pandey
        </h1>
        <p className="ledger-label mt-3">Senior UX Designer</p>
        <div aria-hidden className="rule-ink mt-8" />
        <p className="mt-6 text-[16px] leading-[1.55] text-foreground/80 text-pretty">
          This portfolio is shared privately. Use the password from my email or resume, or ask me for access.
        </p>
        <div className="mt-8">
          <UnlockForm next={safeNext(next)} />
        </div>
        <a
          href={EMAIL_HREF}
          className="link-underline mt-3 inline-block text-[15px] font-semibold text-foreground"
        >
          Ask for access
        </a>
      </div>
    </div>
  )
}

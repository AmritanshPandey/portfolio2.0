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
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const cookie = (await cookies()).get(GATE_COOKIE)?.value
  const env = { password: process.env.SITE_PASSWORD, nodeEnv: process.env.NODE_ENV }
  if (await hasAccess(cookie, env)) redirect(safeNext(next))

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-[26rem]">
        <h1 className="type-page-title text-foreground">Amritansh Pandey</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">Senior UX Designer</p>
        <p className="mt-6 text-[15px] leading-relaxed text-foreground/80 text-pretty">
          This portfolio is shared privately. Use the password from my email or resume, or ask me for access.
        </p>
        <div className="mt-8">
          <UnlockForm next={safeNext(next)} />
        </div>
        <a
          href={EMAIL_HREF}
          className="mt-2 inline-block text-[14px] font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-accent"
        >
          Ask for access
        </a>
      </div>
    </div>
  )
}

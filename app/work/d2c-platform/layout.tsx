import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Honasa — A Multi-Brand D2C Commerce System",
  description:
    "One shared commerce backbone powering multiple D2C brands — without eroding brand identity. A token-driven foundation that eliminated duplicated systems at scale.",
}

export default function D2cPlatformLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

"use client"

import {
  FullBleedBlock,
  type FullBleedBlockProps,
} from "@/components/shared/full-bleed-block"

export function CsFullBleed(props: FullBleedBlockProps) {
  return <FullBleedBlock typography="case" {...props} />
}

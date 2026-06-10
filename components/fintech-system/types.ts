import type { ReactNode } from "react"

export type FintechTone =
  | "brand"
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "pending"
  | "income"
  | "expense"
  | "profit"
  | "loss"
  | "risk"
  | "safe"

export type FintechComponentState =
  | "default"
  | "hover"
  | "focus"
  | "loading"
  | "disabled"
  | "success"
  | "error"

export interface FintechColorToken {
  name: string
  token: string
  value: string
  darkValue: string
  role: string
  contrast: string
  tone?: FintechTone
}

export interface FintechTypeStyle {
  name: string
  token: string
  size: string
  lineHeight: string
  weight: string
  usage: string
  sample: string
  numeric?: boolean
}

export interface FintechSpacingToken {
  name: string
  token: string
  value: string
  usage: string
}

export interface FintechElevationToken {
  name: string
  token: string
  value: string
  usage: string
}

export interface FintechComponentSpec {
  name: string
  category: string
  description: string
  states: FintechComponentState[]
  props: string[]
  accessibility: string
  preview?: ReactNode
}

export interface FintechPatternSpec {
  name: string
  trigger: string
  requiredData: string[]
  primaryStates: string[]
  riskBehavior: string
  previewKind:
    | "money"
    | "transfer"
    | "request"
    | "card"
    | "bank"
    | "details"
    | "dispute"
    | "confirmation"
    | "insight"
    | "budget"
    | "risk"
    | "kyc"
    | "consent"
    | "connection"
    | "subscription"
    | "stock-order"
    | "crypto-transfer"
}

export interface FintechNavigationItem {
  label: string
  value?: string
  tone?: FintechTone
}

export interface FintechAction {
  label: string
  tone?: FintechTone
}

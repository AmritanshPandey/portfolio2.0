import { ApproachSteps } from "./approach-steps"

/**
 * The "Approach" section: the six method steps as one scannable list.
 * Thin shim so the home page import name stays stable; the heading and
 * steps live in <ApproachSteps>.
 */
export default function ProductDesignApproachSection() {
  return <ApproachSteps />
}

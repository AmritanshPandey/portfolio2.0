import { buildStudies } from "@/lib/study-index"
import { explorationItems } from "./explorations"
import { workItems } from "./work"

/** Every study the switcher and the ending know about, in home order. */
export const studies = buildStudies(workItems, explorationItems)

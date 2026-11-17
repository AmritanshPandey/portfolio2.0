// Unit tests for the study index: which studies exist, in what order, and
// which comes next. Run with `npm run test:unit`.
import assert from "node:assert/strict"
import { test } from "node:test"

import { workItems } from "./data/work.ts"
import { explorationItems } from "./data/explorations.ts"
import { buildStudies, nextStudy, studyAt } from "./study-index.ts"

const studies = buildStudies(workItems, explorationItems)
const work = studies.filter((s) => s.kind === "work")
const explorations = studies.filter((s) => s.kind === "exploration")

test("studies lists the work in home order, then explorations", () => {
  assert.deepEqual(
    studies.slice(0, workItems.length).map((s) => s.href),
    workItems.map((w) => w.href),
  )
  assert.ok(studies.slice(workItems.length).every((s) => s.kind === "exploration"))
  assert.equal(explorations.length, explorationItems.length)
})

test("short is the name before the colon", () => {
  assert.equal(studyAt(studies, "/work/white-label-rfp")?.short, "PartnerBank")
})

test("an item's own short name wins over the colon", () => {
  const planr = buildStudies([], [{ ...explorationItems[0], title: "PlanR Personal Execution System", short: "PlanR" }])
  assert.equal(planr[0].short, "PlanR")
})

test("refs count within their kind", () => {
  assert.equal(work[0].ref, "01")
  assert.equal(work[1].ref, "02")
  assert.equal(explorations[0].ref, "01")
})

test("nextStudy moves on and wraps", () => {
  assert.equal(nextStudy(studies, work[0].href)?.href, work[1].href)
  assert.equal(nextStudy(studies, work.at(-1).href)?.href, work[0].href)
})

test("nextStudy stays within its kind", () => {
  const second = { ...explorationItems[0], href: "/explorations/second", title: "Second: a study" }
  const two = buildStudies(workItems, [explorationItems[0], second])
  assert.equal(nextStudy(two, second.href)?.href, explorationItems[0].href)
  assert.equal(nextStudy(two, workItems.at(-1).href)?.kind, "work")
})

test("a study alone in its kind has no next, rather than itself", () => {
  const lone = buildStudies(workItems.slice(0, 2), explorationItems.slice(0, 1))
  assert.equal(nextStudy(lone, explorationItems[0].href), undefined)
})

test("an unknown href has no entry and no next", () => {
  assert.equal(studyAt(studies, "/work/nope"), undefined)
  assert.equal(nextStudy(studies, "/work/nope"), undefined)
})

# Redesign decisions

The owner's answers to the open questions in `REDESIGN.md` section 5.
Claude Code reads this before every phase. If a phase needs a decision that's still open, Claude
asks in chat with these options and writes the answer here (with the date) before continuing.

Status key: **open** · **answered (YYYY-MM-DD)**

---

## D1. Password gate scope · answered (2026-10-31)

- A: whole site, as approved on 2026-10-11
- B: public site; gate only the confidential case studies; show them on the home page as private line items (recommended)
- C: no gate

Answer: B. Public site; gate only the confidential case studies.

If B, routes to gate (Agent Pay at least):

- /work/agent-commerce

---

## D2. Hero statement · answered (2026-10-31)

- H-a (keep): Product design for / complex systems / people can trust.
- H-b: I design how / people trust AI / with their money.
- H-c: Design for the / moment an AI / pays for you.
- Own wording:

Answer: H-a (keep).

---

## D3. Agent Pay facts that may be public · answered (2026-10-31)

Tick what may appear on the public home page, in link previews and in meta descriptions.

- [x] Set design direction for agentic commerce at Mastercard
- [ ] Built a React and Claude demo in two weeks
- [ ] Used by Mastercard's CPO at Money20/20
- [x] The silent guardian became Mastercard's direction for agentic commerce
- [ ] Partner names (Google, ChatGPT, Haptic Labs, ElevenLabs)

Notes: Only the two ticked facts are public. The two-week demo, the CPO at Money20/20 and partner names stay behind the gate. Copy deck 7.1, 7.2 row 01, 7.3 metric and 7.6 item 1 must be rewritten to match.

---

## D4. Gallery · open

- a: fill with captured real UI and my screenshots; hide from the nav until it has six real shots
- b: remove it; fold the best pieces into case studies and the Lab

Answer:

---

## D5. Signature piece "Guardian moments" · open

- now · later · no

Answer:

---

## D6. Fintech system claims (lib/data/systems.ts L31, L43) · open

- a: keep, with the source stated (give the source)
- b: reword as design intent
- c: remove

Answer:

Source (if a):

---

## D7. PlanR numbers · open

Real usage to show (users, weekly actives, retention), or "keep qualitative".

Answer:

---

## D8. Approach section · open

- a: three steps plus "Where AI is in my work"
- b: keep as is

Answer:

---

## D9. iPhone Duo model in the fold viewer · answered (2026-11-08)

- keep (I've checked Apple's terms)
- swap to a neutral foldable frame drawn in code

Answer: keep. The model now lives in the repo (#51), not only fetched at build time.

---

## D10. Sentence case for case-study headings · open

- yes · no

Answer:

---

## D11. Colophon page · open

- yes · no

Answer:

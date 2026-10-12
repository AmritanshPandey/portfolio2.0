# Site password gate

Status: design approved in chat on 2026-10-11.
Ships before (or with) the latest-work showcase, which puts Agent Pay on the
home page.

## 1. Intent

The whole portfolio becomes private: every page asks for one shared password,
which the owner sends with applications, emails and the resume. The gate must
feel like part of the site, keep search engines and casual visitors out, and
never fail open.

## 2. Decisions

| Question | Decision |
|---|---|
| Scope | Whole site, including the home page and `/resume.pdf` |
| Mechanism | Next.js 16 `proxy.ts` plus an unlock page; no paid Vercel add-on |
| Credential | One shared password in the `SITE_PASSWORD` environment variable |
| Session | Signed cookie, 30 days |
| Search | Disallow search crawling; allow link-preview bots, which only reach `/unlock` |

## 3. Out of scope

- Per-person passwords, accounts, or access logs.
- Protecting files under `/_next/static` (see section 8).
- Rate limiting beyond a fixed delay on wrong guesses.

## 4. Experience

`/unlock` shows, in the site's own type and tokens (DESIGN.md):

- Name and title: "Amritansh Pandey", "Senior UX Designer".
- One line: "This portfolio is shared privately. Use the password from my
  email or resume, or ask me for access."
- A labelled password field and an "Unlock" primary button.
- "Ask for access" as a mailto link to the address in `lib/contact.ts`.
- On a wrong password: inline message "That password didn't work." below the
  field, announced through `aria-live="polite"`, field keeps focus.
- On success: redirect to the page originally requested.

No nav, footer, cursor effects or shader background on this page; it renders
fast and stays quiet.

## 5. Request flow

1. `proxy.ts` runs on every request except the public allowlist:
   `/unlock`, `/_next/*`, `/_vercel/*`, `/favicon.ico`, `/opengraph-image*`,
   `/robots.txt`, and images that `next/image` optimises (`/assets/images/*`
   with an image extension, and `/article.png`).
2. If the request carries a valid `site_access` cookie, it passes through
   untouched (static pages stay static and cached).
3. Otherwise the proxy responds `307` to `/unlock?next=<path and query>`.
4. The unlock form posts to a server action:
   - Trim both values, then compare the submitted value with `SITE_PASSWORD`
     in constant time.
   - Wrong: wait 400ms, return the error state.
   - Right: set the cookie, redirect to `next`.
5. `next` is honoured only when it starts with `/` and not `//` or `/\`;
   anything else redirects to `/`. This prevents open redirects.

## 6. Cookie

| Attribute | Value |
|---|---|
| Name | `site_access` |
| Value | Hex HMAC-SHA256 of the string `site-access-v1`, keyed by `SITE_PASSWORD` |
| Flags | `HttpOnly`, `Secure` (except on localhost), `SameSite=Lax`, `Path=/` |
| Lifetime | `Max-Age=2592000` (30 days) |

The proxy recomputes the HMAC with Web Crypto and compares in constant time.
Changing `SITE_PASSWORD` invalidates every existing cookie.

## 7. Configuration and failure modes

| Situation | Behaviour |
|---|---|
| `SITE_PASSWORD` set | Gate active everywhere it runs |
| Unset in production or preview | Gate active and every password is rejected: fails closed |
| Unset under `next dev` | Gate off, for local work |

- `.env.example` (committed, with a `.gitignore` exception) documents the
  variable with a local-only value. Production and preview values are set by
  the owner in Vercel, never in the repo.
- `app/robots.ts` allows link-preview bots (LinkedIn, X, Facebook, Slack,
  Discord, WhatsApp), returns `Disallow: /` for everyone else, and drops the
  sitemap reference.
- `/unlock` sets `robots: { index: false }`.

## 8. Honest limits

The gate is a front-door lock, not a vault. HTML, RSC payloads, PDFs and
`/resume.pdf` are protected. Site images are not: Next's image optimiser
fetches source images without the visitor's cookie, so images under
`/assets/images/` stay public to keep them loading for unlocked visitors. Files under `/_next/static` stay reachable for
anyone who knows their hashed URLs, because the unlock page needs the
framework's scripts to render, and those chunks can contain strings from
client components. Nothing that would be harmful if leaked belongs on the
site, password or not.

## 9. Units

| Unit | Responsibility |
|---|---|
| `proxy.ts` | Allowlist, cookie verification, redirect to `/unlock` |
| `lib/gate.ts` | `SITE_PASSWORD` lookup, HMAC token, constant-time compare, `safeNext()` |
| `app/unlock/page.tsx` | Unlock screen (server component) with its own minimal layout |
| `app/unlock/actions.ts` | Server action: verify, set cookie, redirect |
| `app/unlock/unlock-form.tsx` | Client form using `useActionState` for the error state |

## 10. Verification

Playwright test suite (`@playwright/test` is already installed):

- Unauthenticated `/`, `/work/white-label-rfp` and `/resume.pdf` redirect to
  `/unlock?next=...`.
- Wrong password shows the error and sets no cookie.
- Right password lands on the requested page; a second visit needs no password.
- `next=//evil.example` lands on `/`.
- `/opengraph-image`, `/favicon.ico` and `/robots.txt` load without a cookie;
  `robots.txt` disallows all.

Plus `npm run lint`, `npx tsc --noEmit`, `npm run check:type`, `npm run build`.

## 11. Owner actions

- Choose the password and set `SITE_PASSWORD` in Vercel for Production and
  Preview before merging; without it the live site stays locked for everyone.

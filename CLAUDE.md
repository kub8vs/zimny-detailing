# CLAUDE.md — Creator Site Factory v2

You are the production engine of a solo web agency selling landing pages to online creators (coaches, course sellers, newsletter writers, agency owners) on X/Instagram. Every run must produce a deployed, sellable page. No placeholders, no lorem ipsum, no "TODO".

## Mission

INPUT: creator data (name, niche, offer, links, screenshots of their profile — whatever the operator pastes).
OUTPUT: one complete, deployed, English-language landing page in under 20 minutes of operator time.

## Operating modes

- `MODE: mockup` — unsolicited pitch demo. Built from public data only. Watermark footer: "Concept by [AGENCY] — your real site in 48h". Full design plan, single build pass. Target: 25 min.
- `MODE: delivery` — paid client. Full QA pass, real assets, client's domain. Target: 3h.

If mode is not stated, assume `mockup`.

## Workflow (always in this order)

1. **Intake.** Parse everything the operator gave. If critical data is missing in `mockup` mode, INVENT plausible specifics from the creator's public positioning — never ask, never stall. In `delivery` mode, list missing items in one message, then proceed with what exists.
2. **Angle.** Write one sentence: who this creator is, what they sell, and the single action the page must drive (join waitlist / buy course / book call). This sentence governs every section.
3. **Pick variant** (below). State which and why in one line.
4. **Copy first.** Write all page copy in English before any HTML. Rules in COPY section.
5. **Build.** One self-contained `index.html`. Rules in BUILD section.
6. **Deploy.** Rules in DEPLOY section.
7. **Report.** Output exactly: live URL, variant used, one-line pitch hook the operator can paste into a DM.

## Variants

### V1 — LAUNCH
For creators launching something datable (course drop, product, waitlist).
Structure: countdown/urgency hero → what's coming (3 concrete outcomes) → who's behind it (authority) → social proof → single CTA (email capture or checkout link). One CTA repeated, no nav.

### V2 — PRODUCT
For an existing course/community/digital product.
Structure: outcome-led hero → pain mirror (their audience's words) → what's inside (modules/deliverables as tangible items) → proof (numbers, testimonials, screenshots) → price anchor → CTA → FAQ (5 questions max, objection-killers).

### V3 — HUB
Personal brand home replacing a Linktree.
Structure: identity hero (name, one-line positioning, face placeholder) → featured offer card → content/socials grid → newsletter capture → contact. Dense, fast, mobile-first above all.

## COPY rules

- Voice: how the creator talks in their own posts. Mirror their vocabulary — pull phrases from their bio/pinned content when provided.
- Headlines state outcomes with specifics: "Ship your first funnel in 7 days" beats "Unlock your potential". Never use: unlock, unleash, elevate, empower, journey, revolutionize, game-changer.
- Every section earns its place by answering one visitor objection. Can't name the objection → cut the section.
- CTAs are verbs describing what happens: "Join the waitlist", "Get the course", "Book a call". One primary action per page.
- Numbers beat adjectives. Invent none in `delivery` mode; in `mockup` mode plausible specifics are allowed and marked with `<!-- demo-data -->`.

## DESIGN rules (this is the product — treat it as such)

The frontend-design skill is installed in `.claude/skills/`. USE IT on every build. The bar: a visitor should assume this page cost $3,000 and took two weeks. Never ship anything that looks like a Lovable/v0 default.

Before writing code, produce a 5-line DESIGN PLAN. If the ui-ux-pro-max skill is installed, FIRST run its generator with the creator's niche as multi-dimensional keywords, e.g.:
`python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fitness coaching high-ticket bold" --design-system -p "<creator>"` — then treat its output as a menu of options, not an order: pick from it what fits THIS creator, discard the rest.

The DESIGN PLAN (5 lines):
1. **Aesthetic direction** — one named direction chosen FROM THE CREATOR'S WORLD (luxury editorial for a high-ticket coach, brutalist mono for a trading educator, warm magazine for a newsletter writer). Never reuse the previous build's direction two runs in a row.
2. **Palette** — 4-5 named hex values derived from the creator's existing brand (profile colors, logo, content style).
3. **Type pairing** — characterful display + complementary body, from Google Fonts. BANNED: Inter, Roboto, Arial, Space Grotesk, Poppins, system stacks.
4. **Signature element** — the ONE thing this page is remembered by (typographic hero, unusual grid, orchestrated load sequence, interactive moment). One per page; everything else stays disciplined.
5. **Motion plan** — where animation serves the subject (page-load sequence, scroll reveals, hover micro-interactions). Deliberate, orchestrated, respects prefers-reduced-motion. No scattered effects.

Critique the plan in one line before building: "would this exact plan come out for any other creator?" If yes, revise the generic part first.

Forbidden across all builds: purple-gradient SaaS look; cream + serif + terracotta default; near-black + acid-green default; centered-everything layouts; equal-width card grids as the only structural idea.

### Screenshot critique loop (delivery mode: mandatory, 2 passes; mockup mode: 1 pass if time allows)
After deploy, use the webapp-testing skill / Playwright to screenshot the live page at 375px and 1440px. Review the screenshots against the design plan. Fix what reads as templated, misaligned, or flat. Redeploy.

## BUILD rules

- One file: `index.html`. Vanilla CSS in `<style>`, vanilla JS in `<script>`. No frameworks, no CDN dependencies except Google Fonts (max 2 families).
- Top of file: a single `CONFIG` JS object holding every personalizable value — names, colors, links, copy strings, countdown date, checkout URL. Rebranding the page for a new pitch must require editing ONLY this block.
- Execute the DESIGN PLAN exactly — every color and type decision derives from it.
- Mobile-first. Test the layout logic at 375px before desktop. Buyers open these links on phones from DMs.
- Performance: no images heavier than needed; use CSS/SVG placeholders in mockup mode. Page must feel instant.
- Accessibility floor: semantic HTML, visible focus states, alt text, prefers-reduced-motion respected.
- Forms: in `mockup` mode, fake submit with a success state + `<!-- wire-up on delivery -->`. In `delivery` mode, wire the client's provider (ConvertKit/Beehiiv/Whop embed/Stripe link — whatever intake specifies).

## DEPLOY rules

- Directory per project: `sites/<creator-handle>/index.html`.
- Deploy: `cd sites/<creator-handle> && vercel --prod --yes`.
- Mockup URL pattern: keep Vercel's generated domain, no custom domain spend.
- Delivery: attach client domain via `vercel domains add` per their DNS; document the two DNS records the client must set in a `HANDOFF.md`.
- After deploy, verify the live URL returns 200 and the hero renders (curl + summary), then report.

## QA checklist (delivery mode — run every item)

1. All CONFIG values real, zero demo-data comments remain
2. Every link clicked and correct (checkout, socials, calendar)
3. 375px / 768px / 1440px layouts sound
4. Form submits to the real provider, success + error states work
5. Meta: title, description, OG image tag, favicon
6. Watermark removed
7. Lighthouse-level sanity: no console errors, fonts load, images sized

## Hard rules

- Never invent testimonials or client counts in `delivery` mode.
- Never add sections the variant doesn't define without stating why in one line.
- Never ask the operator questions in `mockup` mode — decide and ship.
- Output of every run ends with the 3-line report (URL, variant, DM hook). Nothing else after it.
## HOUSE TEMPLATE — Cinematic Video Hero (apply to EVERY generated page)

Operator directive (2026-07-12): every page this factory generates applies the
blueprint below (source: motionsites.ai "Asme" hero template). It is the
structural and quality baseline, not an optional style.

How to apply on each build:

1. The reference prompt below is the technique spec: full-screen looping
   background-video hero with the seamless JS fade-loop system, the
   `.liquid-glass` component system (exact CSS below), dark cinematic base,
   and that level of spec density in every design decision.
2. Adapt per creator, never copy blind: swap brand name/logo, nav links,
   headline, subtitle, CTA copy, social links, fonts and accent colors per
   the DESIGN PLAN — and swap the background video for an asset that fits
   THE CREATOR's world. The CloudFront demo URL below is allowed in `mockup`
   mode only; in `delivery` mode it MUST be replaced with the client's asset.
3. Stack translation: our builds stay one self-contained `index.html`
   (vanilla CSS/JS per BUILD rules). Translate the Tailwind utility specs to
   plain CSS; port the `.liquid-glass` CSS and the fade-loop JS 1:1. The
   "Vite + React 18 + TypeScript" line applies only if a client explicitly
   orders a React build.
4. Precedence: where this section conflicts with earlier DESIGN variety
   rules, this section wins on structure (video hero + liquid glass are the
   constant foundation); variety lives in palette, typography, signature
   element, motion details, and content.

### Reference prompt (verbatim)

```text
Build a single-page hero section with a full-screen looping background video, liquid glass UI elements, and a dark cinematic aesthetic. Use React, TypeScript, Tailwind CSS, and Lucide React icons. Here are the exact specifications:

Background Video:

Full-screen muted autoplaying video covering the entire viewport, positioned absolutely with object-cover
Video source URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4
The video is shifted down by 17% (translate-y-[17%]) so the top portion of the video is cropped -- the interesting content is in the lower portion of the frame
The video loops seamlessly with a custom JavaScript fade system (no CSS transitions): 500ms requestAnimationFrame-based fade-in on load/loop start, 500ms fade-out when 0.55 seconds remain before the video ends. A fadingOutRef boolean prevents re-triggering the fade-out from repeated timeUpdate events. On ended, opacity is set to 0, then after 100ms the video resets to currentTime = 0, plays, and fades back in. Each new fade cancels any running animation frame to prevent competing animations. Fades resume from the current opacity rather than snapping.
The outer container is min-h-screen bg-black with overflow-hidden

Font:

Import Google Font "Instrument Serif" (both regular and italic) via CSS @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap')
The heading uses fontFamily: "'Instrument Serif', serif" applied via inline style

Liquid Glass CSS (.liquid-glass class):

background: rgba(255, 255, 255, 0.01) with background-blend-mode: luminosity
backdrop-filter: blur(4px) and -webkit-backdrop-filter: blur(4px)
border: none
box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1)
position: relative; overflow: hidden
A ::before pseudo-element creates the glass border effect:
position: absolute; inset: 0; border-radius: inherit; padding: 1.4px
background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%)
Mask trick for border-only rendering: -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude
pointer-events: none

Layout (all inside one full-screen flex column):

Navigation bar (relative z-20, padding pl-6 pr-6 py-6):
Inner container: rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto
Left side: Logo area with a Globe icon (size 24) and text "Asme" in white, font-semibold text-lg, with gap-2
Next to the logo (with gap-8): three nav links ("Features", "Pricing", "About") -- hidden on mobile, shown on md: -- styled text-white/80 hover:text-white transition-colors text-sm font-medium
Right side (gap-4): "Sign Up" as plain white text button, "Login" as a liquid-glass rounded-full px-6 py-2 button

Hero content area (relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]):
Heading: "Built for the curious" -- text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap with Instrument Serif font
Below the heading, a max-w-xl w-full space-y-4 container:
Email input bar: liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3. Inside: a transparent email input (placeholder: "Enter your email", text-white placeholder:text-white/40 text-base) and a white circular submit button (bg-white rounded-full p-3 text-black) containing an ArrowRight icon (size 20)
Subtitle text: text-white text-sm leading-relaxed px-4 -- "Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates."
Manifesto button: centered, liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors

Social icons footer (relative z-10 flex justify-center gap-4 pb-12):
Three circular icon buttons, each liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all
Icons: Instagram, Twitter, Globe (all size 20) from lucide-react
Each has an aria-label

Tech stack: Vite + React 18 + TypeScript, Tailwind CSS 3, lucide-react for all icons. Default Tailwind config with no extensions. No other UI libraries.
```

# Design System

Visual DNA: White + Soft Black with restrained Green accents. Friendly, Safe, Everyday, calm Apple-like UI. Roughly 60% white/warm neutral, 30% soft black/dark neutral, 10% green. Green is also used for the logo mark so the product identity matches availability/safety.

## Token Architecture

```
Primitive (raw values)
  green-50…900, neutral-0…900, yellow, orange, red
  space-1…12, radius-sm…full, font sizes/weights, shadows
    ↓
Semantic (meaning)
  bg-*, text-*, border-*, brand-*, status-*, interactive-*, focus-ring
    ↓
Component (per-component decisions)
  search-*, ride-card-*, seat-badge-*, avatar-*, icon-button-*, date-tab-*
    ↓
React components (src/components/ui)
```

All three layers live in `src/app/globals.css` and are exposed to Tailwind v4 via `@theme inline`.

## Rules

1. Feature code (pages, organisms, molecules) must use semantic or component tokens — never primitive values like `var(--green-700)` or arbitrary Tailwind values like `bg-[#0D6F51]`.
2. Only `src/components/ui/**` may introduce new Tailwind color utilities.
3. Soft black communicates: primary actions, active state, app chrome, and hierarchy.
4. Green communicates only: verified, available, safe/positive status, and focus.
5. Orange/red communicates location or important semantic states only.
6. Yellow is reserved only for rare tiny accents; the logo mark uses green.
7. Shadows are controlled: `shadow-card` for cards, `shadow-panel` for the search panel. No other shadows.
8. Touch targets: buttons and tabs are at least 44px tall.
9. Focus is always visible via the global `:focus-visible` ring (`--focus-ring`).
10. Motion respects `prefers-reduced-motion`.

## Key Values (production, not sampled from any mockup)

| Role | Value |
| --- | --- |
| Page background | `#F1F3F1` (`--bg-page`) |
| Card surface | `#FFFFFF` (`--bg-surface`) |
| Primary action | `#101613` (`--brand-primary`, soft black) |
| Green accent | `#0D6F51` (`--text-brand`) |
| Soft green | `#F0FAF6` (`--bg-brand-subtle`) |
| Available | `#20AD7C` (`--status-success`) |
| Primary text | `#101613` (`--text-primary`) |
| Secondary text | `#5D6360` (`--text-secondary`) |
| Brand yellow | `#FFC629` (`--brand-identity`) |

## Component Tokens

| Component | Tokens |
| --- | --- |
| Search panel | `--search-bg/radius/padding/shadow` |
| Ride card | `--ride-card-bg/radius/padding/gap/shadow` |
| Seat badge | `--seat-badge-bg/text/radius` (soft green pill) |
| Avatar | `--avatar-size: 48px`, `--avatar-radius: full` |
| Icon button | `--icon-button-size: 44px`, neutral soft circle |
| Date tab | 48px pill, soft-black active / neutral inactive |

## RideCard Hierarchy

Each ride card reads in this order: departure time → origin/destination → driver identity + verification + trip count → available seats → vehicle. The whole card is a link to the trip detail. Contact actions (call/LINE) live on the detail page, not in the list.

## Legacy Aliases

`globals.css` keeps legacy names (`bg-app`, `text-ink`, `bg-wash`, …) mapped onto the new system so old code keeps rendering. Do not use them in new code — prefer `bg-page`, `text-primary`, `bg-interactive`, etc.

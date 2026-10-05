# Project Overview

`ไปด้วยกัน` is a small ride-sharing web app for matching people who travel in the same direction. The current product is a prototype built with Next.js App Router, static mock data, and reusable UI primitives.

## Product Purpose

The app helps two groups of users:

- Rider: คนที่ต้องการหารถที่ไปทางเดียวกัน
- Driver: คนที่มีที่ว่างในรถและอยากแชร์เส้นทาง

The app does not handle booking, payment, or chat inside the product. Users contact each other directly through phone or LINE.

## Core User Flows

### Find a Ride

1. User starts from `/` or opens `/find` directly.
2. User searches by destination or route keyword.
3. User filters by day: วันนี้ or พรุ่งนี้.
4. User opens an offer detail page.
5. User contacts the driver by phone or LINE.

### Share Available Seats

1. User opens `/post`.
2. User enters origin, destination, departure time, available seats, route, pickup point, and contact details.
3. User submits the form.
4. The app shows a success state.
5. User can go to `/my-posts` or `/find`.

### Manage My Shared Routes

1. User opens `/my-posts`.
2. User sees routes they have shared.
3. User can mark a route as full or reopen it.
4. User can open `/post` to share another route.

### Manage Profile and Trust

1. User opens `/profile`.
2. User sees their trust profile, verification status, vehicle, contact info, and shared routes.
3. User can edit profile-like fields in the UI, but current data is not persisted.

## App Shell

Every route is wrapped by `AppShell` from `src/components/templates/app-shell.tsx`.

The shell contains:

- `DesktopHeader`: desktop top header with brand, ride count text, and share CTA.
- `MobileTopBar`: mobile fixed top bar with brand and menu toggle.
- `DesktopSidebar`: desktop navigation and share CTA card.
- `ContentGrid`: responsive shell layout for sidebar plus page content.
- `PageBody`: page body wrapper that accounts for the mobile top bar offset.

## Route Map

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home page | Minimal landing page for choosing find/share action |
| `/find` | Find ride page | Search and browse available ride offers |
| `/offer/[id]` | Offer detail page | Show full ride information and contact actions |
| `/post` | Post ride page | Form for sharing available seats |
| `/my-posts` | My posts page | Manage routes shared by the current user |
| `/profile` | Profile page | Show user trust profile, vehicle, contacts, and shared route summary |

## Current Product Constraints

- Data is static mock data from `src/data`.
- There is no backend or database yet.
- Form submissions update local React state only.
- Contact actions use `tel:` and LINE external links.
- Authentication is not implemented; `users.me` acts as the current user.
- Seat availability changes in `/my-posts` are local UI state only.

## Key Code Areas

| Area | Path | Notes |
| --- | --- | --- |
| Routes | `src/app/**/page.tsx` | App Router pages |
| App shell | `src/components/templates/app-shell.tsx` | Global layout wrapper |
| Organisms | `src/components/organisms` | Larger sections like feed, nav, profile card |
| Molecules | `src/components/molecules` | Cards and contact actions |
| UI primitives | `src/components/ui` | Design system primitives: layout, card, typography, buttons, inputs |
| Mock data | `src/data` | Static rides and users |
| Domain types | `src/lib/types.ts` | `UserProfile` and `RideOffer` |

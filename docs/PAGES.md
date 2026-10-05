# Pages Documentation

This document explains each app route, what UI sections it contains, how users interact with it, and which components/data it depends on.

## `/` - Home Page

### Purpose

Minimal landing page that lets users choose their main intent: find a ride or share a ride.

### UI Sections

- Hero title: `วันนี้จะไปไหน?`
- Primary action card: `หารถ`
- Secondary action card: `แชร์รถ`

### User Actions

- Click `หารถ` to go to `/find`.
- Click `แชร์รถ` to go to `/share`.

### Main Components

- `Page` with `variant="landing"`
- `NarrowCenter`
- `Stack`
- `Title`
- `ActionCard`

### Data Source

No runtime data is used on the current home page.

### Behavior / State

No local state. The page is a static navigation choice.

### Notes for Future Changes

Keep this page minimal. If stats or extra links are added later, make sure they do not duplicate the two main CTAs.

## `/share` - Share Choice Page

### Purpose

Ask users whether to continue as Guest or member before entering the share form.

### UI Sections

- Back link to `/`
- Title: `จะลงข้อมูลแบบไหน?`
- Guest action card linking to `/post`
- Member action card linking to `/register`
- Helper note that Guest needs no password

### User Actions

- Click `Guest` to go to `/post`.
- Click `สมาชิก` to go to `/register`.

### Main Components

- `Page` with `variant="landing"`
- `NarrowCenter`
- `Stack`
- `Title`
- `Text`
- `BackLink`
- `ActionCard`

### Data Source

No runtime data is used.

### Behavior / State

No local state. Static navigation choice.

### Notes for Future Changes

When real auth exists, `/register` should create a verified member account instead of showing a local success state.

## `/register` - Register Page

### Purpose

Let users register as a member with phone OTP verification before sharing a ride.

### UI Sections

- Back link to `/share`
- Title: `สมัครสมาชิก`
- Helper text about phone-only trust
- Step 1: phone form card with `ส่งรหัส OTP` button
- Step 2: OTP form card with 6-digit input, demo code hint, resend timer, and change-phone action
- Step 3: success state with CTA to `/post`

### User Actions

1. Enter phone number and request an OTP.
2. Enter the 6-digit OTP code.
3. Resend the code after the 60-second cooldown if needed.
4. Change phone number if the number was typed wrong.
5. After success, click `ไปแชร์รถเลย` to go to `/post`.

### Main Components

- `Page` with `variant="landing"`
- `NarrowCenter`
- `Card` / `CardBody`
- `Field`
- `Input`
- `Button`
- `BackLink`
- `IconBox`

### Data Source

No backend is used. The OTP is generated in local React state and shown as a demo code on screen because there is no SMS provider yet. On success the verified phone is saved to `localStorage` under `pdk-member-phone`.

### Behavior / State

- This is a client page.
- Local `step` state controls `phone`, `otp`, and `done` screens.
- Phone numbers must have at least 9 digits.
- OTP must be exactly the generated 6-digit code.
- After 5 wrong attempts the user must request a new code.
- Resend is disabled during the 60-second cooldown.
- Registration is not persisted to any backend or user store.

### Notes for Future Changes

Replace the mock OTP with a real SMS OTP provider: send code from an API route, verify server-side, enforce rate limits, then create the member account and route verified members into `/post` with their profile prefilled.

## `/find` - Find Ride Page

### Purpose

Let users search and browse available ride offers.

### UI Sections

- Page title: `จะไปที่ไหน?`
- Search panel (white card, destination input, day pills)
- Day segmented control: วันนี้ / พรุ่งนี้
- Result count text
- Ride card list (whole card links to detail, no contact buttons in list)
- Empty state when no offers match

### User Actions

- Type a destination or route keyword.
- Switch between วันนี้ and พรุ่งนี้.
- Tap a ride card to open its detail page.
- Contact the driver from the detail page.
- Clear search from the empty state when a query has no results.

### Main Components

- `RideOfferFeed`
- `Input`
- `SegmentedControl`
- `RideOfferCard`
- `EmptyState`
- `ContactActions`
- `DetailLink`

### Data Source

Uses `rideOffers` from `src/data/rides.ts`.

### Behavior / State

- `RideOfferFeed` is a client component.
- Local state stores `to` search text and `day` filter.
- Results exclude offers where `seatsLeft === 0`.
- Today filter matches `dateLabel === "วันนี้"`.
- Tomorrow filter matches `dateLabel === "พรุ่งนี้"`.
- Search matches against `destination` and `via` text.

### Notes for Future Changes

If backend search is added, this page should move filtering from local array filtering to a query/API boundary while preserving the same UI behavior.

## `/offer/[id]` - Offer Detail Page

### Purpose

Show full information for one ride offer and provide clear contact actions.

### UI Sections

- Back link to `/find`
- Main route card
- Route meta: date and departure time
- Seat availability badge (soft green pill)
- Route timeline (green origin dot, green destination dot)
- Pickup points
- Seat and vehicle metric cards
- Optional driver note on soft green surface
- Driver summary row
- Contact card
- Driver trust profile card
- Link to see other offers

### User Actions

- Go back to the ride list.
- Review route, pickup points, available seats, and vehicle.
- Call the driver.
- Open LINE contact.
- View driver trust details.
- Go back to `/find` to browse other offers.

### Main Components

- `DetailLayout`
- `BackLink`
- `Card` / `CardBody`
- `RouteTimeline`
- `MetricCard`
- `Surface`
- `UserRow`
- `ContactActions`
- `ContactRow`
- `TrustProfileCard`

### Data Source

Uses `getOffer(id)` from `src/data/rides.ts`.

The page also uses `rideOffers` and `myOffers` in `generateStaticParams()` to statically generate offer pages.

### Behavior / State

- This is a server page.
- `params` is awaited and used to find the offer by id.
- If the offer does not exist, the page calls `notFound()`.
- If `seatsLeft === 0`, the page shows a full state and disables direct contact actions in the contact card.
- If `offer.note` exists, it is shown as a highlighted note.

### Notes for Future Changes

When backend data exists, replace static params and `getOffer(id)` with data fetching from the real source. Keep the full-state behavior because it protects users from contacting already full rides.

## `/post` - Post Ride Page

### Purpose

Let drivers share available seats in their car. Users normally arrive here after choosing Guest on `/share`.

### UI Sections

- Back link to `/my-posts`
- Page title: `แชร์ที่ว่างของคุณ`
- Route form card
- Contact form card
- Submit button
- Success state after submit

### User Actions

- Enter origin and destination.
- Enter departure time and number of available seats.
- Add route via points.
- Add pickup point.
- Enter phone and LINE ID.
- Add optional details.
- Submit the form.
- After success, navigate to `/my-posts` or `/find`.

### Main Components

- `Card` / `CardBody`
- `FormGrid`
- `Field`
- `Input`
- `Textarea`
- `PairGrid`
- `Button`
- `IconBox`

### Data Source

No external data is read for the form. Some fields use hard-coded default values for prototype/demo purposes.

### Behavior / State

- This is a client page.
- Local state `done` controls whether the form or success panel is shown.
- Form submission calls `preventDefault()` and sets `done` to `true`.
- Current submission is not persisted to `myOffers` or any backend.

### Notes for Future Changes

The next product step is to convert form data into a real `RideOffer` creation flow. Add validation, persistence, and error handling before treating this as production behavior.

## `/my-posts` - My Posts Page

### Purpose

Let the current user view and manage routes they have shared.

### UI Sections

- Page header with `แชร์เพิ่ม` button
- Shared route cards
- Status badge: open or full
- Route meta and vehicle info
- Contact info
- Action buttons: edit and mark full/reopen
- Tip card explaining how contact works

### User Actions

- Click `แชร์เพิ่ม` to open `/post`.
- Review current shared routes.
- Mark a route as full.
- Reopen a route that was marked full.
- Click edit button placeholder.

### Main Components

- `PageHeader`
- `CardGrid`
- `Card` / `CardBody`
- `Badge`
- `Cluster`
- `Stack`
- `Button`

### Data Source

Uses `myOffers` from `src/data/rides.ts`.

### Behavior / State

- This is a client page.
- Local state `closed` stores ids of routes marked as full in the current session.
- Cards become dimmed when their id is in `closed`.
- The status badge and second action button label change based on `closed`.
- The edit button is visual only and does not open an edit flow yet.

### Notes for Future Changes

When persistence is added, `closed` should become backend state such as `status: "open" | "full" | "closed"`. The edit button should link to an edit route or open an edit form.

## `/profile` - Profile Page

### Purpose

Show the current user's trust profile, verification status, vehicle/contact info, and a compact summary of their shared routes.

### UI Sections

- Page header with settings button
- Trust profile card
- Verification card
- Vehicle and contact card
- Shared route summary list
- Member since text

### User Actions

- Review trust and verification status.
- See saved vehicle and contact info.
- View shared route summary.
- Click `ดูทั้งหมด` to open `/my-posts`.
- Click settings button placeholder.
- Edit input values visually, but changes are not persisted.

### Main Components

- `TrustProfileCard`
- `FormGrid`
- `Card` / `CardBody`
- `Surface`
- `Input`
- `ContactRow`
- `TextLink`
- `Badge`

### Data Source

- Uses `users.me` from `src/data/users.ts` as the current user.
- Uses `myOffers` from `src/data/rides.ts` for route summary.

### Behavior / State

- This page has no React local state.
- Inputs use `defaultValue` and are uncontrolled prototype fields.
- Settings and save actions are placeholders.

### Notes for Future Changes

Profile persistence should be introduced with a real current user model, form state, validation, and save feedback. Verification fields should eventually reflect backend verification status.

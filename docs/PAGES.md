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
- Click `แชร์รถ` to go to `/post`.

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

## `/find` - Find Ride Page

### Purpose

Let users search and browse available ride offers.

### UI Sections

- Page title: `จะไปที่ไหน?`
- Search/filter panel
- Day segmented control: วันนี้ / พรุ่งนี้
- Result count text
- Ride offer list
- Empty state when no offers match

### User Actions

- Type a destination or route keyword.
- Switch between วันนี้ and พรุ่งนี้.
- Use ride cards to call, open LINE, or view details.
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
- Seat availability badge
- Route timeline
- Pickup points
- Seat and vehicle metric cards
- Optional driver note
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

Let drivers share available seats in their car.

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

# Data Model

The current app uses static mock data. There is no backend, database, auth session, or persistence layer yet.

## Domain Types

Types live in `src/lib/types.ts`.

## `UserProfile`

`UserProfile` represents a person in the system. In the current app, users can be drivers, the current user, or both.

```ts
export interface UserProfile {
  id: string;
  name: string;
  avatarTone: AvatarTone;
  initials: string;
  verifiedPhone: boolean;
  verifiedId: boolean;
  memberSince: string;
  sharedCount: number;
  vehicle?: { model: string; color: string; plate: string };
  phone?: string;
  lineId?: string;
}
```

### Important Fields

| Field | Meaning |
| --- | --- |
| `id` | Stable user id in mock data |
| `name` | Display name shown on cards/profile |
| `avatarTone` | Visual tone used by avatar UI |
| `initials` | Thai initials displayed in avatar fallback |
| `verifiedPhone` | Whether phone is verified |
| `verifiedId` | Whether identity document is verified |
| `memberSince` | Human-readable membership date |
| `sharedCount` | Number of times this user has shared rides |
| `vehicle` | Optional default vehicle information |
| `phone` | Optional direct phone contact |
| `lineId` | Optional LINE contact id |

### Current Users

Users live in `src/data/users.ts`.

| Key | Role in Mock Data | Notes |
| --- | --- | --- |
| `ton` | Driver | Verified phone and ID |
| `bank` | Driver | Verified phone and ID |
| `bee` | Driver | Verified phone, not verified ID |
| `me` | Current user | Used by `/profile` and `myOffers` |

## `RideOffer`

`RideOffer` represents one route shared by a driver.

```ts
export interface RideOffer {
  id: string;
  driver: UserProfile;
  origin: string;
  destination: string;
  departureTime: string;
  dateLabel: string;
  via: string[];
  seatsTotal: number;
  seatsLeft: number;
  pickupPoints: string[];
  vehicle: { model: string; color: string; plate: string };
  contact: { phone: string; lineId: string };
  note?: string;
  postedAgo: string;
}
```

### Important Fields

| Field | Meaning |
| --- | --- |
| `id` | Stable offer id used by `/offer/[id]` |
| `driver` | `UserProfile` of the person sharing the ride |
| `origin` | Start point of the route |
| `destination` | End point of the route |
| `departureTime` | Human-readable departure time, currently `HH:mm` text |
| `dateLabel` | Human-readable day label, currently `วันนี้` or `พรุ่งนี้` |
| `via` | Route waypoints used for display and search matching |
| `seatsTotal` | Total shareable seats |
| `seatsLeft` | Available seats left |
| `pickupPoints` | Places where the driver can pick up riders |
| `vehicle` | Vehicle shown on cards/detail page |
| `contact` | Direct contact for phone and LINE actions |
| `note` | Optional driver note |
| `postedAgo` | Human-readable posted time |

## Mock Data Files

### `src/data/users.ts`

Exports `users`, a record of `UserProfile` objects.

Used by:

- `src/data/rides.ts` to assign drivers to ride offers.
- `/profile` to render `users.me` as the current user.

### `src/data/rides.ts`

Exports three main items:

### `rideOffers`

Public ride offers shown in `/find`.

Important behavior:

- `/find` hides offers where `seatsLeft === 0`.
- `/offer/[id]` can still render full offers and show a full state.
- Search checks `destination` and `via` text.
- Day filtering checks `dateLabel`.

### `myOffers`

Offers shared by the current user.

Used by:

- `/my-posts` for management UI.
- `/profile` for shared route summary.
- `/offer/[id]` static generation and detail lookup.

### `getOffer(id)`

Looks up one offer across both `rideOffers` and `myOffers`.

```ts
export function getOffer(id: string): RideOffer | undefined {
  return [...rideOffers, ...myOffers].find((o) => o.id === id);
}
```

Used by `/offer/[id]`.

## Data Relationships

```txt
UserProfile
  └─ used as RideOffer.driver

RideOffer
  ├─ driver: UserProfile
  ├─ vehicle: vehicle snapshot for this offer
  ├─ contact: direct contact for this offer
  ├─ via: route waypoints
  └─ pickupPoints: pickup locations
```

## Current Limitations

- `dateLabel` is display text, not a real date object.
- `departureTime` is text, not a structured time value.
- `seatsLeft` is manually defined in mock data.
- `/post` does not add a new item to `myOffers`.
- `/my-posts` status changes are local UI state only.
- `/profile` inputs are uncontrolled and not saved.
- There is no user authentication; `users.me` is treated as the current user.

## Future Backend Shape

When moving beyond mock data, likely entities are:

- `User`
- `Vehicle`
- `RideOffer`
- `ContactMethod`
- `VerificationStatus`

Recommended changes:

- Replace `dateLabel` with a real date field plus display formatting.
- Replace `departureTime` text with a structured time or datetime.
- Add offer status: `open`, `full`, `closed`, or `expired`.
- Store `seatsLeft` as derived or validated state.
- Separate current user profile from public driver profile if privacy becomes important.

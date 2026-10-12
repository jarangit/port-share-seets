# API Contract

This document describes the backend API shape needed to support the current UX/UI of `ไปด้วยกัน`.

The current frontend uses mock services in `src/features/*/services`. These methods are intentionally shaped like API calls so they can be replaced by real HTTP requests later.

## Status

- Contract status: draft for BE implementation
- Frontend data source today: mock services backed by static data
- Auth today: mocked / implicit current user
- Backend target: REST JSON API
- In-app booking: not supported
- In-app payment: not supported
- In-app chat: not supported
- User contact: direct phone, LINE, and optional Facebook

## Base Conventions

### Base URL

Use the environment-specific API host.

```txt
https://api.example.com
```

Frontend should call endpoints relative to this host.

### Content Type

Requests and responses use JSON.

```http
Content-Type: application/json
Accept: application/json
```

### Authentication

Protected endpoints require `Authorization: Bearer <accessToken>`.

The token is a JWT issued by `POST /auth/otp/verify` (`{ sub: userId }`,
expires per `JWT_EXPIRES_IN`). The frontend stores it in `localStorage`
(`pdk-access-token`) and sends it on every API call. Missing or invalid
tokens return `401 UNAUTHORIZED`.

Protected endpoints:

- `GET /me`
- `PATCH /me`
- `GET /me/ride-offers`
- `POST /ride-offers`
- `PATCH /ride-offers/{id}/status`

Public endpoints:

- `GET /ride-offers`
- `GET /ride-offers/{id}`
- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /auth/facebook/login`

### Error Response

All non-2xx responses should use this shape.

```ts
interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  requestId?: string;
}
```

Example:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Some fields are invalid.",
  "fieldErrors": {
    "phone": ["Phone number must contain at least 9 digits."]
  },
  "requestId": "req_123"
}
```

### Common Error Codes

| HTTP | Code | Meaning |
| --- | --- | --- |
| `400` | `BAD_REQUEST` | Malformed request |
| `401` | `UNAUTHORIZED` | Missing or invalid session |
| `403` | `FORBIDDEN` | User cannot access or mutate this resource |
| `404` | `NOT_FOUND` | Resource does not exist |
| `409` | `CONFLICT` | Resource state does not allow the action |
| `410` | `EXPIRED` | Resource has expired |
| `422` | `VALIDATION_ERROR` | Valid JSON but invalid fields |
| `429` | `RATE_LIMITED` | Too many requests, especially OTP |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

## Enums

```ts
type RideOfferDay = "today" | "tomorrow";

type RideOfferStatus = "open" | "full" | "closed" | "expired";

type VerificationStatus = "unverified" | "phone_verified" | "id_verified" | "fully_verified";
```

## Schemas

### Vehicle

```ts
interface Vehicle {
  name: string; // free-text vehicle name, e.g. "Toyota Yaris"
}
```

### PublicUserProfile

Used inside ride cards and offer detail.

```ts
interface PublicUserProfile {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  verifiedPhone: boolean;
  verifiedId: boolean;
  memberSince: string;
  sharedCount: number;
  vehicle?: Vehicle;
  phone?: string;
  lineId?: string;
  facebookUrl?: string;
}
```

### CurrentUserProfile

Used by `/profile` and create-post defaults.

```ts
interface CurrentUserProfile extends PublicUserProfile {
  phone?: string;
  lineId?: string;
  facebookUrl?: string;
}
```

### RideOffer

```ts
interface RideOffer {
  id: string;
  driver: PublicUserProfile;
  origin: string;
  destination: string;
  departureDate: string; // ISO date, e.g. "2026-10-11"
  departureTime: string; // HH:mm, e.g. "07:30"
  dateLabel: "วันนี้" | "พรุ่งนี้" | string;
  via: string[];
  seatsTotal: number;
  seatsLeft: number;
  pickupPoints: string[];
  vehicle: Vehicle;
  contact: {
    phone: string;
    lineId: string;
    facebookUrl?: string;
  };
  note?: string;
  status: RideOfferStatus;
  createdAt: string; // ISO datetime
  expiresAt: string; // ISO datetime, createdAt + 48h
  postedAgo: string; // display text; frontend may eventually format this from createdAt
}
```

Current frontend type is smaller and uses display strings (`dateLabel`, `postedAgo`). BE should return structured `departureDate`, `createdAt`, and `expiresAt` as the source of truth while allowing the frontend to keep display text during transition.

### CreateRideOfferRequest

Matches `CreateRideOfferInput` from `src/features/rides/services/rides-service.ts`.

```ts
interface CreateRideOfferRequest {
  origin: string;
  destination: string;
  departureTime: string; // HH:mm
  day: RideOfferDay;
  seats: number;
  vehicleName: string;
  via: string; // comma-separated waypoints from current UI
  driverName: string;
  phone: string;
  lineId: string;
  facebookUrl?: string;
  note?: string;
}
```

Validation:

- `origin`: required, non-empty
- `destination`: required, non-empty
- `departureTime`: required, `HH:mm`
- `day`: `today` or `tomorrow`
- `seats`: integer, minimum `1`
- `vehicleName`: required, non-empty
- `driverName`: required, non-empty
- `phone`: required, at least 9 digits after normalization
- `lineId`: required, non-empty
- `facebookUrl`: optional valid URL or empty
- `note`: optional

### UpdateRideOfferStatusRequest

```ts
interface UpdateRideOfferStatusRequest {
  status: "open" | "full" | "closed";
}
```

Current UI only toggles `open` and `full`. `closed` is reserved for future owner/admin actions.

### UpdateCurrentUserRequest

```ts
interface UpdateCurrentUserRequest {
  vehicle?: string; // vehicle name
  phone?: string;
  facebookUrl?: string;
}
```

### OtpRequest

```ts
interface OtpRequest {
  phone: string;
}
```

### OtpRequestResponse

```ts
interface OtpRequestResponse {
  phone: string;
  cooldownSeconds: number;
  expiresInSeconds: number;
  demoCode?: string; // only non-production / demo environments
}
```

### OtpVerifyRequest

```ts
interface OtpVerifyRequest {
  phone: string;
  otp: string;
}
```

### OtpVerifyResponse

```ts
interface OtpVerifyResponse {
  ok: true;
  user: CurrentUserProfile;
  accessToken: string; // JWT Bearer for protected endpoints
}
```

One account per phone number: verifying an unknown phone creates a new
user; verifying a known phone returns that user and marks the phone
verified.

### Facebook Login

```http
POST /auth/facebook/login
```

Powers the "continue with Facebook" button on `/register`. The frontend
loads the Facebook JS SDK (`NEXT_PUBLIC_FACEBOOK_APP_ID`), runs `FB.login`
for `public_profile`, and sends the FB user access token here. The backend
verifies the token against the Graph API (plus `debug_token` app check when
`FACEBOOK_APP_ID/SECRET` are set), finds or creates a user by `facebookId`,
and returns the same session shape as OTP verify:

```ts
interface FacebookLoginResponse {
  ok: true;
  user: CurrentUserProfile;
  accessToken: string; // JWT Bearer for protected endpoints
}
```

Facebook users get `verifiedId: true` (Meta-verified identity) but
`verifiedPhone: false`. A successful login skips OTP entirely.

## Endpoints

## Ride Offers

### List public ride offers

```http
GET /ride-offers?q={q}&day={day}&status=open
```

Purpose: powers the `/` ride search page.

Query parameters:

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `q` | string | no | Search destination and route waypoints |
| `day` | `today` \| `tomorrow` | no | Defaults to `today` |
| `status` | `open` | no | Public list should only return open offers |

Response `200`:

```json
{
  "data": [
    {
      "id": "o-1",
      "origin": "รังสิต",
      "destination": "อโศก",
      "departureDate": "2026-10-11",
      "departureTime": "07:45",
      "dateLabel": "วันนี้",
      "via": ["ดอนเมือง", "วิภาวดี", "ดินแดง"],
      "seatsTotal": 3,
      "seatsLeft": 2,
      "pickupPoints": ["หน้าฟิวเจอร์พาร์ค รังสิต"],
      "vehicle": { "name": "Toyota Corolla" },
      "contact": { "phone": "081-234-5678", "lineId": "ton.share", "facebookUrl": "https://www.facebook.com/ton.share" },
      "driver": {
        "id": "u-ton",
        "name": "ต้น",
        "initials": "ต",
        "avatarUrl": "https://api.dicebear.com/9.x/adventurer/svg?seed=Ton",
        "verifiedPhone": true,
        "verifiedId": true,
        "memberSince": "พ.ค. 2026",
        "sharedCount": 12
      },
      "note": "ขับนิ่ม แวะรับระหว่างทางได้ถ้าไม่ไกลครับ",
      "status": "open",
      "createdAt": "2026-10-11T00:45:00.000Z",
      "expiresAt": "2026-10-13T00:45:00.000Z",
      "postedAgo": "6 นาทีที่แล้ว"
    }
  ]
}
```

Rules:

- Do not return `full`, `closed`, or `expired` offers in the public list.
- Do not return expired offers in the public list.
- Search should match at least `destination` and `via`.
- Sort newest/open/relevant first; exact sort is a BE/product decision.

### Get ride offer detail

```http
GET /ride-offers/{id}
```

Purpose: powers `/offer/[id]`.

Response `200`:

```json
{
  "data": {
    "id": "o-1",
    "origin": "รังสิต",
    "destination": "อโศก",
    "departureDate": "2026-10-11",
    "departureTime": "07:45",
    "dateLabel": "วันนี้",
    "via": ["ดอนเมือง", "วิภาวดี", "ดินแดง"],
    "seatsTotal": 3,
    "seatsLeft": 2,
    "pickupPoints": ["หน้าฟิวเจอร์พาร์ค รังสิต"],
    "vehicle": { "name": "Toyota Corolla" },
    "contact": { "phone": "081-234-5678", "lineId": "ton.share", "facebookUrl": "https://www.facebook.com/ton.share" },
    "driver": {
      "id": "u-ton",
      "name": "ต้น",
      "initials": "ต",
      "avatarUrl": "https://api.dicebear.com/9.x/adventurer/svg?seed=Ton",
      "verifiedPhone": true,
      "verifiedId": true,
      "memberSince": "พ.ค. 2026",
      "sharedCount": 12,
      "vehicle": { "name": "Toyota Corolla" }
    },
    "note": "ขับนิ่ม แวะรับระหว่างทางได้ถ้าไม่ไกลครับ",
    "status": "open",
    "createdAt": "2026-10-11T00:45:00.000Z",
    "expiresAt": "2026-10-13T00:45:00.000Z",
    "postedAgo": "6 นาทีที่แล้ว"
  }
}
```

Rules:

- If `status` is `full`, the UI shows full state and hides direct contact actions.
- If `status` is `closed`, return `403` to non-owner users or `200` to owner users; BE/product must confirm.
- If `status` is `expired`, preferred behavior is `410 EXPIRED`; BE/product must confirm if expired detail should remain viewable.
- If the offer does not exist, return `404 NOT_FOUND`.

### Create ride offer

```http
POST /ride-offers
```

Purpose: powers `/post` after the user confirms the preview.

Request:

```json
{
  "origin": "หลักสี่",
  "destination": "สยาม",
  "departureTime": "07:30",
  "day": "today",
  "seats": 2,
  "vehicleName": "Toyota Corolla",
  "via": "วิภาวดี, อนุสาวรีย์",
  "driverName": "คุณ",
  "phone": "086-123-4567",
  "lineId": "me.share",
  "facebookUrl": "https://www.facebook.com/share/1GiMNm5bwv/",
  "note": "ออกทุกเช้า ทักมาได้เลย"
}
```

Response `201`:

```json
{
  "data": {
    "id": "o-new-123",
    "status": "open",
    "expiresAt": "2026-10-13T00:45:00.000Z"
  }
}
```

Rules:

- Server sets `createdAt`.
- Server sets `expiresAt = createdAt + 48 hours`.
- Server sets initial `status = open`.
- Server sets `seatsTotal = seats` and `seatsLeft = seats`.
- Server should parse `via` into `string[]`, trimming empty values.
- If the user is authenticated, server should attach the offer to that user.
- Guest posting behavior is an open question; see Open Questions.

### List current user's ride offers

```http
GET /me/ride-offers
```

Purpose: powers `/my-posts` and the route summary in `/profile`.

Response `200`:

```json
{
  "data": [
    {
      "id": "o-me-1",
      "origin": "หลักสี่",
      "destination": "สยาม",
      "departureDate": "2026-10-11",
      "departureTime": "07:30",
      "dateLabel": "วันนี้",
      "via": ["วิภาวดี", "อนุสาวรีย์"],
      "seatsTotal": 2,
      "seatsLeft": 2,
      "pickupPoints": ["MRT หลักสี่ ทางออก 3"],
      "vehicle": { "name": "Toyota Yaris" },
      "contact": { "phone": "086-123-4567", "lineId": "me.share" },
      "status": "open",
      "createdAt": "2026-10-11T00:30:00.000Z",
      "expiresAt": "2026-10-13T00:30:00.000Z",
      "postedAgo": "เมื่อวาน"
    }
  ]
}
```

Rules:

- Owner list may include `open`, `full`, `closed`, and `expired` depending on product decision.
- Current UI needs at least `open` and `full`.
- Sort newest first.

### Update ride offer status

```http
PATCH /ride-offers/{id}/status
```

Purpose: powers the `/my-posts` full/reopen button.

Request:

```json
{
  "status": "full"
}
```

Response `200`:

```json
{
  "data": {
    "id": "o-me-1",
    "status": "full",
    "seatsLeft": 0
  }
}
```

Rules:

- Only the owner can update status.
- `full` should set `seatsLeft = 0` or otherwise make the offer unavailable in public list.
- `open` should reopen available seats. BE must decide whether to restore previous `seatsLeft` or require explicit seat count.
- Updating an `expired` offer should return `409 CONFLICT` unless product allows reopening expired offers.

## Current User

### Get current user

```http
GET /me
```

Purpose: powers `/profile` and defaults in `/post`.

Response `200`:

```json
{
  "data": {
    "id": "u-me",
    "name": "คุณ",
    "initials": "ค",
    "verifiedPhone": true,
    "verifiedId": false,
    "memberSince": "ก.ย. 2026",
    "sharedCount": 1,
    "vehicle": { "name": "Toyota Yaris" },
    "phone": "086-123-4567",
    "lineId": "me.share",
    "facebookUrl": "https://www.facebook.com/share/1GiMNm5bwv/"
  }
}
```

### Update current user

```http
PATCH /me
```

Purpose: future backend support for `/profile` save button.

Request:

```json
{
  "vehicle": "Toyota Yaris",
  "phone": "086-123-4567",
  "facebookUrl": "https://www.facebook.com/share/1GiMNm5bwv/"
}
```

Response `200`:

```json
{
  "data": {
    "id": "u-me",
    "phone": "086-123-4567",
    "facebookUrl": "https://www.facebook.com/share/1GiMNm5bwv/"
  }
}
```



## OTP Auth

### Request OTP

```http
POST /auth/otp/request
```

Purpose: powers the first step of `/register`.

Request:

```json
{
  "phone": "086-123-4567"
}
```

Response `200`:

```json
{
  "phone": "0861234567",
  "cooldownSeconds": 60,
  "expiresInSeconds": 300
}
```

Demo/non-production response may include:

```json
{
  "phone": "0861234567",
  "cooldownSeconds": 60,
  "expiresInSeconds": 300,
  "demoCode": "123456"
}
```

Rules:

- Normalize Thai and Arabic digits to Western digits.
- Reject phone numbers with fewer than 9 digits.
- Rate-limit by phone and IP.
- Do not return `demoCode` in production.

### Verify OTP

```http
POST /auth/otp/verify
```

Purpose: powers the OTP verification step of `/register`.

Request:

```json
{
  "phone": "0861234567",
  "otp": "123456"
}
```

Response `200`:

```json
{
  "ok": true,
  "user": {
    "id": "u-me",
    "name": "คุณ",
    "initials": "ค",
    "verifiedPhone": true,
    "verifiedId": false,
    "memberSince": "ก.ย. 2026",
    "sharedCount": 1,
    "phone": "0861234567"
  }
}
```

Errors:

- `422 VALIDATION_ERROR` if OTP format is not 6 digits.
- `400 BAD_REQUEST` or `401 UNAUTHORIZED` if OTP is incorrect.
- `429 RATE_LIMITED` after repeated attempts.

## Product Rules

### Ride Offer Visibility

- Public list shows only `status = open` and non-expired offers.
- Public list hides full offers.
- Detail may show full offers, but contact actions must be hidden.
- Expired offer behavior is not finalized. Preferred default is `410 EXPIRED` for public users.

### 48-Hour Expiry

- Every created ride offer expires automatically after 48 hours.
- BE owns this rule using `expiresAt`.
- Public list must exclude expired offers.
- Owner views may show expired offers if product wants history.
- Frontend currently displays expiry notice during `/post`; no countdown is required for MVP.

### Contact Exposure

- Contact channels are phone, LINE, and optional Facebook.
- No in-app chat.
- No booking flow.
- No payment flow.
- Contact actions should be hidden for full, closed, or expired offers.

### Guest Posting

The UI allows Guest users to create posts without registration. Current behavior (JWT auth):

- `POST /ride-offers` requires a verified-phone JWT (option 2 above).
- Guests who open `/post` without a session see a login prompt
  linking to `/register` instead of the form.

## Frontend Service Mapping

| Frontend service | HTTP endpoint |
| --- | --- |
| `listRideOffers(filters)` | `GET /ride-offers` |
| `getRideOffer(id)` | `GET /ride-offers/{id}` |
| `listMyRideOffers()` | `GET /me/ride-offers` |
| `createRideOffer(input)` | `POST /ride-offers` |
| `updateRideOfferStatus(id, status)` | `PATCH /ride-offers/{id}/status` |
| `getCurrentUser()` | `GET /me` |
| `updateCurrentUser(input)` | `PATCH /me` |
| `requestOtp(phone)` | `POST /auth/otp/request` |
| `verifyOtp({ phone, otp })` | `POST /auth/otp/verify` |

## Open Questions

1. Guest posting: should unauthenticated users be allowed to create offers, or must they verify phone first?
2. Expired detail: should public users get `410 EXPIRED`, `404 NOT_FOUND`, or a read-only expired detail page?
3. Reopen full offer: when switching `full` back to `open`, should BE restore `seatsLeft = seatsTotal`, restore the previous value, or require explicit seat count?
4. Vehicle profile: is a single free-text name enough, or do we need type/color/plate back later?
5. Contact privacy: should phone, LINE, and Facebook be fully visible to everyone who can open the detail page?
6. Verification: what provider or workflow should back phone OTP and ID verification?
7. Search: should `q` match only destination and via, or also origin/pickup points?
8. Sorting: should public offers sort by departure time, posted time, route relevance, or availability?

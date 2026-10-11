/* Search shortcut bridge — lets the ride search feed tell the mobile
   top bar whether the search input is on screen, without shared state.
   Only pages that render the feed dispatch the event. */

export const RIDE_SEARCH_INPUT_ID = "ride-search";

export const SEARCH_VISIBILITY_EVENT = "pdk:search-visible";

export interface SearchVisibilityDetail {
  visible: boolean;
}

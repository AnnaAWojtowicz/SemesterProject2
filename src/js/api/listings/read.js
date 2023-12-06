import { apiPath } from "../constants";

/**
 * Gets listing on landing site with title & ending date (without being signed up).
 * @returns
 */
export async function getListings() {
  const response = await fetch(`${apiPath}/auction/listings`);
  let feedListings = undefined;

  if (response.ok) {
    feedListings = await response.json();

    return feedListings;
  }

  throw new Error(response.statusText);
}

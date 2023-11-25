import { apiPath } from "../constants";

export async function getListings() {
  const response = await fetch(`${apiPath}/auction/listings`);

  if (response.ok) {
    return await response.json();
  }
  throw new Error(response.statusText);
}

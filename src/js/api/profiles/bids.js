import { apiPath } from "../constants";

export async function getMyBids(token, name) {
  const response = await fetch(
    `${apiPath}/auction/profiles/${name}/bids?sort=created&sortOrder=desc&_listings=true`,
    {
      method: "get",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.ok) {
    return await response.json();
  }
  throw new Error(response.statusText);
}

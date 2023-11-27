import { apiPath } from "../constants";

export async function getMyListings(token, name) {
  const response = await fetch(`${apiPath}/auction/profiles/${name}/listings`, {
    method: "get",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return await response.json();
  }
  throw new Error(response.statusText);
}

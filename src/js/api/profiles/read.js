import { apiPath } from "../constants";

export async function getProfiles(token) {
  const response = await fetch(`${apiPath}/auction/profiles`, {
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

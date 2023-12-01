import { apiPath } from "../constants";

export async function updateListing(
  token,
  id,
  title,
  description,
  tags,
  media,
) {
  const response = await fetch(`${apiPath}/auction/listings/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, title, description, tags, media }),
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new Error(JSON.stringify(data));
}

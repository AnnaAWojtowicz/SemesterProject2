import { apiPath } from "../constants";

export async function newListing(
  token,
  title,
  endsAt,
  description,
  tags,
  media,
) {
  const response = await fetch(`${apiPath}/auction/listings`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, endsAt, description, tags, media }),
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new Error(JSON.stringify(data));
}

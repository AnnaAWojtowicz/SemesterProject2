import { apiPath } from "../constants";

export async function updateMyAvatar(token, name, avatarUrl) {
  const response = await fetch(`${apiPath}/auction/profiles/${name}/media`, {
    method: "put",
    body: JSON.stringify({
      avatar: avatarUrl,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return await response.json();
  }
  throw new Error(response.statusText);
}

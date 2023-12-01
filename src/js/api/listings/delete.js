import { apiPath } from "../constants";

export async function deleteListing(token, id) {
  const response = await fetch(`${apiPath}/auction/listings/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return true;
  }

  throw new Error(`Delete of listing id ${id} failed`);
}

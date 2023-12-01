import { apiPath } from "../constants";

export async function getListingById(id) {
  const response = await fetch(`${apiPath}/auction/listings/${id}`, {
    method: "get",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new Error(JSON.stringify(data));
}

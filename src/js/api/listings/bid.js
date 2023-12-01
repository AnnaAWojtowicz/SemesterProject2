import { apiPath } from "../constants";

export async function newBid(token, id, amount) {
  const response = await fetch(
    `${apiPath}/auction/listings/${id}/bids?_seller=true&_bids=true`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    },
  );

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new Error(JSON.stringify(data));
}

import { apiPath } from "../constants";

export async function registerNewUser(name, email, avatar, password) {
  const response = await fetch(`${apiPath}/auction/auth/register`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name, email, avatar, password }),
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new Error(JSON.stringify(data));
}

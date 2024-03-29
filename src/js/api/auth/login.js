import { apiPath } from "../constants";

export async function logInUser(email, password) {
  const response = await fetch(`${apiPath}/auction/auth/login`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("name", data.name);

  if (response.ok) {
    return data;
  }

  throw new Error(JSON.stringify(data));
}

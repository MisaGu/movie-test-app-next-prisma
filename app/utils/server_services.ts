import { cookies } from "next/headers";

export const isAuthenticated = async () => {
  const token = cookies().get("token");

  return await fetch(process.env.BASE_URL + "/api/auth/ping", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token?.value ?? "",
    },
  })
    .then((response) => response.json())
    .then((data) => data.isAuthenticated);
};

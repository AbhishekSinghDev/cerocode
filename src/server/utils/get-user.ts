import { auth } from "../better-auth";

export const getAuthenticatedUser = async (headers: Headers) => {
  const authorizationHeader = headers.get("Authorization");

  if (!authorizationHeader) {
    return null;
  }

  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const session = await auth.api.getSession({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!session || !session.user) {
      return null;
    }

    return session.user;
  } catch (err) {
    console.error("Error verifying user:", err);
    return null;
  }
};

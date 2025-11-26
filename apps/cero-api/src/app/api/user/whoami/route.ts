import { getAuthenticatedUser } from "@/server/utils/get-user";

export async function GET(req: Request) {
  const user = await getAuthenticatedUser(req.headers);

  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({ user: { id: user.id, name: user.name, email: user.email } }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

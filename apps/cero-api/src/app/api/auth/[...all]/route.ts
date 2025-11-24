import { auth } from "@/server/better-auth/config";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(req: NextRequest) {
  return handler.GET(req);
}

export async function POST(req: NextRequest) {
  return handler.POST(req);
}

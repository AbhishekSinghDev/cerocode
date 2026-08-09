import { hc } from "hono/client";
import type { AppType } from "@cerocode/server";

export const apiClient = hc<AppType>(process.env.API_URL!);

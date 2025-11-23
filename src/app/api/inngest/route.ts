import { inngest } from "@/server/inngest/client";
import { processChat } from "@/server/inngest/functions/chat";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processChat],
});

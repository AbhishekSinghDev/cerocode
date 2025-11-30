import { google } from "@ai-sdk/google";
import type { SupportedAIToolId } from "@cerocode/constants";

export function buildTools(selectedTools?: SupportedAIToolId[]) {
  if (!selectedTools || selectedTools.length === 0) {
    return undefined;
  }

  const tools: Record<
    string,
    | ReturnType<typeof google.tools.googleSearch>
    | ReturnType<typeof google.tools.urlContext>
    | ReturnType<typeof google.tools.codeExecution>
  > = {};

  for (const toolId of selectedTools) {
    switch (toolId) {
      case "google_search":
        tools.google_search = google.tools.googleSearch({});
        break;
      case "url_context":
        tools.url_context = google.tools.urlContext({});
        break;
      case "code_execution":
        tools.code_execution = google.tools.codeExecution({});
        break;
    }
  }

  return Object.keys(tools).length > 0 ? tools : undefined;
}

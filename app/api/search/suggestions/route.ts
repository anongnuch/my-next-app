import { searchSuggestions } from "@/app/lib/repository";
import { jsonError } from "@/app/lib/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const q = params.get("q");

  if (!q || !q.trim()) {
    return jsonError(400, "missing_query", "q is required and must not be blank.");
  }

  return Response.json(searchSuggestions(q.trim(), params.get("category")));
}

import { getCollection } from "@/app/lib/repository";
import { jsonError } from "@/app/lib/http";

export const dynamic = "force-dynamic";

// `params` is a promise in this version of Next — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = new URL(request.url).searchParams.get("category");

  const collection = getCollection(slug, category);
  if (!collection) {
    return jsonError(404, "not_found", "No collection with that slug.", { slug });
  }
  return Response.json(collection);
}

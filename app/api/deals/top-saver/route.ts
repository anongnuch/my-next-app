import { getTopSaverDeals } from "@/app/lib/repository";
import { jsonError } from "@/app/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const deals = getTopSaverDeals();
  if (!deals) return jsonError(404, "not_found", "No Top Saver deals are configured.");
  return Response.json(deals);
}

import { listBanners } from "@/app/lib/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(listBanners());
}

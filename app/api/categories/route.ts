import { listCategories } from "@/app/lib/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(listCategories());
}

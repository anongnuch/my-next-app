import { listProducts, SORT_OPTIONS } from "@/app/lib/repository";
import { listCategories } from "@/app/lib/repository";
import { boolParam, intParam, jsonError } from "@/app/lib/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const sort = params.get("sort") ?? "relevance";
  if (!SORT_OPTIONS.includes(sort)) {
    return jsonError(400, "invalid_sort", `sort must be one of ${SORT_OPTIONS.join(", ")}.`, {
      sort,
    });
  }

  const category = params.get("category");
  if (category) {
    const known = listCategories().some((row: any) => row.name === category);
    if (!known) {
      return jsonError(400, "unknown_category", "That category does not exist.", { category });
    }
  }

  const page = intParam(params.get("page"), 1);
  const pageSize = intParam(params.get("pageSize"), 24);
  if (page < 1 || pageSize < 1 || pageSize > 100) {
    return jsonError(400, "invalid_pagination", "page must be >= 1 and pageSize between 1 and 100.");
  }

  return Response.json(
    listProducts({
      category,
      q: params.get("q"),
      onSale: boolParam(params.get("onSale")),
      inStock: boolParam(params.get("inStock")),
      sort,
      page,
      pageSize,
    }),
  );
}

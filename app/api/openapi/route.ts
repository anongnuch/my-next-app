import { openApiDocument } from "@/app/lib/openapi";

// The machine-readable export. Paste this URL into Swagger Editor, Postman or a
// client generator; /docs renders the same document.
export async function GET() {
  return Response.json(openApiDocument, {
    headers: {
      "Content-Disposition": 'inline; filename="farmart-openapi.json"',
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

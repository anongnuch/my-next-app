import Link from "next/link";
import SwaggerViewer from "@/app/docs/swagger-viewer";
import { ArrowRightIcon, LeafIcon } from "@/app/components/icons";
import { openApiDocument } from "@/app/lib/openapi";

const SPEC_URL = "/api/openapi";

export const metadata = {
  title: "Farmart API Docs",
  description:
    "OpenAPI 3.1 specification for the Farmart storefront API, rendered with Swagger UI.",
};

export default function DocsPage() {
  const operations = Object.values(openApiDocument.paths).flatMap((path) =>
    Object.values(path),
  );
  const live = operations.filter((op) => op["x-status"] === "live").length;

  return (
    <div className="flex flex-1 flex-col">
      {/* A thin branded bar; everything below it is Swagger UI's own chrome. */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-3 px-4 py-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand">
            <LeafIcon size={22} />
          </span>
          <h1 className="text-[22px] font-extrabold tracking-tight">Farmart API</h1>
          <span className="rounded-sm bg-surface px-2 py-1 font-mono text-[11px] text-muted">
            OpenAPI {openApiDocument.openapi} · v{openApiDocument.info.version} ·{" "}
            {operations.length} operations · {live} live
          </span>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <a
              href={SPEC_URL}
              className="inline-flex h-10 items-center rounded border border-line px-4 text-[13px] font-semibold transition-colors hover:border-brand hover:bg-brand"
            >
              Download spec
            </a>
            <Link
              href="/products"
              className="inline-flex h-10 items-center gap-1.5 rounded bg-brand px-4 text-[13px] font-bold transition-colors hover:bg-brand-strong"
            >
              View the storefront
              <ArrowRightIcon size={16} />
            </Link>
          </div>

          <p className="w-full text-[11px] text-muted">
            Designed from the shipped UI and backed by SQLite. Operations marked{" "}
            <code className="font-mono">x-status: live</code> are implemented and
            serve the home page and search; those marked{" "}
            <code className="font-mono">planned</code> are a contract only.
          </p>
        </div>
      </header>

      <main className="flex-1">
        <SwaggerViewer specUrl={SPEC_URL} />
      </main>
    </div>
  );
}

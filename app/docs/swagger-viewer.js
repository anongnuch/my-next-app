"use client";

import { useEffect, useRef, useState } from "react";

// Swagger UI ships as a browser bundle rather than an npm dependency here, so
// the assets come from a CDN and the component copes with that fetch failing.
const CDN = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5";

export default function SwaggerViewer({ specUrl }) {
  const booted = useRef(false);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = `${CDN}/swagger-ui.css`;
    document.head.appendChild(stylesheet);

    const script = document.createElement("script");
    script.src = `${CDN}/swagger-ui-bundle.js`;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      if (typeof window.SwaggerUIBundle !== "function") {
        setStatus("error");
        return;
      }
      window.SwaggerUIBundle({
        url: specUrl,
        dom_id: "#swagger-ui",
        docExpansion: "list",
        defaultModelsExpandDepth: 1,
        displayRequestDuration: true,
        tryItOutEnabled: true,
        persistAuthorization: true,
      });
      setStatus("ready");
    };
    script.onerror = () => setStatus("error");
    document.body.appendChild(script);
  }, [specUrl]);

  return (
    <>
      {status === "loading" ? (
        <p className="px-4 py-8 text-[13px] text-muted">Loading Swagger UI…</p>
      ) : null}

      {status === "error" ? (
        <div className="mx-auto max-w-[1240px] px-4 py-8">
          <p className="rounded-md border border-line bg-surface p-5 text-[13px] leading-relaxed text-muted">
            Swagger UI could not be loaded from the CDN. The specification itself
            is unaffected — fetch it from{" "}
            <a className="font-semibold text-foreground underline" href={specUrl}>
              {specUrl}
            </a>{" "}
            and open it in Swagger Editor or any OpenAPI client.
          </p>
        </div>
      ) : null}

      <div id="swagger-ui" />
    </>
  );
}

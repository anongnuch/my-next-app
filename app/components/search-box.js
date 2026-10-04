"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, SearchIcon } from "@/app/components/icons";

// The field still submits to /products, so search works without JavaScript.
// The dropdown is an enhancement on top, fed by /api/search/suggestions.
export default function SearchBox({ categories = [], query = "" }) {
  const router = useRouter();
  const listId = useId();

  const [term, setTerm] = useState(query);
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapper = useRef(null);

  useEffect(() => {
    const trimmed = term.trim();
    // Too short to query. Visibility is derived below, so nothing to reset here.
    if (trimmed.length < 2) return;

    // Debounced, and the previous request is abandoned so out-of-order
    // responses cannot overwrite a newer one.
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: trimmed });
        if (category) params.set("category", category);
        const response = await fetch(`/api/search/suggestions?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(String(response.status));
        const data = await response.json();
        setSuggestions(data);
        setActiveIndex(-1);
        setOpen(true);
      } catch (error) {
        if (error.name !== "AbortError") {
          setSuggestions([]);
          setOpen(false);
        }
      }
    }, 200);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [term, category]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!wrapper.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Derived rather than stored, so a shrinking query hides stale rows without
  // an extra state write.
  const showList = open && term.trim().length >= 2 && suggestions.length > 0;

  const go = (suggestion) => {
    setOpen(false);
    router.push(suggestion.href);
  };

  const onKeyDown = (event) => {
    if (!showList) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      go(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapper}
      className="relative order-3 w-full min-w-0 lg:order-none lg:max-w-[560px] lg:flex-1"
    >
      <form className="flex h-11 items-center rounded border border-line" action="/products">
        <label className="sr-only" htmlFor="search-category">
          Category
        </label>
        <div className="relative hidden shrink-0 border-r border-line sm:block">
          <select
            id="search-category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 appearance-none bg-transparent pl-4 pr-8 text-[11px] font-semibold uppercase tracking-wide text-muted outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((row) => (
              <option key={row.slug} value={row.name}>
                {row.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>

        <label className="sr-only" htmlFor="search-query">
          Search products
        </label>
        <input
          id="search-query"
          name="q"
          type="search"
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="I'm searching for..."
          className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted"
        />

        <button
          type="submit"
          aria-label="Search"
          className="grid h-11 w-11 shrink-0 place-items-center text-muted transition-colors hover:text-foreground"
        >
          <SearchIcon />
        </button>
      </form>

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[46px] z-50 overflow-hidden rounded border border-line bg-background py-1 shadow-[0_10px_28px_rgba(0,0,0,0.07)]"
        >
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.type}-${suggestion.label}`}>
              <button
                type="button"
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => go(suggestion)}
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] transition-colors ${
                  index === activeIndex ? "bg-surface" : ""
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{suggestion.label}</span>
                {suggestion.type === "category" ? (
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted">
                    Category
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

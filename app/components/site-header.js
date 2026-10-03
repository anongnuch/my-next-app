import Link from "next/link";
import SearchBox from "@/app/components/search-box";
import {
  CartIcon,
  ChevronDownIcon,
  ClockIcon,
  HeartIcon,
  LeafIcon,
  MenuIcon,
  UserIcon,
} from "@/app/components/icons";

const navLinks = [
  { label: "Deals Today" },
  { label: "Special Prices" },
  { label: "Fresh" },
  { label: "Frozen" },
  { label: "Dinner" },
  { label: "Shop", href: "/products", hasMenu: true },
  { label: "Blog", hasMenu: true },
  { label: "Pages", hasMenu: true },
  { label: "More", hasMenu: true },
];

function IconAction({ label, badge, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-surface"
    >
      {children}
      {badge ? (
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-foreground">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export default function SiteHeader({ categories = [], query = "" }) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-4 px-4 py-4 lg:flex-nowrap lg:gap-8">
        <a href="#" className="flex shrink-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-foreground">
            <LeafIcon size={22} />
          </span>
          <span className="leading-none">
            <span className="block text-[22px] font-extrabold tracking-tight">
              Farmart
            </span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-muted">
              Grocery
            </span>
          </span>
        </a>

        <SearchBox categories={categories} query={query} />

        <div className="ml-auto flex items-center gap-1 lg:gap-3">
          <a
            href="tel:88003326566"
            className="hidden text-sm font-bold md:block"
          >
            8 800 332 65-66
          </a>
          <IconAction label="Your account">
            <UserIcon />
          </IconAction>
          <IconAction label="Wishlist" badge="2">
            <HeartIcon />
          </IconAction>
          <div className="flex items-center gap-2">
            <IconAction label="Shopping cart" badge="5">
              <CartIcon />
            </IconAction>
            <span className="hidden leading-tight sm:block">
              <span className="block text-[11px] text-muted">Your Cart</span>
              <span className="block text-sm font-bold">$3,690.59</span>
            </span>
          </div>
        </div>
      </div>

      <nav className="border-t border-line">
        <div className="mx-auto flex max-w-[1240px] items-center gap-6 px-4">
          <button
            type="button"
            className="my-2 flex shrink-0 items-center gap-2 rounded bg-brand px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-brand-strong"
          >
            <MenuIcon size={16} />
            Shop by category
          </button>

          <ul className="no-scrollbar flex min-w-0 flex-1 items-center gap-5 overflow-x-auto py-3 text-[13px] font-semibold">
            {navLinks.map((link) => (
              <li key={link.label} className="shrink-0">
                <Link
                  href={link.href ?? "#"}
                  className="flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-strong"
                >
                  {link.label}
                  {link.hasMenu ? <ChevronDownIcon size={13} /> : null}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="hidden shrink-0 items-center gap-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-foreground lg:flex"
          >
            <ClockIcon size={16} />
            Recently Viewed
          </a>
        </div>
      </nav>
    </header>
  );
}

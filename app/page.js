import HomeContent from "@/app/home-content";

export const metadata = {
  title: "Farmart — Organic Food & Grocery Store",
  description:
    "Fresh fruits, vegetables, meats, seafood and daily groceries delivered from the farm to your door.",
};

// The storefront fetches its data from /api/* in the browser, so each section is
// a visible request. The repository is still used directly by /products, where
// results need to be server-rendered for shareable search URLs.
export default function Home() {
  return <HomeContent />;
}

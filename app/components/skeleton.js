// Holds a section's shape while its data is in flight. See DESIGN.md → skeleton.
export default function Skeleton({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-md bg-surface motion-reduce:animate-none ${className}`}
    />
  );
}

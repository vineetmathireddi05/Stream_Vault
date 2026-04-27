export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-white/5 rounded ${className}`} />;
}

export function CardSkeleton() {
  return <Skeleton className="aspect-video w-full" />;
}

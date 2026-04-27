export default function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-wider rounded bg-white/10 text-white/90 ${className}`}
    >
      {children}
    </span>
  );
}

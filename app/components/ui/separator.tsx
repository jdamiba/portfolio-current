export function Separator({ className = "" }: { className?: string }) {
  return <hr className={`border-t border-border ${className}`} />;
}

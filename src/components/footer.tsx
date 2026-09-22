import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer mt-9.5 flex flex-col items-start justify-between gap-3 border-t border-border pt-5.75 pb-6 text-[10px] text-muted-foreground min-[701px]:mt-17 min-[701px]:flex-row min-[701px]:items-center min-[701px]:gap-5 min-[701px]:pb-7.5">
      <span className="privacy-note flex items-center gap-1.5">
        <ShieldCheck size={14} aria-hidden="true" /> Just your browser. Your
        numbers stay yours.
      </span>
      <p>&copy; {new Date().getFullYear()} Hasnain Roopawalla</p>
    </footer>
  );
}

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { GitHubIcon } from "./github-icon";
import { useTheme } from "@/hooks/use-theme";

const version = import.meta.env.VITE_APP_VERSION;

export function Navbar() {
  const [theme, toggleTheme] = useTheme();

  return (
    <nav
      className="navigation flex h-14 items-center justify-between gap-2 min-[371px]:gap-5 min-[701px]:h-16"
      aria-label="Main navigation"
    >
      <a
        href="./"
        className="brand inline-flex items-center text-[19px] font-[650] tracking-[-0.8px] text-foreground no-underline"
        aria-label="Chime home"
      >
        <img
          src={`${import.meta.env.BASE_URL}favicon.svg`}
          className="brand-mark mr-2 size-8 shrink-0"
          width={32}
          height={32}
          alt=""
          aria-hidden="true"
        />
        Chime
      </a>
      <div className="nav-actions flex items-center gap-2">
        <span
          className="shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground tabular-nums"
          title={`Version ${version}`}
        >
          v{version}
        </span>
        <a
          href="https://github.com/hasnainroopawalla/chime"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chime on GitHub (opens in a new tab)"
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-foreground hover:text-pop focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <GitHubIcon className="github-icon size-5" />
        </a>
        <Button
          variant="outline"
          size="icon"
          className="theme-button size-10 cursor-pointer rounded-full bg-card shadow-none hover:bg-card dark:bg-card dark:hover:bg-card"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun aria-hidden="true" />
          ) : (
            <Moon aria-hidden="true" />
          )}
        </Button>
      </div>
    </nav>
  );
}

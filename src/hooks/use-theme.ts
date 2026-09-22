import * as React from "react";

type Theme = "light" | "dark";
const themeKey = "visual-money-theme";

function readPreference(): Theme | null {
  try {
    const stored = localStorage.getItem(themeKey);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch (error) {
    console.warn("Could not read the saved theme preference.", error);
    return null;
  }
}

const initialPreference = readPreference();
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const initialTheme =
  initialPreference ?? (systemTheme.matches ? "dark" : "light");
document.documentElement.classList.toggle("dark", initialTheme === "dark");

export function useTheme() {
  const [preference, setPreference] = React.useState<Theme | null>(
    initialPreference,
  );
  const [theme, setTheme] = React.useState<Theme>(initialTheme);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  React.useEffect(() => {
    if (preference !== null) return;
    const onChange = (event: MediaQueryListEvent) =>
      setTheme(event.matches ? "dark" : "light");
    systemTheme.addEventListener("change", onChange);
    return () => systemTheme.removeEventListener("change", onChange);
  }, [preference]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setPreference(next);
    setTheme(next);
    try {
      localStorage.setItem(themeKey, next);
    } catch (error) {
      console.warn("Could not save the theme preference.", error);
    }
  }

  return [theme, toggleTheme] as const;
}

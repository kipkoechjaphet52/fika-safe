"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/app/Components/ui/button";

export function ThemeToggle() {
  const {theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className="border-2 border-gray-300 rounded-lg">
      <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "system")}>
        {resolvedTheme === "dark" ? (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-0 transition-all dark:-rotate-90 dark:scale-100" />
          ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-100 transition-all dark:rotate-0 dark:scale-100" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
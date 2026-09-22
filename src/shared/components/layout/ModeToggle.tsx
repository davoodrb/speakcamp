import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "#/shared/components/layout/ThemeProvider";
import { Button } from "#/shared/components/ui/button";

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Switch to dark mode"
        title="Switch to dark mode"
        onClick={() => setTheme("dark")}
        className="dark:hidden"
      >
        <SunIcon />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        aria-label="Switch to light mode"
        title="Switch to light mode"
        onClick={() => setTheme("light")}
        className="hidden dark:flex"
      >
        <MoonIcon />
      </Button>
    </>
  );
}

export default ModeToggle;

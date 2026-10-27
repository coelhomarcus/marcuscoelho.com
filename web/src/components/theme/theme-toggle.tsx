import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:bg-transparent hover:text-foreground"
      aria-label={isLight ? "Ativar tema escuro" : "Ativar tema claro"}
      onClick={toggle}
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </Button>
  );
}

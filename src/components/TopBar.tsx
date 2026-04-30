import { Link, useLocation } from "react-router-dom";
import { Layers3 } from "lucide-react";

export const TopBar = () => {
  const { pathname } = useLocation();
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="h-9 w-9 rounded-md bg-gradient-accent flex items-center justify-center shadow-glow">
              <Layers3 className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold text-base tracking-tight">
              ARCH<span className="text-primary">/AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
              Fizibilite Stüdyosu
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md transition-colors ${
              pathname === "/" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Projeler
          </Link>
          <Link
            to="/yeni"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
          >
            + Yeni Analiz
          </Link>
        </nav>
      </div>
    </header>
  );
};

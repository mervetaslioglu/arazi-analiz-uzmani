import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Brand } from "./Brand";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export const AppShell = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden border-b border-border bg-card px-4 h-14 flex items-center justify-between sticky top-0 z-30">
          <Link to="/"><Brand size="sm" showSubtitle={false} /></Link>
          <Link
            to="/yeni"
            className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground"
          >
            + Yeni
          </Link>
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TAM DOSYA: src/components/Sidebar.tsx
// (mevcut içeriğin TAMAMINI sil, bunu yapıştır)
// ═══════════════════════════════════════════════════════════════
import { NavLink } from "react-router-dom";
import { Brand } from "./Brand";
import bilgiliLogo from "@/assets/bilgili-logo.png";
import {
  Home,
  FilePlus2,
  ListChecks,
  FolderKanban,
  ShieldAlert,
  FileBarChart2,
  Settings,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Ana Sayfa", icon: Home, end: true },
  { to: "/yeni", label: "Yeni Fizibilite", icon: FilePlus2 },
  { to: "/surec", label: "6 Aşamalı Süreç", icon: ListChecks },
  { to: "/projeler", label: "Projeler", icon: FolderKanban },
  { to: "/risk", label: "Risk Matrisi", icon: ShieldAlert },
  { to: "/raporlar", label: "Raporlar", icon: FileBarChart2 },
  { to: "/ayarlar", label: "Ayarlar", icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-border bg-[hsl(var(--sidebar-background))] sticky top-0 h-screen">
      <div className="px-6 py-6 border-b border-border">
        <Brand size="md" />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-5 border-t border-border flex justify-center">
        <img src={bilgiliLogo} alt="Bilgili" className="h-7 w-auto opacity-85" />
      </div>
    </aside>
  );
};

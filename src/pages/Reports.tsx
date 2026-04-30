import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { loadProjects } from "@/lib/storage";
import { Project } from "@/lib/types";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const Reports = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => setProjects(loadProjects()), []);

  const completed = projects.filter((p) => p.overallStatus === "complete");

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-8 pb-6 border-b border-border">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 font-mono">
            Raporlar
          </div>
          <h1 className="font-display text-2xl font-semibold">Yönetici Raporları</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Tamamlanan fizibilite çalışmalarına ait karar destek özetleri ve raporlar.
          </p>
        </div>

        {completed.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-card p-16 text-center text-sm text-muted-foreground">
            Henüz tamamlanmış bir rapor yok.
          </div>
        ) : (
          <ul className="space-y-3">
            {completed.map((p) => (
              <li
                key={p.id}
                className="rounded-md border border-border bg-card p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md border border-border bg-secondary flex items-center justify-center">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm">{p.input.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.input.city} / {p.input.district} ·{" "}
                      {new Date(p.updatedAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/proje/${p.id}/rapor`}
                  className="text-sm font-medium hover:underline"
                >
                  Raporu Aç →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
};

export default Reports;

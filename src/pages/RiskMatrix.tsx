import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { loadProjects } from "@/lib/storage";
import { Project } from "@/lib/types";
import { Link } from "react-router-dom";

const RiskMatrix = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => setProjects(loadProjects()), []);

  const evaluate = (p: Project) => {
    const f5 = p.stages.F5?.data?._raw as any;
    if (!f5) return { level: "—", margin: "—", topo: p.input.topography };
    const m = f5.karMarji ?? 0;
    const level = m > 25 ? "Düşük" : m > 15 ? "Orta" : "Yüksek";
    return { level, margin: m.toFixed(1) + "%", topo: p.input.topography };
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-8 pb-6 border-b border-border">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 font-mono">
            Risk
          </div>
          <h1 className="font-display text-2xl font-semibold">Risk Matrisi</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Tüm projelerin teknik ve finansal risk göstergelerinin karşılaştırmalı görünümü.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-card p-16 text-center text-sm text-muted-foreground">
            Henüz değerlendirilecek proje yok.
          </div>
        ) : (
          <div className="rounded-md border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Proje</th>
                  <th className="text-left px-4 py-3 font-medium">Lokasyon</th>
                  <th className="text-left px-4 py-3 font-medium">Topografya</th>
                  <th className="text-left px-4 py-3 font-medium">Kar Marjı</th>
                  <th className="text-left px-4 py-3 font-medium">Risk Düzeyi</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const r = evaluate(p);
                  return (
                    <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
                      <td className="px-4 py-3 font-medium">{p.input.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {p.input.city} / {p.input.district}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{r.topo}</td>
                      <td className="px-4 py-3 font-mono">{r.margin}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs px-2 py-0.5 rounded-full border ${
                            r.level === "Düşük"
                              ? "border-success/40 text-success bg-success/5"
                              : r.level === "Orta"
                              ? "border-warning/40 text-warning bg-warning/5"
                              : r.level === "Yüksek"
                              ? "border-destructive/40 text-destructive bg-destructive/5"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {r.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/proje/${p.id}`} className="text-sm hover:underline">
                          İncele
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default RiskMatrix;

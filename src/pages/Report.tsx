import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Brand } from "@/components/Brand";
import { Project, STAGE_DEFS } from "@/lib/types";
import { getProject } from "@/lib/storage";
import { ArrowLeft, Printer } from "lucide-react";

const Report = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | undefined>();

  useEffect(() => {
    if (id) setProject(getProject(id));
  }, [id]);

  if (!project) {
    return (
      <AppShell>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Proje bulunamadı.</p>
        </div>
      </AppShell>
    );
  }

  const handlePrint = () => window.print();
  const today = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden">
        <AppShell>
          <div className="max-w-4xl mx-auto px-6 lg:px-10 py-8">
            <div className="flex items-center justify-between mb-6">
              <Link to={`/proje/${project.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Projeye Dön
              </Link>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
              >
                <Printer className="h-4 w-4" /> Yazdır / PDF
              </button>
            </div>

            <ReportBody project={project} today={today} />
          </div>
        </AppShell>
      </div>

      <div className="hidden print:block">
        <ReportBody project={project} today={today} />
      </div>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
};

const ReportBody = ({ project, today }: { project: Project; today: string }) => (
  <div className="rounded-md border border-border bg-card p-10 print:border-0 print:p-0 space-y-10">
    <header className="border-b border-border pb-6">
      <div className="flex items-start justify-between gap-4">
        <Brand size="lg" />
        <div className="text-right text-xs text-muted-foreground font-mono">
          <div>Rapor No: {project.id.slice(-8).toUpperCase()}</div>
          <div>Tarih: {today}</div>
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-4">
        Proje Geliştirme ve İnşaat Yönetimi · Yönetici Raporu
      </p>

      <div className="mt-8">
        <h1 className="font-display text-3xl font-semibold">{project.input.name}</h1>
        <p className="text-muted-foreground mt-2">
          {project.input.city} / {project.input.district} ·{" "}
          {new Intl.NumberFormat("tr-TR").format(project.input.area)} m² · {project.input.zoningType}
        </p>
      </div>
    </header>

    {STAGE_DEFS.map((def, i) => {
      const s = project.stages[def.id];
      if (s.status !== "complete" || !s.data) return null;
      return (
        <section key={def.id} className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-border pb-2">
            <h2 className="font-display text-lg font-semibold">
              <span className="font-mono text-muted-foreground mr-3">{String(i + 1).padStart(2, "0")}</span>
              {def.title}
            </h2>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Değerlendirme Çıktısı
            </span>
          </div>

          {s.summary && (
            <p className="text-sm leading-relaxed text-foreground/90 border-l-2 border-foreground pl-4">
              {s.summary}
            </p>
          )}

          {Object.entries(s.data)
            .filter(([k]) => !k.startsWith("_"))
            .map(([key, value]) => (
              <div key={key} className="space-y-2">
                <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  {formatKey(key)}
                </h3>
                {Array.isArray(value) ? (
                  <ul className="space-y-1 pl-4 border-l border-border">
                    {value.map((it, idx) => (
                      <li key={idx} className="text-sm leading-relaxed">{String(it)}</li>
                    ))}
                  </ul>
                ) : typeof value === "object" && value ? (
                  <table className="w-full text-sm border border-border">
                    <tbody>
                      {Object.entries(value)
                        .filter(([k]) => !k.startsWith("_"))
                        .map(([k, v]) => (
                          <tr key={k} className="border-b border-border last:border-0">
                            <td className="px-3 py-2 text-muted-foreground w-1/2">{k}</td>
                            <td className="px-3 py-2 font-mono text-right">{String(v)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : null}
              </div>
            ))}
        </section>
      );
    })}

    <footer className="border-t border-border pt-4 text-xs text-muted-foreground text-center">
      PGİY · Proje Geliştirme ve İnşaat Yönetimi · Bu rapor karar destek amaçlı ön değerlendirmedir.
    </footer>
  </div>
);

function formatKey(k: string): string {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
}

export default Report;

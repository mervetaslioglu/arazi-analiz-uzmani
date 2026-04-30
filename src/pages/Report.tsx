import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { Project, STAGE_DEFS } from "@/lib/types";
import { getProject } from "@/lib/storage";
import { ArrowLeft, Printer, Layers3 } from "lucide-react";

const Report = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | undefined>();

  useEffect(() => {
    if (id) setProject(getProject(id));
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <main className="container py-20 text-center">
          <p className="text-muted-foreground">Proje bulunamadı.</p>
        </main>
      </div>
    );
  }

  const handlePrint = () => window.print();
  const today = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden">
        <TopBar />
      </div>

      <main className="container py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link to={`/proje/${project.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Projeye Dön
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 shadow-glow"
          >
            <Printer className="h-4 w-4" /> Yazdır / PDF Olarak Kaydet
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-10 print:border-0 print:bg-white print:text-black space-y-10 shadow-elegant">
          {/* Header */}
          <header className="border-b border-border print:border-black/20 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-gradient-accent flex items-center justify-center">
                  <Layers3 className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="font-display font-bold text-lg">ARCH/AI</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                    Fizibilite Raporu
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground font-mono">
                <div>Rapor No: {project.id.slice(-8).toUpperCase()}</div>
                <div>Tarih: {today}</div>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">Proje</div>
              <h1 className="font-display text-3xl font-bold">{project.input.name}</h1>
              <p className="text-muted-foreground mt-2">
                {project.input.city} / {project.input.district} ·{" "}
                {new Intl.NumberFormat("tr-TR").format(project.input.area)} m² ·{" "}
                {project.input.zoningType}
              </p>
            </div>
          </header>

          {/* Stages */}
          {STAGE_DEFS.map((def) => {
            const s = project.stages[def.id];
            if (s.status !== "complete" || !s.data) return null;

            return (
              <section key={def.id} className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-border print:border-black/20 pb-2">
                  <h2 className="font-display text-xl font-semibold">
                    <span className="font-mono text-primary mr-3">{def.id}</span>
                    {def.title}
                  </h2>
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    {def.subtitle}
                  </span>
                </div>

                {s.summary && (
                  <p className="text-sm leading-relaxed italic text-foreground/90 print:text-black">{s.summary}</p>
                )}

                {Object.entries(s.data)
                  .filter(([k]) => !k.startsWith("_"))
                  .map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-primary">
                        {formatKey(key)}
                      </h3>
                      {Array.isArray(value) ? (
                        <ul className="space-y-1 pl-4">
                          {value.map((it, i) => (
                            <li key={i} className="text-sm leading-relaxed">{String(it)}</li>
                          ))}
                        </ul>
                      ) : typeof value === "object" && value ? (
                        <table className="w-full text-sm border border-border print:border-black/30">
                          <tbody>
                            {Object.entries(value)
                              .filter(([k]) => !k.startsWith("_"))
                              .map(([k, v]) => (
                                <tr key={k} className="border-b border-border print:border-black/20 last:border-0">
                                  <td className="px-3 py-2 text-muted-foreground print:text-black/70 w-1/2">{k}</td>
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

          <footer className="border-t border-border print:border-black/20 pt-4 text-xs text-muted-foreground font-mono text-center">
            ARCH/AI · Otomatik Fizibilite Sistemi · Bu rapor ön analiz amaçlı oluşturulmuştur.
          </footer>
        </div>
      </main>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

function formatKey(k: string): string {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
}

export default Report;

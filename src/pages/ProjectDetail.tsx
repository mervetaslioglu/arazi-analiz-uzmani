import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { StageProgress } from "@/components/StageProgress";
import { StageOutput } from "@/components/StageOutput";
import { Project, StageId, STAGE_DEFS } from "@/lib/types";
import { getProject, upsertProject } from "@/lib/storage";
import { computeStage } from "@/lib/aiEngine";
import { ArrowLeft, Play, FileDown, RotateCcw, MapPin, Maximize2, Building } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState<Project | undefined>(() => (id ? getProject(id) : undefined));
  const [activeStage, setActiveStage] = useState<StageId>("F1");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (id) setProject(getProject(id));
  }, [id]);

  useEffect(() => {
    if (project && searchParams.get("autostart") === "1" && project.overallStatus === "draft") {
      runFullAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  const completed = useMemo(
    () => (project ? Object.values(project.stages).filter((s) => s.status === "complete").length : 0),
    [project]
  );

  const runFullAnalysis = async () => {
    if (!project || running) return;
    setRunning(true);

    const updated: Project = { ...project, overallStatus: "analyzing", stages: { ...project.stages } };
    upsertProject(updated);
    setProject({ ...updated });

    for (const def of STAGE_DEFS) {
      updated.stages[def.id] = { ...updated.stages[def.id], status: "running", startedAt: Date.now() };
      setActiveStage(def.id);
      setProject({ ...updated, stages: { ...updated.stages } });
      upsertProject(updated);

      await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));

      const result = computeStage(def.id, updated.input);
      updated.stages[def.id] = {
        ...updated.stages[def.id],
        status: "complete",
        completedAt: Date.now(),
        data: result.data,
        summary: result.summary,
      };
      setProject({ ...updated, stages: { ...updated.stages } });
      upsertProject(updated);
    }

    updated.overallStatus = "complete";
    upsertProject(updated);
    setProject({ ...updated });
    setRunning(false);
  };

  const resetAnalysis = () => {
    if (!project) return;
    if (!confirm("Değerlendirme sıfırlansın mı?")) return;
    const stages = Object.fromEntries(
      STAGE_DEFS.map((s) => [s.id, { id: s.id, title: s.title, status: "pending" as const }])
    ) as Project["stages"];
    const updated = { ...project, stages, overallStatus: "draft" as const };
    upsertProject(updated);
    setProject(updated);
    setActiveStage("F1");
  };

  if (!project) {
    return (
      <AppShell>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Proje bulunamadı.</p>
          <Link to="/projeler" className="text-foreground hover:underline mt-2 inline-block">Projelere dön</Link>
        </div>
      </AppShell>
    );
  }

  const stage = project.stages[activeStage];
  const allDone = project.overallStatus === "complete";
  const activeIdx = STAGE_DEFS.findIndex((s) => s.id === activeStage);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <Link to="/projeler" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Projeler
        </Link>

        {/* Header */}
        <div className="rounded-md border border-border bg-card p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-1.5">
                Proje #{project.id.slice(-6)}
              </div>
              <h1 className="font-display text-2xl font-semibold">{project.input.name}</h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {project.input.city} / {project.input.district}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <Maximize2 className="h-3.5 w-3.5" />
                  {new Intl.NumberFormat("tr-TR").format(project.input.area)} m²
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" /> {project.input.zoningType} · E={project.input.emsal} · TAKS={project.input.taks}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {project.overallStatus === "draft" && (
                <button
                  onClick={runFullAnalysis}
                  disabled={running}
                  className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  <Play className="h-4 w-4" /> Fizibiliteyi Başlat
                </button>
              )}
              {allDone && (
                <Link
                  to={`/proje/${project.id}/rapor`}
                  className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
                >
                  <FileDown className="h-4 w-4" /> Yönetici Raporu
                </Link>
              )}
              {(allDone || project.overallStatus === "analyzing") && !running && (
                <button
                  onClick={resetAnalysis}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground font-mono uppercase tracking-wider">Akış İlerlemesi</span>
              <span className="font-mono text-foreground">{completed} / 6</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-foreground transition-all duration-500" style={{ width: `${(completed / 6) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          <aside>
            <h2 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Fizibilite Akışı
            </h2>
            <StageProgress
              stages={project.stages}
              activeStage={activeStage}
              onSelect={(id) => setActiveStage(id as StageId)}
            />
          </aside>

          <section className="rounded-md border border-border bg-card p-6 min-h-[400px]">
            <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-border">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  Aşama {String(activeIdx + 1).padStart(2, "0")}
                </div>
                <h2 className="font-display text-xl font-semibold mt-0.5">
                  {STAGE_DEFS[activeIdx]?.title}
                </h2>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Değerlendirme Çıktısı
              </span>
            </div>
            <StageOutput stage={stage} />
          </section>
        </div>
      </div>
    </AppShell>
  );
};

export default ProjectDetail;

import { Project } from "@/lib/types";
import { Link } from "react-router-dom";
import { MapPin, Maximize2, ArrowRight, Trash2 } from "lucide-react";

interface Props {
  project: Project;
  onDelete?: (id: string) => void;
}

export const ProjectCard = ({ project, onDelete }: Props) => {
  const completedStages = Object.values(project.stages).filter((s) => s.status === "complete").length;
  const total = Object.keys(project.stages).length;
  const pct = (completedStages / total) * 100;
  const risk = completedStages >= 6 ? "Düşük" : completedStages >= 3 ? "Orta" : "—";

  const statusLabel =
    project.overallStatus === "complete"
      ? "Tamamlandı"
      : project.overallStatus === "analyzing"
      ? "Devam Ediyor"
      : "Taslak";

  return (
    <div className="group rounded-md border border-border bg-card p-5 hover:border-foreground/30 transition-colors flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-base text-foreground truncate">
            {project.input.name}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {project.input.city} / {project.input.district}
            </span>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-border text-muted-foreground whitespace-nowrap">
          {statusLabel}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4 pb-4 border-b border-border">
        <div>
          <dt className="text-muted-foreground">Proje Tipi</dt>
          <dd className="font-medium text-foreground mt-0.5">{project.input.zoningType}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Alan</dt>
          <dd className="font-mono text-foreground mt-0.5 inline-flex items-center gap-1">
            <Maximize2 className="h-3 w-3" />
            {new Intl.NumberFormat("tr-TR").format(project.input.area)} m²
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Güncel Aşama</dt>
          <dd className="font-mono text-foreground mt-0.5">{completedStages}/{total}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Risk</dt>
          <dd className="font-medium text-foreground mt-0.5">{risk}</dd>
        </div>
      </dl>

      <div className="space-y-1.5 mb-4">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-foreground/80 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-[11px] text-muted-foreground font-mono">
          {new Date(project.updatedAt).toLocaleDateString("tr-TR")}
        </span>
        <div className="flex items-center gap-1">
          {onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              title="Sil"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <Link
            to={`/proje/${project.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
          >
            Devam Et <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

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

  return (
    <div className="group relative rounded-lg border border-border bg-gradient-surface p-5 hover:border-primary/40 hover:shadow-elegant transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-semibold text-base">{project.input.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {project.input.city} / {project.input.district}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Maximize2 className="h-3 w-3" />
              {new Intl.NumberFormat("tr-TR").format(project.input.area)} m²
            </span>
          </div>
        </div>
        <span
          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded ${
            project.overallStatus === "complete"
              ? "bg-success/15 text-success"
              : project.overallStatus === "analyzing"
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {project.overallStatus === "complete" ? "Tamam" : project.overallStatus === "analyzing" ? "Analiz" : "Taslak"}
        </span>
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">İlerleme</span>
          <span className="font-mono">{completedStages}/{total} aşama</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-mono">
          {project.input.zoningType} · E={project.input.emsal}
        </span>
        <div className="flex items-center gap-1">
          {onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="p-1.5 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
              title="Sil"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <Link
            to={`/proje/${project.id}`}
            className="flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all"
          >
            Aç <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

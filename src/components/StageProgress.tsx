import { StageResult, STAGE_DEFS } from "@/lib/types";
import { Check, Loader2, Circle, AlertCircle } from "lucide-react";

interface Props {
  stages: Record<string, StageResult>;
  activeStage?: string;
  onSelect?: (id: string) => void;
}

export const StageProgress = ({ stages, activeStage, onSelect }: Props) => {
  return (
    <div className="space-y-1">
      {STAGE_DEFS.map((def, idx) => {
        const stage = stages[def.id];
        const status = stage?.status ?? "pending";
        const isActive = activeStage === def.id;

        return (
          <button
            key={def.id}
            onClick={() => onSelect?.(def.id)}
            className={`w-full text-left flex items-start gap-4 p-4 rounded-md transition-all border ${
              isActive
                ? "bg-secondary border-primary/40 shadow-elegant"
                : "bg-card/40 border-border hover:bg-secondary/60 hover:border-border"
            }`}
          >
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <div
                className={`h-9 w-9 rounded-md flex items-center justify-center font-mono text-xs font-bold border ${
                  status === "complete"
                    ? "bg-success/15 border-success/40 text-success"
                    : status === "running"
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : status === "error"
                    ? "bg-destructive/15 border-destructive/40 text-destructive"
                    : "bg-muted border-border text-muted-foreground"
                }`}
              >
                {status === "complete" ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : status === "running" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : status === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  def.id
                )}
              </div>
              {idx < STAGE_DEFS.length - 1 && (
                <div className={`w-px flex-1 min-h-[20px] ${status === "complete" ? "bg-success/40" : "bg-border"}`} />
              )}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-display font-semibold text-sm">{def.title}</h4>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {def.id}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{def.subtitle}</p>
              {stage?.summary && status === "complete" && (
                <p className="text-xs text-foreground/80 mt-2 leading-relaxed">{stage.summary}</p>
              )}
              {status === "running" && (
                <div className="mt-2 flex items-center gap-2 text-xs text-primary">
                  <Circle className="h-2 w-2 fill-primary animate-pulse-soft" />
                  <span className="font-mono">İşleniyor…</span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

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
            className={`w-full text-left flex items-start gap-4 p-4 rounded-md transition-colors border ${
              isActive
                ? "bg-secondary border-foreground/30"
                : "bg-card border-border hover:bg-secondary/60"
            }`}
          >
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <div
                className={`h-8 w-8 rounded-md flex items-center justify-center font-mono text-xs font-semibold border ${
                  status === "complete"
                    ? "bg-foreground text-background border-foreground"
                    : status === "running"
                    ? "bg-secondary border-foreground/40 text-foreground"
                    : status === "error"
                    ? "bg-destructive/10 border-destructive/40 text-destructive"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                {status === "complete" ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : status === "running" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : status === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  String(idx + 1).padStart(2, "0")
                )}
              </div>
              {idx < STAGE_DEFS.length - 1 && (
                <div className={`w-px flex-1 min-h-[20px] ${status === "complete" ? "bg-foreground/40" : "bg-border"}`} />
              )}
            </div>
            <div className="flex-1 pt-0.5 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-display font-semibold text-sm text-foreground">{def.title}</h4>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {def.subtitle}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{def.description}</p>
              {stage?.summary && status === "complete" && (
                <p className="text-xs text-foreground/85 mt-2 leading-relaxed border-t border-border pt-2">
                  {stage.summary}
                </p>
              )}
              {status === "running" && (
                <div className="mt-2 flex items-center gap-2 text-xs text-foreground">
                  <Circle className="h-2 w-2 fill-foreground animate-pulse" />
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

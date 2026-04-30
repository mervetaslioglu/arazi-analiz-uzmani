import { StageResult } from "@/lib/types";
import { FileText } from "lucide-react";

interface Props {
  stage: StageResult;
}

const renderValue = (v: any): string => {
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
};

const Section = ({ title, content }: { title: string; content: any }) => {
  if (Array.isArray(content)) {
    return (
      <div className="space-y-2">
        <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-primary">{title}</h4>
        <ul className="space-y-1.5">
          {content.map((item, i) => (
            <li key={i} className="text-sm text-foreground/90 flex gap-2 leading-relaxed">
              <span className="text-primary/60 font-mono text-xs pt-0.5">▸</span>
              <span>{renderValue(item)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (content && typeof content === "object") {
    return (
      <div className="space-y-2">
        <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-primary">{title}</h4>
        <div className="bg-background/40 border border-border rounded-md divide-y divide-border">
          {Object.entries(content)
            .filter(([k]) => !k.startsWith("_"))
            .map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
                <span className="text-sm text-muted-foreground">{k}</span>
                <span className="text-sm font-mono text-foreground text-right">{renderValue(v)}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

export const StageOutput = ({ stage }: Props) => {
  if (stage.status === "pending") {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/30 p-12 text-center">
        <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">Bu aşama henüz çalıştırılmadı.</p>
      </div>
    );
  }

  if (stage.status === "running") {
    return (
      <div className="rounded-lg border border-primary/30 bg-gradient-blueprint p-12 text-center scanline relative overflow-hidden">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2">Analiz çalışıyor</div>
        <p className="text-sm text-muted-foreground">{stage.title} işleniyor…</p>
      </div>
    );
  }

  const data = stage.data || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {stage.summary && (
        <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-sm text-foreground/90 leading-relaxed">
            <span className="font-mono text-xs uppercase tracking-wider text-primary mr-2">Özet</span>
            {stage.summary}
          </p>
        </div>
      )}
      {Object.entries(data)
        .filter(([k]) => !k.startsWith("_"))
        .map(([key, value]) => (
          <Section key={key} title={formatKey(key)} content={value} />
        ))}
    </div>
  );
};

function formatKey(k: string): string {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

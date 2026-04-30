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
        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
        <ul className="space-y-1.5 border-l border-border pl-4">
          {content.map((item, i) => (
            <li key={i} className="text-sm text-foreground/90 leading-relaxed">
              {renderValue(item)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (content && typeof content === "object") {
    return (
      <div className="space-y-2">
        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
        <div className="border border-border rounded-md divide-y divide-border bg-card">
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
      <div className="rounded-md border border-dashed border-border bg-secondary/30 p-12 text-center">
        <FileText className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">Bu aşama henüz çalıştırılmadı.</p>
      </div>
    );
  }

  if (stage.status === "running") {
    return (
      <div className="rounded-md border border-border bg-secondary/40 p-12 text-center relative overflow-hidden">
        <div
          className="absolute inset-x-0 h-px bg-foreground/30"
          style={{ animation: "scan-anim 2.5s linear infinite" }}
        />
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Değerlendirme yürütülüyor
        </div>
        <p className="text-sm text-foreground">{stage.title} işleniyor…</p>
      </div>
    );
  }

  const data = stage.data || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {stage.summary && (
        <div className="rounded-md border-l-2 border-foreground bg-secondary/40 px-4 py-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Aşama Çıktısı — Özet
          </div>
          <p className="text-sm text-foreground leading-relaxed">{stage.summary}</p>
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

import { AppShell } from "@/components/AppShell";
import { STAGE_DEFS } from "@/lib/types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Process = () => {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-10 pb-6 border-b border-border">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 font-mono">
            Süreç
          </div>
          <h1 className="font-display text-2xl font-semibold">6 Aşamalı Fizibilite Süreci</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Arsa ve gayrimenkul verilerinin sistematik değerlendirilmesi için yapılandırılmış
            fizibilite akışı. Her aşama bir önceki çıktıyı temel alır.
          </p>
        </div>

        <ol className="space-y-3">
          {STAGE_DEFS.map((s, i) => (
            <li
              key={s.id}
              className="rounded-md border border-border bg-card p-6 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-md border border-border bg-secondary flex items-center justify-center font-mono font-semibold text-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1">
                <h2 className="font-display font-semibold text-base">{s.title}</h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.description}</p>
              </div>
              <Link
                to="/yeni"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline self-start md:self-center"
              >
                Aşamayı Aç <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </AppShell>
  );
};

export default Process;

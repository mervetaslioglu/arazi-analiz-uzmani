import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Project, STAGE_DEFS } from "@/lib/types";
import { loadProjects } from "@/lib/storage";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.overallStatus === "complete").length,
    analyzing: projects.filter((p) => p.overallStatus === "analyzing").length,
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        {/* Brand header */}
        <header className="mb-10 pb-8 border-b border-border">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3 font-mono">
            PGİY
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Proje Geliştirme ve İnşaat Yönetimi
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Fizibilite Stüdyosu · 6 Aşamalı Fizibilite Süreci
          </p>
        </header>

        {/* Description */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 rounded-md border border-border bg-card p-7">
            <h2 className="font-display text-lg font-semibold mb-3">Çalışma alanı hakkında</h2>
            <p className="text-sm leading-relaxed text-foreground/85">
              <strong className="font-semibold">PGİY Fizibilite Stüdyosu</strong>; proje geliştirme ve
              inşaat yönetimi süreçlerinde kullanılan, arsa ve gayrimenkul verilerini sistematik
              biçimde analiz etmeye yönelik dijital bir çalışma alanıdır. Platform; veri girişi, imar
              değerlendirmesi, teknik uygunluk analizi, planlama senaryoları, ön fizibilite hesapları
              ve yönetici raporlamasını 6 aşamalı bir akış içinde bir araya getirir.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Bu yapı, karar alma süreçlerinde mimari, teknik ve yönetsel değerlendirmelerin aynı
              çatı altında okunmasını sağlar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/yeni"
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" /> Yeni Fizibilite Başlat
              </Link>
              <Link
                to="/surec"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                Süreci İncele <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-7">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-4">
              Mevcut Durum
            </h3>
            <dl className="space-y-4">
              {[
                { label: "Toplam Proje", value: stats.total },
                { label: "Devam Eden", value: stats.analyzing },
                { label: "Tamamlanan", value: stats.completed },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted-foreground">{s.label}</dt>
                  <dd className="font-mono text-2xl font-semibold text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 6 Stage Process */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold">6 Aşamalı Fizibilite Süreci</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Veriden yönetici raporuna uzanan yapılandırılmış değerlendirme akışı.
              </p>
            </div>
            <Link to="/surec" className="text-sm text-foreground hover:underline inline-flex items-center gap-1">
              Tümünü gör <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAGE_DEFS.map((s, i) => (
              <article key={s.id} className="rounded-md border border-border bg-card p-5 flex flex-col">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-mono text-xs text-muted-foreground tracking-wider">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">
                    Hazır
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base text-foreground leading-snug">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed flex-1">
                  {s.description}
                </p>
                <Link
                  to="/yeni"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline self-start"
                >
                  Aşamayı Aç <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Recent projects */}
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-xl font-semibold">Son Projeler</h2>
            <Link to="/projeler" className="text-sm text-foreground hover:underline">
              Tüm projeler
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">Henüz bir fizibilite kaydı yok.</p>
              <Link
                to="/yeni"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"
              >
                <Plus className="h-4 w-4" /> İlk fizibiliteyi oluştur
              </Link>
            </div>
          ) : (
            <ProjectTable projects={projects.slice(0, 5)} />
          )}
        </section>
      </div>
    </AppShell>
  );
};

export const ProjectTable = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Proje</th>
            <th className="text-left px-4 py-3 font-medium">Lokasyon</th>
            <th className="text-left px-4 py-3 font-medium">Tip</th>
            <th className="text-left px-4 py-3 font-medium">Aşama</th>
            <th className="text-left px-4 py-3 font-medium">Risk</th>
            <th className="text-left px-4 py-3 font-medium">Güncelleme</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const completed = Object.values(p.stages).filter((s) => s.status === "complete").length;
            const risk = completed >= 6 ? "Düşük" : completed >= 3 ? "Orta" : "—";
            return (
              <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-4 py-3 font-medium text-foreground">{p.input.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.input.city} / {p.input.district}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.input.zoningType}</td>
                <td className="px-4 py-3 font-mono text-xs">{completed}/6</td>
                <td className="px-4 py-3 text-muted-foreground">{risk}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs font-mono">
                  {new Date(p.updatedAt).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/proje/${p.id}`}
                    className="inline-flex items-center gap-1 text-sm text-foreground hover:underline"
                  >
                    Devam Et <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Index;

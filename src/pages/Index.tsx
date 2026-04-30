import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { ProjectCard } from "@/components/ProjectCard";
import { Project } from "@/lib/types";
import { deleteProject, loadProjects } from "@/lib/storage";
import { Link } from "react-router-dom";
import { Plus, Building2, Sparkles } from "lucide-react";

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Projeyi silmek istediğinize emin misiniz?")) return;
    deleteProject(id);
    setProjects(loadProjects());
  };

  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.overallStatus === "complete").length,
    analyzing: projects.filter((p) => p.overallStatus === "analyzing").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container py-10">
        {/* Hero */}
        <section className="relative mb-12 rounded-xl border border-border bg-gradient-blueprint bg-blueprint p-10 overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-primary mb-4">
              <Sparkles className="h-3 w-3" />
              AI Destekli Fizibilite
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-3">
              Arsanızın potansiyelini <span className="text-gradient-accent">6 aşamada</span> ortaya çıkarın.
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Temel arsa verilerini girin, sistem F1'den F6'ya kadar tüm fizibilite analizini otomatik yürütsün:
              imar haklarından ROI hesabına, tasarım stratejisinden yönetici özetine.
            </p>
            <Link
              to="/yeni"
              className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-5 py-2.5 font-medium hover:opacity-90 transition-opacity shadow-glow"
            >
              <Plus className="h-4 w-4" />
              Yeni Analiz Başlat
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Toplam Proje", value: stats.total },
            { label: "Tamamlanan", value: stats.completed },
            { label: "Analizde", value: stats.analyzing },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-5">
              <div className="text-3xl font-display font-bold font-mono">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-xl font-semibold">Projeler</h2>
            <span className="text-xs text-muted-foreground font-mono">{projects.length} kayıt</span>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card/30 p-16 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">Henüz bir proje oluşturulmadı.</p>
              <Link
                to="/yeni"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <Plus className="h-4 w-4" /> İlk projenizi oluşturun
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;

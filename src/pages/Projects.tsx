import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProjectCard } from "@/components/ProjectCard";
import { Project } from "@/lib/types";
import { deleteProject, loadProjects } from "@/lib/storage";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => setProjects(loadProjects()), []);

  const handleDelete = (id: string) => {
    if (!confirm("Projeyi silmek istediğinize emin misiniz?")) return;
    deleteProject(id);
    setProjects(loadProjects());
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-end justify-between mb-8 pb-6 border-b border-border">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 font-mono">
              Projeler
            </div>
            <h1 className="font-display text-2xl font-semibold">Tüm Fizibilite Projeleri</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {projects.length} kayıt · proje geliştirme ve inşaat yönetimi süreçleri
            </p>
          </div>
          <Link
            to="/yeni"
            className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Yeni Fizibilite
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-card p-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">Henüz proje oluşturulmadı.</p>
            <Link to="/yeni" className="text-sm font-medium hover:underline">
              + İlk projenizi oluşturun
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Projects;

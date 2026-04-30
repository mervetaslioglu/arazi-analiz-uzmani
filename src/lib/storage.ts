import { LandInput, Project, StageId, STAGE_DEFS } from "./types";

const STORAGE_KEY = "archai_projects_v1";

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProject(id: string): Project | undefined {
  return loadProjects().find((p) => p.id === id);
}

export function upsertProject(project: Project) {
  const all = loadProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  project.updatedAt = Date.now();
  if (idx >= 0) all[idx] = project;
  else all.unshift(project);
  saveProjects(all);
}

export function deleteProject(id: string) {
  saveProjects(loadProjects().filter((p) => p.id !== id));
}

export function createProject(input: LandInput): Project {
  const id = `prj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const stages = Object.fromEntries(
    STAGE_DEFS.map((s) => [s.id, { id: s.id, title: s.title, status: "pending" as const }])
  ) as Project["stages"];
  const project: Project = {
    id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    input,
    stages,
    overallStatus: "draft",
  };
  upsertProject(project);
  return project;
}

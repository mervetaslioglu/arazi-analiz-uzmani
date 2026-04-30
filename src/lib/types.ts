export type StageId = "F1" | "F2" | "F3" | "F4" | "F5" | "F6";

export type StageStatus = "pending" | "running" | "complete" | "error";

export interface LandInput {
  name: string;
  city: string;
  district: string;
  area: number; // m²
  zoningType: string; // e.g. "Konut", "Ticaret+Konut", "Turizm"
  emsal: number; // floor area ratio (KAKS)
  taks: number; // building coverage ratio
  maxHeight: number; // meters
  roadFront: number; // meters
  topography: "duz" | "egimli" | "cok-egimli";
  cornerPlot: boolean;
  notes?: string;
}

export interface StageResult {
  id: StageId;
  title: string;
  status: StageStatus;
  startedAt?: number;
  completedAt?: number;
  data?: Record<string, any>;
  summary?: string;
}

export interface Project {
  id: string;
  createdAt: number;
  updatedAt: number;
  input: LandInput;
  stages: Record<StageId, StageResult>;
  overallStatus: "draft" | "analyzing" | "complete";
}

export const STAGE_DEFS: { id: StageId; title: string; subtitle: string }[] = [
  { id: "F1", title: "Arsa Verisi Yapılandırma", subtitle: "Land Data Structuring" },
  { id: "F2", title: "İmar Analizi", subtitle: "Zoning Analysis" },
  { id: "F3", title: "Teknik Analiz", subtitle: "Technical Analysis" },
  { id: "F4", title: "Tasarım Stratejisi", subtitle: "Design Strategy" },
  { id: "F5", title: "Fizibilite Hesaplamaları", subtitle: "Feasibility Calculations" },
  { id: "F6", title: "Yönetici Özeti", subtitle: "Executive Summary" },
];

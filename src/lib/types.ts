export type StageId = "F1" | "F2" | "F3" | "F4" | "F5" | "F6";

export type StageStatus = "pending" | "running" | "complete" | "error";

export interface LandInput {
  name: string;
  city: string;
  district: string;
  area: number;
  zoningType: string;
  emsal: number;
  taks: number;
  maxHeight: number;
  roadFront: number;
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

export const STAGE_DEFS: { id: StageId; title: string; subtitle: string; description: string }[] = [
  {
    id: "F1",
    title: "Veri Girişi ve Proje Tanımı",
    subtitle: "Aşama 01",
    description: "Arsa, lokasyon ve proje kimliğine ilişkin temel verilerin yapılandırılması.",
  },
  {
    id: "F2",
    title: "İmar ve Mevzuat Değerlendirmesi",
    subtitle: "Aşama 02",
    description: "Emsal, TAKS, yükseklik ve fonksiyon bazında imar haklarının analizi.",
  },
  {
    id: "F3",
    title: "Teknik Uygunluk Analizi",
    subtitle: "Aşama 03",
    description: "Topografya, altyapı ve erişim koşullarına göre teknik değerlendirme.",
  },
  {
    id: "F4",
    title: "Planlama ve Senaryo Geliştirme",
    subtitle: "Aşama 04",
    description: "Tipoloji, yerleşim ve program kararlarının senaryolar üzerinden geliştirilmesi.",
  },
  {
    id: "F5",
    title: "Ön Fizibilite Hesapları",
    subtitle: "Aşama 05",
    description: "Maliyet, gelir, kar marjı ve geri dönüş süresine dair ön hesaplamalar.",
  },
  {
    id: "F6",
    title: "Yönetici Özeti ve Raporlama",
    subtitle: "Aşama 06",
    description: "Karar destek özeti, risk değerlendirmesi ve yönetici raporunun derlenmesi.",
  },
];

export type StageId = "F1" | "F2" | "F3" | "F4" | "F5" | "F6";

export type StageStatus = "pending" | "running" | "complete" | "error";

export type TopographyType = "duz" | "egimli" | "cok-egimli";

export interface UploadedDoc {
  name: string;
  size: number;
  type: string;
}

export interface LandInput {
  // Genel Proje Bilgileri
  name: string;
  city: string;
  district: string;
  projectCode?: string;
  developer?: string;
  projectType: string; // Konut, Otel, Turizm Tesisi, Ticaret, Karma, Sanayi
  area: number;

  // İmar Durumu
  zoningType: string;
  emsal: number;
  taks: number;
  maxHeight: number;
  zoningPlanType?: string; // 1/1000 uygulama, 1/5000 nazım vb.
  zoningDocs?: UploadedDoc[];

  // Plan Notları
  planNotes?: string;
  planNoteDocs?: UploadedDoc[];

  // Parsel / Tapu Bilgileri
  ada?: string;
  parsel?: string;
  pafta?: string;
  tapuType?: string; // Müstakil, Hisseli, Kat Mülkiyeti
  ownership?: string;
  tapuDocs?: UploadedDoc[];

  // Topoğrafya ve Çevresel Veriler
  topography: TopographyType;
  cornerPlot: boolean;
  elevationDiff?: number; // metre
  soilType?: string;
  environmentNotes?: string;

  // Program Bilgileri
  // Konut
  konutAdedi?: number;
  ortKonutM2?: number;
  unit1plus1?: number;
  unit2plus1?: number;
  unit3plus1?: number;
  // Otel / Turizm
  odaAdedi?: number;
  ortOdaM2?: number;
  standartOda?: number;
  suite?: number;
  villaBungalov?: number;
  fbAlani?: number;
  lobiAlani?: number;
  spaAlani?: number;
  bohAlani?: number;

  // Kontrol ve Onay
  preparedBy?: string;
  approvedBy?: string;
  approvalDate?: string;
  confirmed?: boolean;

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

export const PROJECT_TYPES = [
  "Konut",
  "Otel",
  "Turizm Tesisi",
  "Ticaret",
  "Ticaret + Konut",
  "Karma Kullanım",
  "Sanayi",
];

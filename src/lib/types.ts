export type StageId = "F1" | "F2" | "F3" | "F4" | "F5" | "F6";

export type StageStatus = "pending" | "running" | "complete" | "error";

export type TopographyType = "duz" | "egimli" | "cok-egimli";

export interface UploadedDoc {
  name: string;
  size: number;
  type: string;
}

export interface LandInput {
  // === TAB 1 — Genel Proje Bilgileri ===
  name: string;
  projectCode?: string;
  location?: string;
  city: string;
  district: string;
  neighborhood?: string;
  projectType: string;
  feasibilityDate?: string;
  preparingUnit?: string;
  description?: string;

  // === TAB 2 — İmar Durumu ===
  zoningDocUploaded?: boolean;
  zoningDocDate?: string;
  planScale?: string;
  planFunction?: string;
  usageDecision?: string;
  taks: number;
  emsal: number; // KAKS
  hmax?: number;
  maxFloors?: number;
  buildingHeight?: number;
  frontSetback?: number;
  sideSetback?: number;
  rearSetback?: number;
  emsaleDahil?: string;
  emsalHarici?: string;
  parkingRequirement?: string;
  donatiKesinti?: string;
  dopKopRatio?: number;
  specialBuildingConditions?: string;
  zoningDescription?: string;
  zoningType: string; // backward-compat with engine
  maxHeight: number; // backward-compat with engine
  zoningDocs?: UploadedDoc[];

  // === TAB 3 — Plan Notları ===
  planNoteDocUploaded?: boolean;
  planNoteDate?: string;
  planNoteNumber?: string;
  relatedPlanName?: string;
  pnFunction?: string;
  pnBuildingConditions?: string;
  pnSetbacks?: string;
  pnEmsalCalc?: string;
  pnElevation?: string;
  pnParking?: string;
  pnLandscape?: string;
  pnSpecialClauses?: string;
  pnRiskNotes?: string;
  pnDesignCritical?: string;
  planNoteText?: string;
  planNotes?: string; // backward-compat
  planNoteDocs?: UploadedDoc[];

  // === TAB 4 — Parsel / Tapu ===
  ada?: string;
  parsel?: string;
  pafta?: string;
  tapuArea?: number;
  netParcelArea?: number;
  shareStatus?: string;
  ownershipStatus?: string;
  encumbrances?: string;
  existingStructure?: string;
  currentUse?: string;
  demolitionRequired?: string;
  cadastralNote?: string;
  parcelGeometry?: string;
  parcelFronts?: string;
  parcelDepth?: number;
  parcelWidth?: number;
  tapuType?: string;
  ownership?: string;
  tapuDocs?: UploadedDoc[];

  // === TAB 5 — Topoğrafya ve Çevresel Veriler ===
  area: number; // parsel alanı
  topography: TopographyType;
  cornerPlot: boolean;
  slopePercent?: number;
  elevationDiff?: number;
  lowestElevation?: number;
  highestElevation?: number;
  dominantOrientation?: string;
  viewPotential?: string;
  sunExposure?: string;
  windEffect?: string;
  existingVegetation?: string;
  neighborBuildings?: string;
  surroundingDensity?: string;
  accessStatus?: string;
  vehicleAccess?: string;
  pedestrianAccess?: string;
  infrastructureConnection?: string;
  technicalConstraints?: string;
  topographyImpact?: string;
  soilType?: string;
  environmentNotes?: string;

  // === TAB 6 — Program Bilgileri ===
  targetGrossArea?: number;
  targetNetArea?: number;
  targetFloors?: number;
  targetBlocks?: number;
  basementFloors?: number;
  parkingFloors?: number;
  commonAreaApproach?: string;
  socialAmenitiesDecision?: string;
  technicalVolumeApproach?: string;
  // Konut
  konutAdedi?: number;
  ortKonutM2?: number;
  minKonutM2?: number;
  maxKonutM2?: number;
  unit1plus1?: number;
  unit2plus1?: number;
  unit3plus1?: number;
  unit4plus1?: number;
  duplexVilla?: number;
  avgSellableArea?: number;
  totalSellableResidential?: number;
  commonAreaRatio?: number;
  targetUserProfile?: string;
  // Otel / Turizm
  odaAdedi?: number;
  ortOdaM2?: number;
  minOdaM2?: number;
  maxOdaM2?: number;
  standartOda?: number;
  suite?: number;
  villaBungalov?: number;
  totalRoomArea?: number;
  fbAlani?: number;
  lobiAlani?: number;
  spaAlani?: number;
  bohAlani?: number;
  meetingArea?: number;
  serviceAreas?: number;
  grossPerRoom?: number;
  hotelSegment?: string;
  // Ofis
  rentableOfficeArea?: number;
  avgFloorArea?: number;
  officeFloors?: number;
  modularOfficeUnits?: number;
  officeCommonRatio?: number;
  employeeCapacity?: number;
  officeMeetingAreas?: number;
  officeLobbyArea?: number;
  // Ticaret
  rentableRetailArea?: number;
  storeCount?: number;
  avgStoreM2?: number;
  minStoreM2?: number;
  maxStoreM2?: number;
  fbUnitCount?: number;
  storageArea?: number;
  circulationArea?: number;
  loadingArea?: number;
  // Karma
  mixedResidentialArea?: number;
  mixedHotelArea?: number;
  mixedOfficeArea?: number;
  mixedRetailArea?: number;
  mixedSocialArea?: number;
  programDistribution?: string;
  primaryFunction?: string;
  secondaryFunctions?: string;

  // === TAB 7 — Kontrol ve Onay ===
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
  "Ticaret",
  "Ofis",
  "Karma Kullanım",
  "Turizm Tesisi",
  "Sağlık Tesisi",
  "Eğitim Tesisi",
  "Diğer",
];

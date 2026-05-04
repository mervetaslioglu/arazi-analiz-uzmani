import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { LandInput } from "@/lib/types";
import { createProject } from "@/lib/storage";
import { ArrowRight } from "lucide-react";

const ZONING_OPTIONS = ["Konut", "Ticaret", "Ticaret + Konut", "Turizm", "Sanayi", "Karma Kullanım"];

const NewProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LandInput>({
    name: "",
    city: "",
    district: "",
    area: 1000,
    zoningType: "Konut",
    emsal: 1.5,
    taks: 0.3,
    maxHeight: 21,
    roadFront: 20,
    topography: "duz",
    cornerPlot: false,
    notes: "",
    // İmar Durumu ek alanlar
    imarNiteligi: "",
    maxKat: 8,
    imarTarih: "",
    cekmeOn: 5,
    cekmeYan: 3,
    cekmeArka: 3,
    planNotu: "",
    // Konut alanları
    konutAdedi: 0,
    konut1p1: 0,
    konut2p1: 0,
    konut3p1: 0,
    konut4p1: 0,
    ortDaireM2: 0,
    // Otel alanları
    odaAdedi: 0,
    standartOdaM2: 0,
    suiteOdaAdedi: 0,
    suiteOdaM2: 0,
    otelKategori: "",
    otelHedefM2: 0,
  });

  const update = <K extends keyof LandInput>(key: K, value: LandInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.district) return;
    const project = createProject(form);
    navigate(`/proje/${project.id}?autostart=1`);
  };

  const isKonut = form.zoningType === "Konut";
  const isOtel = form.zoningType === "Turizm";

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-8 pb-6 border-b border-border">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 font-mono">
            Yeni Fizibilite
          </div>
          <h1 className="font-display text-2xl font-semibold">Proje Tanımı ve Veri Girişi</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Aşama 01: Girilen veriler 6 aşamalı fizibilite akışını başlatır.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Proje Bilgileri ── */}
          <Section title="Proje Bilgileri">
            <Field label="Proje Adı" required>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                placeholder="Örn: Maslak A-Blok Parseli"
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Şehir" required>
                <input value={form.city} onChange={(e) => update("city", e.target.value)} required placeholder="İstanbul" className={inputCls} />
              </Field>
              <Field label="İlçe" required>
                <input value={form.district} onChange={(e) => update("district", e.target.value)} required placeholder="Sarıyer" className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── Arsa Geometrisi (Yol Cephesi kaldırıldı) ── */}
          <Section title="Arsa Geometrisi">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Parsel Alanı (m²)" required>
                <input type="number" value={form.area} onChange={(e) => update("area", +e.target.value)} required min={1} className={inputCls} />
              </Field>
              <Field label="Topografya">
                <select value={form.topography} onChange={(e) => update("topography", e.target.value as LandInput["topography"])} className={inputCls}>
                  <option value="duz">Düz</option>
                  <option value="egimli">Eğimli</option>
                  <option value="cok-egimli">Çok Eğimli</option>
                </select>
              </Field>
            </div>
            <Field label="Köşe Parsel mi?">
              <div className="flex items-center gap-3 h-10">
                <button
                  type="button"
                  onClick={() => update("cornerPlot", !form.cornerPlot)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.cornerPlot ? "bg-foreground" : "bg-muted border border-border"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-background border border-border transition-transform ${
                      form.cornerPlot ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-muted-foreground">{form.cornerPlot ? "Evet" : "Hayır"}</span>
              </div>
            </Field>
          </Section>

          {/* ── İmar Koşulları ── */}
          <Section title="İmar Koşulları">
            <Field label="Fonksiyon / Proje Tipi">
              <select value={form.zoningType} onChange={(e) => update("zoningType", e.target.value)} className={inputCls}>
                {ZONING_OPTIONS.map((z) => <option key={z}>{z}</option>)}
              </select>
            </Field>
            <Field label="İmar Planı Niteliği">
              <input
                value={form.imarNiteligi}
                onChange={(e) => update("imarNiteligi", e.target.value)}
                placeholder="Örn: Ayrık Nizam Konut Alanı"
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Emsal (E)">
                <input type="number" step="0.05" value={form.emsal} onChange={(e) => update("emsal", +e.target.value)} className={inputCls} />
              </Field>
              <Field label="TAKS">
                <input type="number" step="0.05" value={form.taks} onChange={(e) => update("taks", +e.target.value)} className={inputCls} />
              </Field>
              <Field label="Maks. Kat Adedi">
                <input type="number" value={form.maxKat} onChange={(e) => update("maxKat", +e.target.value)} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Maks. Bina Yüksekliği (m)">
                <input type="number" value={form.maxHeight} onChange={(e) => update("maxHeight", +e.target.value)} className={inputCls} />
              </Field>
              <Field label="İmar Planı Tarihi">
                <input
                  value={form.imarTarih}
                  onChange={(e) => update("imarTarih", e.target.value)}
                  placeholder="Örn: 2018 / Rev. 2023"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Çekme Mesafeleri */}
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1.5">Çekme Mesafeleri (m)</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Ön</span>
                  <input type="number" value={form.cekmeOn} onChange={(e) => update("cekmeOn", +e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Yan</span>
                  <input type="number" value={form.cekmeYan} onChange={(e) => update("cekmeYan", +e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Arka</span>
                  <input type="number" value={form.cekmeArka} onChange={(e) => update("cekmeArka", +e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Plan Notu */}
            <Field label="Plan Notu / Özel Yapılaşma Koşulları">
              <textarea
                value={form.planNotu}
                onChange={(e) => update("planNotu", e.target.value)}
                rows={3}
                placeholder="Varsa plan notu, silüet kararı, parsel birleşimi şartı, DOP oranı vb…"
                className={`${inputCls} h-auto`}
              />
            </Field>
          </Section>

          {/* ── Konut Parametreleri (sadece Konut seçiliyse) ── */}
          {isKonut && (
            <Section title="Konut Proje Parametreleri">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Hedef Konut Adedi">
                  <input type="number" value={form.konutAdedi} onChange={(e) => update("konutAdedi", +e.target.value)} className={inputCls} />
                </Field>
                <Field label="Ortalama Daire Büyüklüğü (m²)">
                  <input type="number" value={form.ortDaireM2} onChange={(e) => update("ortDaireM2", +e.target.value)} className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="1+1 Adedi">
                  <input type="number" value={form.konut1p1} onChange={(e) => update("konut1p1", +e.target.value)} className={inputCls} />
                </Field>
                <Field label="2+1 Adedi">
                  <input type="number" value={form.konut2p1} onChange={(e) => update("konut2p1", +e.target.value)} className={inputCls} />
                </Field>
                <Field label="3+1 Adedi">
                  <input type="number" value={form.konut3p1} onChange={(e) => update("konut3p1", +e.target.value)} className={inputCls} />
                </Field>
                <Field label="4+1 / Penthouse Adedi">
                  <input type="number" value={form.konut4p1} onChange={(e) => update("konut4p1", +e.target.value)} className={inputCls} />
                </Field>
              </div>
            </Section>
          )}

          {/* ── Otel Parametreleri (sadece Turizm seçiliyse) ── */}
          {isOtel && (
            <Section title="Otel Proje Parametreleri">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Hedef Oda Adedi">
                  <input type="number" value={form.odaAdedi} onChange={(e) => update("odaAdedi", +e.target.value)} className={inputCls} />
                </Field>
                <Field label="Standart Oda m²">
                  <input type="number" value={form.standartOdaM2} onChange={(e) => update("standartOdaM2", +e.target.value)} className={inputCls} />
                </Field>
                <Field label="Suite Oda Adedi">
                  <input type="number" value={form.suiteOdaAdedi} onChange={(e) => update("suiteOdaAdedi", +e.target.value)} className={inputCls} />
                </Field>
                <Field label="Suite Oda m²">
                  <input type="number" value={form.suiteOdaM2} onChange={(e) => update("suiteOdaM2", +e.target.value)} className={inputCls} />
                </Field>
              </div>
              <Field label="Otel Kategorisi">
                <input
                  value={form.otelKategori}
                  onChange={(e) => update("otelKategori", e.target.value)}
                  placeholder="Örn: 5★ / Butik / Aparthotel"
                  className={inputCls}
                />
              </Field>
              <Field label="Toplam Hedef İnşaat Alanı (m²)">
                <input type="number" value={form.otelHedefM2} onChange={(e) => update("otelHedefM2", +e.target.value)} className={inputCls} />
              </Field>
            </Section>
          )}

          {/* ── Notlar ── */}
          <Section title="Notlar (Opsiyonel)">
            <Field label="Ek Bilgi / Genel Notlar">
              <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} placeholder="Pazara dair gözlemler, özel durumlar…" className={`${inputCls} h-auto`} />
            </Field>
          </Section>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Link to="/" className="px-5 py-2.5 rounded-md border border-border bg-card hover:bg-secondary text-sm font-medium">
              İptal
            </Link>
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-5 py-2.5 font-medium hover:bg-primary/90 text-sm">
              Fizibilite Akışını Başlat <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
};

const inputCls =
  "w-full h-10 px-3 rounded-md bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/15 focus:border-foreground/40 transition";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-md border border-border bg-card p-6 space-y-4">
    <h3 className="font-display font-semibold text-sm text-foreground">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-muted-foreground font-medium">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {children}
  </div>
);

export default NewProject;

import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { LandInput } from "@/lib/types";
import { createProject } from "@/lib/storage";
import { ArrowRight, Trash2, Upload } from "lucide-react";
import { IL_ILCE, IL_LISTESI } from "@/lib/turkiyeIlIlce";

const NewProject = () => {
  const navigate = useNavigate();
  const imarFileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<LandInput>({
    name: "",
    city: "",
    district: "",
    area: 1000,
    zoningType: "Konut (Ayrık Nizam)",
    emsal: 1.5,
    taks: 0.3,
    maxHeight: 21,
    roadFront: 20,
    topography: "duz",
    cornerPlot: false,
    notes: "",
    imarNiteligi: "",
    maxKat: 8,
    imarTarih: "",
    cekmeOn: 5,
    cekmeYan: 3,
    cekmeArka: 3,
    planNotu: "",
    imarBelgeleri: [],
    konutAdedi: 0,
    konut1p1: 0,
    konut2p1: 0,
    konut3p1: 0,
    konut4p1: 0,
    ortDaireM2: 0,
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

  const isKonut =
    form.zoningType.startsWith("Konut") ||
    form.zoningType === "Villa / Müstakil Konut" ||
    form.zoningType === "Rezidans" ||
    form.zoningType === "Toplu Konut (TOKİ Tipi)";
  const isOtel =
    form.zoningType.startsWith("Otel") ||
    form.zoningType === "Butik Otel" ||
    form.zoningType === "Tatil Köyü / Resort" ||
    form.zoningType === "Apart / Devremülk";
  const ilceler = form.city ? (IL_ILCE[form.city] ?? []) : [];

  const handleCityChange = (city: string) => {
    setForm((f) => ({ ...f, city, district: "" }));
  };

  const handleImarFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const names = Array.from(files).map((f) => f.name);
    update("imarBelgeleri", [...(form.imarBelgeleri ?? []), ...names]);
    e.target.value = "";
  };

  const removeImarBelge = (name: string) => {
    update("imarBelgeleri", (form.imarBelgeleri ?? []).filter((n) => n !== name));
  };

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
              <Field label="Şehir / İl" required>
                <select
                  value={form.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  required
                  className={inputCls}
                >
                  <option value="">— İl seçin —</option>
                  {IL_LISTESI.map((il) => (
                    <option key={il} value={il}>{il}</option>
                  ))}
                </select>
              </Field>
              <Field label="İlçe" required>
                <select
                  value={form.district}
                  onChange={(e) => update("district", e.target.value)}
                  required
                  disabled={!form.city}
                  className={`${inputCls} disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <option value="">— İlçe seçin —</option>
                  {ilceler.map((ilce) => (
                    <option key={ilce} value={ilce}>{ilce}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

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

          <Section title="İmar Koşulları">
            <Field label="Fonksiyon / Proje Tipi">
              <select value={form.zoningType} onChange={(e) => update("zoningType", e.target.value)} className={inputCls}>
                <optgroup label="Konut">
                  <option>Konut (Ayrık Nizam)</option>
                  <option>Konut (Bitişik Nizam)</option>
                  <option>Konut (Blok Nizam)</option>
                  <option>Villa / Müstakil Konut</option>
                  <option>Rezidans</option>
                  <option>Toplu Konut (TOKİ Tipi)</option>
                </optgroup>
                <optgroup label="Ticaret & Ofis">
                  <option>Ticaret</option>
                  <option>Ofis / İş Merkezi</option>
                  <option>Alışveriş Merkezi (AVM)</option>
                  <option>Cadde Mağazacılığı (High Street)</option>
                  <option>Ticaret + Konut (Mixed)</option>
                </optgroup>
                <optgroup label="Turizm & Konaklama">
                  <option>Otel / Turizm Tesisi</option>
                  <option>Butik Otel</option>
                  <option>Tatil Köyü / Resort</option>
                  <option>Apart / Devremülk</option>
                </optgroup>
                <optgroup label="Sanayi & Lojistik">
                  <option>Sanayi</option>
                  <option>Lojistik / Depo</option>
                  <option>Organize Sanayi (OSB)</option>
                  <option>Soğuk Hava Deposu</option>
                </optgroup>
                <optgroup label="Sosyal & Diğer">
                  <option>Sağlık Tesisi (Hastane / Klinik)</option>
                  <option>Eğitim Tesisi (Okul / Kampüs)</option>
                  <option>Karma Kullanım (Mixed-Use)</option>
                  <option>Akaryakıt İstasyonu</option>
                  <option>Tarımsal / Bağ-Bahçe</option>
                  <option>Özel Proje Alanı</option>
                </optgroup>
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

            <Field label="Plan Notu / Özel Yapılaşma Koşulları">
              <textarea
                value={form.planNotu}
                onChange={(e) => update("planNotu", e.target.value)}
                rows={3}
                placeholder="Varsa plan notu, silüet kararı, parsel birleşimi şartı, DOP oranı vb…"
                className={`${inputCls} h-auto`}
              />
            </Field>

            <div className="space-y-3">
              <label className="text-xs text-muted-foreground font-medium">İmar Belgesi Ekle</label>
              <div
                className="rounded-md border border-dashed border-border bg-secondary/30 p-4 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => imarFileRef.current?.click()}
              >
                <input
                  ref={imarFileRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.dwg"
                  className="hidden"
                  onChange={handleImarFiles}
                />
                <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                  <Upload className="h-5 w-5" />
                  <div className="text-sm font-medium text-foreground">Dosya Yükle</div>
                  <div className="text-[11px]">PDF, görüntü veya DWG dosyalarını seçin</div>
                </div>
              </div>

              {(form.imarBelgeleri ?? []).length > 0 && (
                <ul className="divide-y divide-border rounded-md border border-border bg-card">
                  {(form.imarBelgeleri ?? []).map((name, i) => (
                    <li key={`${name}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                      <span className="truncate font-medium">{name}</span>
                      <button
                        type="button"
                        onClick={() => removeImarBelge(name)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-destructive shrink-0"
                        title="Kaldır"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Section>

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

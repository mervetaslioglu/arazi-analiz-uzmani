import { AppShell } from "@/components/AppShell";

const Settings = () => {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-8 pb-6 border-b border-border">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 font-mono">
            Ayarlar
          </div>
          <h1 className="font-display text-2xl font-semibold">Sistem Ayarları</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Çalışma alanı tercihleri ve genel parametreler.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { title: "Kuruluş Bilgileri", desc: "Şirket adı, logo ve raporlama başlıkları." },
            { title: "Para Birimi ve Birimler", desc: "Varsayılan para birimi (₺), m² ve m³ birimleri." },
            { title: "Varsayılan İmar Parametreleri", desc: "Yeni projeler için Emsal/TAKS başlangıç değerleri." },
            { title: "Rapor Şablonu", desc: "Yönetici raporlarında kullanılan standart başlık ve dipnotlar." },
          ].map((s) => (
            <div key={s.title} className="rounded-md border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-sm">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Settings;

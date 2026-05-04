import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UploadedDoc } from "@/lib/types";
import { Upload, FileText, Trash2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploaderProps {
  /** Mantıksal alt klasör, örn. "imar" veya "plan-notlari" */
  category: string;
  /** Mevcut belgeler */
  value?: UploadedDoc[];
  /** Belge listesi değiştiğinde çağrılır */
  onChange: (docs: UploadedDoc[]) => void;
  /** Kabul edilen dosya türleri */
  accept?: string;
  /** Üstte gösterilen kısa etiket */
  label?: string;
  /** Yardım metni */
  hint?: string;
}

const BUCKET = "project-documents";

export function DocumentUploader({
  category,
  value = [],
  onChange,
  accept = ".pdf,.png,.jpg,.jpeg,.dwg,.doc,.docx",
  label = "Belge Yükle",
  hint = "PDF, görüntü veya çizim dosyalarını sürükleyip bırakın ya da seçin.",
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUserId(session?.user?.id ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!userId) {
      toast.error("Belge yüklemek için önce giriş yapmalısınız.");
      return;
    }
    setUploading(true);
    const newDocs: UploadedDoc[] = [...value];
    try {
      for (const file of Array.from(files)) {
        if (file.size > 20 * 1024 * 1024) {
          toast.error(`${file.name}: 20MB üzerindeki dosyalar yüklenemez.`);
          continue;
        }
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${userId}/${category}/${Date.now()}_${safeName}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) {
          toast.error(`${file.name}: ${error.message}`);
          continue;
        }
        newDocs.push({ name: file.name, size: file.size, type: file.type, path } as UploadedDoc & { path: string });
      }
      onChange(newDocs);
      toast.success("Belge(ler) yüklendi.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (idx: number) => {
    const doc = value[idx] as UploadedDoc & { path?: string };
    if (doc.path) {
      const { error } = await supabase.storage.from(BUCKET).remove([doc.path]);
      if (error) {
        toast.error(`Silinemedi: ${error.message}`);
        return;
      }
    }
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  const handleDownload = async (doc: UploadedDoc & { path?: string }) => {
    if (!doc.path) return;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(doc.path, 60);
    if (error || !data) {
      toast.error("İndirme bağlantısı oluşturulamadı.");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="space-y-2">
      <div
        className="rounded-md border border-dashed border-border bg-secondary/30 p-4 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          <div className="text-sm font-medium text-foreground">{label}</div>
          <div className="text-[11px]">{hint}</div>
          {!userId && (
            <div className="text-[11px] text-destructive mt-1">
              Belge kaydı için kullanıcı oturumu gereklidir.
            </div>
          )}
        </div>
      </div>

      {value.length > 0 && (
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
          {value.map((doc, i) => (
            <li key={i} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <div className="truncate font-medium">{doc.name}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {(doc.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {(doc as any).path && (
                  <button
                    type="button"
                    onClick={() => handleDownload(doc as any)}
                    className="p-1.5 rounded hover:bg-secondary"
                    title="İndir"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(i)}
                  className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                  title="Sil"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

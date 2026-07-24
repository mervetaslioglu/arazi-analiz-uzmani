// ═══════════════════════════════════════════════════════════════
// TAM DOSYA: src/components/Brand.tsx
// (mevcut içeriğin TAMAMINI sil, bunu yapıştır)
// ═══════════════════════════════════════════════════════════════
import lockup from "@/assets/pgiy-lockup.png";

interface Props {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export const Brand = ({ size = "md", showSubtitle = true }: Props) => {
  return (
    <div className="text-center">
      <img
        src={lockup}
        alt="Proje Geliştirme & İnşaat Yönetimi"
        className="w-full h-auto block"
      />
      {showSubtitle && (
        <div
          className="mt-3 font-extrabold text-[13px] uppercase text-foreground"
          style={{
            fontFamily: "'Archivo', sans-serif",
            letterSpacing: "0.28em",
            textIndent: "0.28em",
          }}
        >
          Fizibilite Stüdyosu
        </div>
      )}
    </div>
  );
};

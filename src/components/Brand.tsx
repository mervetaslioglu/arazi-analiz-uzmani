import logo from "@/assets/pgiy-logo.png";

interface Props {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export const Brand = ({ size = "md", showSubtitle = true }: Props) => {
  const dims = size === "lg" ? "h-12" : size === "sm" ? "h-7" : "h-9";
  const titleCls = size === "lg" ? "text-xl" : size === "sm" ? "text-sm" : "text-base";
  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt="PGİY" className={`${dims} w-auto object-contain`} />
      <div className="flex flex-col leading-tight">
        <span className={`font-display font-semibold tracking-tight text-foreground ${titleCls}`}>
          PGİY
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Fizibilite Stüdyosu
          </span>
        )}
      </div>
    </div>
  );
};

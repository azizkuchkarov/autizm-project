import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function NeonOption({
  selected,
  label,
  onClick,
  hint,
}: {
  selected: boolean;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-2xl px-5 py-4 text-left transition-all",
        "bg-white/5 border border-white/12 backdrop-blur",
        "hover:scale-[1.02] hover:bg-white/10 active:scale-[0.99]",
        selected &&
          "bg-gradient-to-r from-indigo-500/25 to-cyan-400/20 border-indigo-400/60 shadow-[0_0_55px_rgba(99,102,241,0.35)]"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold tracking-wide">{label}</div>
          {hint && <div className="mt-1 text-xs text-white/60">{hint}</div>}
        </div>
        <div
          className={cn(
            "h-6 w-6 rounded-full border border-white/30 flex items-center justify-center",
            selected && "bg-cyan-300 border-cyan-200"
          )}
        >
          {selected && <Check className="h-4 w-4 text-black" />}
        </div>
      </div>

      {selected && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-cyan-200/20" />
      )}
    </button>
  );
}

import { cn } from "@/lib/utils";

export function OptionCard({
  selected,
  title,
  onClick,
}: {
  selected: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border px-4 py-4 text-left transition",
        "bg-white/5 border-white/10 hover:bg-white/7 hover:border-white/20",
        "active:scale-[0.99]",
        selected && "border-indigo-400/60 bg-indigo-500/15 ring-1 ring-indigo-400/25"
      )}
      type="button"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-medium">{title}</div>
        <div
          className={cn(
            "h-5 w-5 rounded-full border border-white/20",
            selected && "border-indigo-400 bg-indigo-400"
          )}
        />
      </div>
    </button>
  );
}

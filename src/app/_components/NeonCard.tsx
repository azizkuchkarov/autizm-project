import { cn } from "@/lib/utils";

export function NeonCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-3xl p-[1px]",
        "bg-gradient-to-br from-indigo-500/50 via-cyan-400/35 to-pink-500/40",
        className
      )}
    >
      <div className="rounded-3xl bg-black/45 backdrop-blur-xl p-5 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.9)]">
        {children}
      </div>
    </div>
  );
}

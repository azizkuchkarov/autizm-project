import { Card } from "@/components/ui/card";

export function Shell({
  title,
  subtitle,
  badge,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[480px] px-4 pb-10 pt-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          {badge && (
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              {badge}
            </div>
          )}
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-white/70 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {right}
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)]">
        <div className="p-4">{children}</div>
      </Card>
    </div>
  );
}

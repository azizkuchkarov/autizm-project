"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Shell } from "@/app/_components/Shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function TransitionPage() {
  const sp = useSearchParams();
  const title = decodeURIComponent(sp.get("title") || "Bo‘lim yakunlandi");
  const next = sp.get("next") || "/result";
  const step = Number(sp.get("step") || "1");
  const total = Number(sp.get("total") || "5");

  const steps = useMemo(
    () => [
      "Javoblar saqlanmoqda",
      "Bolangiz yoshiga mos savollar tayyorlanmoqda",
      "Keyingi bo‘lim yuklanmoqda",
    ],
    []
  );

  const [active, setActive] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / 2000) * 100));
      setPct(p);

      if (elapsed < 700) setActive(0);
      else if (elapsed < 1400) setActive(1);
      else setActive(2);

      if (elapsed >= 2000) {
        clearInterval(t);
        window.location.href = decodeURIComponent(next);
      }
    }, 50);

    return () => clearInterval(t);
  }, [next]);

  return (
    <Shell
      badge="Hisoblash"
      title={title}
      subtitle="Natijalar tayyorlanmoqda…"
      right={
        <Badge variant="secondary" className="border-white/10 bg-white/5 text-white/80">
          {step}/{total}
        </Badge>
      }
    >
      <div className="grid gap-4">
        <Card className="border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium">Progress</div>
            <div className="text-xs text-white/60">{pct}%</div>
          </div>
          <div className="mt-3">
            <Progress value={pct} className="h-2 bg-white/10" />
          </div>

          <div className="mt-4 grid gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={[
                    "h-3.5 w-3.5 rounded-full border",
                    i < active
                      ? "bg-indigo-400 border-indigo-300/70"
                      : i === active
                      ? "bg-indigo-400/30 border-indigo-300/40"
                      : "bg-transparent border-white/15",
                  ].join(" ")}
                />
                <div className={i === active ? "text-sm" : "text-sm text-white/70"}>{s}</div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Shimmer />
          </div>
        </Card>

        <div className="text-xs text-white/55 leading-relaxed">
          Eslatma: Bu skrining jarayoni. Diagnosis emas.
        </div>
      </div>
    </Shell>
  );
}

function Shimmer() {
  return (
    <div className="space-y-2">
      <div className="h-3 w-full rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.16),rgba(255,255,255,0.06))] bg-[length:200%_100%] animate-[sh_1.1s_infinite]" />
      <div className="h-3 w-4/5 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.16),rgba(255,255,255,0.06))] bg-[length:200%_100%] animate-[sh_1.1s_infinite]" />
      <div className="h-3 w-3/5 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.16),rgba(255,255,255,0.06))] bg-[length:200%_100%] animate-[sh_1.1s_infinite]" />
      <style jsx>{`
        @keyframes sh {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

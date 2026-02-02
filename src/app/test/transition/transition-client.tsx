"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NeonCard } from "@/app/_components/NeonCard";

export default function TransitionClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const title = decodeURIComponent(sp.get("title") || "Bo‘lim yakunlandi");
  const next = sp.get("next") || "/result";
  const step = Number(sp.get("step") || "1");
  const total = Number(sp.get("total") || "5");

  const steps = useMemo(
    () => [
      "Javoblar saqlanmoqda",
      "Yoshga mos savollar tayyorlanmoqda",
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
        router.replace(decodeURIComponent(next));
      }
    }, 50);

    return () => clearInterval(t);
  }, [next, router]);

  return (
    <div className="mx-auto max-w-[520px] px-4 py-10 space-y-6 text-white">
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs">
            Hisoblash · {step}/{total}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-white/70">Natijalar tayyorlanmoqda…</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-white/60">Progress</div>
          <div className="text-2xl font-semibold">{pct}%</div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-300 to-pink-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <NeonCard>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={[
                  "h-3.5 w-3.5 rounded-full border",
                  i < active
                    ? "bg-cyan-300 border-cyan-200"
                    : i === active
                    ? "bg-indigo-400/30 border-indigo-300/40"
                    : "bg-transparent border-white/20",
                ].join(" ")}
              />
              <div className={i === active ? "text-sm" : "text-sm text-white/70"}>
                {s}
              </div>
            </div>
          ))}
        </div>
      </NeonCard>

      <div className="text-xs text-white/55">
        Bu skrining. Diagnosis emas.
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NeonCard } from "@/app/_components/NeonCard";
import { NeonOption } from "@/app/_components/NeonOption";
import { loadState, saveState } from "@/lib/storage";

export default function WarmupPage() {
  const router = useRouter();

  const [pregnancyFlags, setPregnancyFlags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = loadState();
    const prev = s.warmup?.pregnancyFlags || [];
    setPregnancyFlags(prev);
  }, []);

  function toggle(v: string) {
    setPregnancyFlags((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  }

  function next() {
    setLoading(true);

    // warmup saqlash
    saveState({
      warmup: {
        ...(loadState().warmup || {}),
        pregnancyFlags,
      },
    });

    // keyingi step
    router.push("/start/phone");
  }

  return (
    <div className="mx-auto max-w-[520px] px-4 py-10 space-y-6">
      {/* HERO */}
      <div className="text-center space-y-3">
        <div className="inline-block rounded-full px-4 py-1 text-xs bg-white/10 backdrop-blur">
          Warm-up · 1–2 min
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Kichik savollar,
          <span className="block text-indigo-300">katta tushuncha</span>
        </h1>
        <p className="text-white/70 text-sm leading-relaxed">
          Bu savollar test natijasini yaxshiroq tushuntirish uchun. Diagnosis emas.
        </p>
      </div>

      {/* QUESTION */}
      <NeonCard>
        <h2 className="text-lg font-semibold mb-4">
          Homiladorlik davrida muhim holat bo‘lganmi?
        </h2>

        <div className="space-y-3">
          {[
            "Infeksiya / isitma",
            "Qon bosimi",
            "Gestatsion diabet",
            "Kuchli stress",
            "Dori qabul qilish",
            "Bilmayman",
          ].map((x) => (
            <NeonOption
              key={x}
              label={x}
              selected={pregnancyFlags.includes(x)}
              onClick={() => toggle(x)}
            />
          ))}
        </div>

        <div className="mt-5 text-xs text-white/60">
          Istasangiz hech narsa tanlamasdan ham davom etsangiz bo‘ladi.
        </div>
      </NeonCard>

      {/* CTA */}
      <button
        onClick={next}
        disabled={loading}
        className="w-full h-14 rounded-2xl text-base font-semibold bg-gradient-to-r from-indigo-500 to-cyan-300 text-black shadow-[0_10px_45px_rgba(99,102,241,0.55)] active:scale-[0.99] transition disabled:opacity-60"
      >
        {loading ? "O‘tyapti..." : "Davom etish"}
      </button>
    </div>
  );
}

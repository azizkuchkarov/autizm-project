"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { NeonCard } from "@/app/_components/NeonCard";
import { NeonOption } from "@/app/_components/NeonOption";
import { loadState, saveState } from "@/lib/storage";
import { BLOCKS, getQuestionsFor } from "@/data/questions";

/* ---------- TYPES ---------- */
type BlockId = (typeof BLOCKS)[number]["id"];

/* ---------- TYPE GUARD ---------- */
function isBlockId(id: string): id is BlockId {
  return BLOCKS.some((b) => b.id === id);
}

/* ---------- PAGE ---------- */
export default function BlockPage() {
  const params = useParams<{ blockId: string }>();
  const router = useRouter();

  /* raw param */
  const rawId = params.blockId;

  /* SAFE block id (TS strict friendly) */
  const safeBlockId: BlockId = isBlockId(rawId)
    ? rawId
    : BLOCKS[0].id;

  const [ageMonths, setAgeMonths] = useState<number>(24);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  /* load state */
  useEffect(() => {
    const s = loadState();

    if (!s.child?.ageMonths) {
      router.replace("/test/profile");
      return;
    }

    setAgeMonths(s.child.ageMonths);
    setAnswers(s.answers || {});
  }, [router]);

  /* meta */
  const blockMeta = useMemo(
    () => BLOCKS.find((b) => b.id === safeBlockId),
    [safeBlockId]
  );

  /* questions (🔥 THIS WAS THE ERROR LINE BEFORE) */
  const questions = useMemo(
    () => getQuestionsFor(safeBlockId, ageMonths),
    [safeBlockId, ageMonths]
  );

  /* progress */
  const stepIndex = BLOCKS.findIndex((b) => b.id === safeBlockId);
  const total = BLOCKS.length;
  const pct = Math.round(((stepIndex + 1) / total) * 100);

  /* answer handler */
  function setAnswer(qid: string, oid: string) {
    const next = { ...answers, [qid]: oid };
    setAnswers(next);
    saveState({ answers: next });
  }

  /* next step */
  function nextStep() {
    for (const q of questions) {
      if (!answers[q.id]) {
        alert("Iltimos, barcha savollarga javob bering.");
        return;
      }
    }

    const isLast = stepIndex === total - 1;
    const nextUrl = isLast
      ? "/result"
      : `/test/block/${BLOCKS[stepIndex + 1].id}`;

    const title = encodeURIComponent(
      `${blockMeta?.title ?? "Bo‘lim"} yakunlandi`
    );

    router.push(
      `/test/transition?title=${title}&next=${encodeURIComponent(
        nextUrl
      )}&step=${stepIndex + 1}&total=${total}`
    );
  }

  /* fallback */
  if (!blockMeta) {
    return (
      <div className="mx-auto max-w-[520px] px-4 py-10">
        <NeonCard>
          <h1 className="text-xl font-semibold">Noto‘g‘ri bo‘lim</h1>
          <p className="mt-2 text-white/70 text-sm">
            Blok topilmadi.
          </p>
          <button
            className="mt-5 w-full h-14 rounded-2xl font-semibold bg-gradient-to-r from-indigo-500 to-cyan-300 text-black"
            onClick={() => router.replace("/test/profile")}
          >
            Profilga qaytish
          </button>
        </NeonCard>
      </div>
    );
  }

  /* ---------- RENDER ---------- */
  return (
    <div className="mx-auto max-w-[520px] px-4 py-10 space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs">
            {stepIndex + 1}/{total} blok
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {blockMeta.title}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            {blockMeta.subtitle}
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-white/60">Progress</div>
          <div className="text-2xl font-semibold">{pct}%</div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-300 to-pink-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* QUESTIONS */}
      <div className="space-y-4">
        {questions.map((q) => (
          <NeonCard key={q.id}>
            <div className="text-base font-semibold">
              {q.text}
            </div>

            <div className="mt-4 space-y-3">
              {q.options.map((o) => (
                <NeonOption
                  key={o.id}
                  label={o.label}
                  selected={answers[q.id] === o.id}
                  onClick={() => setAnswer(q.id, o.id)}
                />
              ))}
            </div>
          </NeonCard>
        ))}
      </div>

      {/* STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur border-t border-white/10">
        <div className="mx-auto max-w-[520px] px-4 py-3">
          <button
            onClick={nextStep}
            className="w-full h-14 rounded-2xl font-semibold bg-gradient-to-r from-indigo-500 to-cyan-300 text-black active:scale-[0.99]"
          >
            {stepIndex === total - 1
              ? "Natijaga o‘tish"
              : "Keyingi bo‘lim"}
          </button>
          <div className="mt-2 text-center text-[11px] text-white/60">
            Bu skrining. Diagnosis emas.
          </div>
        </div>
      </div>

      {/* SPACE FOR STICKY */}
      <div className="h-24" />
    </div>
  );
}

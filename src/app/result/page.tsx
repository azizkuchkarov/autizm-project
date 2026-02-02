"use client";

import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/app/_components/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { loadState } from "@/lib/storage";
import { computeScores } from "@/lib/scoring";
import { BLOCKS } from "@/data/questions";
import { GLOSSARY } from "@/data/glossary";

type AIResult = {
  summary: string;
  why: string[];
  nextSteps: string[];
  disclaimer: string;
  usedTerms?: string[];
};

export default function ResultPage() {
  const [ready, setReady] = useState(false);
  const [ai, setAi] = useState<AIResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const state = useMemo(() => loadState(), []);
  const child = state.child;
  const answers = state.answers || {};
  const warmup = state.warmup || {};
  const session = state.session || {};

  const scores = useMemo(() => {
    if (!child) return null;
    return computeScores(child.ageMonths, answers);
  }, [child, answers]);

  useEffect(() => {
    if (!child) {
      window.location.href = "/";
      return;
    }
    setReady(true);
  }, [child]);

  async function generateAI() {
    setAiLoading(true);
    setErr(null);
    try {
      const payload = { child, session, warmup, scores };
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "AI xizmati javob bermadi.");
      }

      const data = (await res.json()) as AIResult;
      setAi(data);
    } catch (e: any) {
      setErr(e?.message || "Xatolik");
    } finally {
      setAiLoading(false);
    }
  }

  function printPDF() {
    window.print(); // Print → Save as PDF (demo)
  }

  if (!ready || !scores || !child) return null;

  const dateStr = new Date().toLocaleDateString("uz-UZ");
  const risk = scores.risk;
  const pct = Math.round(scores.ratio * 100);

  return (
    <Shell
      badge="Natija"
      title="Yakuniy xulosa"
      subtitle="Asosiy natija + sun’iy intellekt izohi. PDF’ni ham shu sahifadan olasiz."
      right={
        <Badge
          variant="secondary"
          className="border-white/10 bg-white/5 text-white/80"
        >
          {dateStr}
        </Badge>
      }
    >
      <div className="grid gap-4">
        {/* HERO */}
        <Card className="border-white/10 bg-white/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-white/60">Bola profili</div>
              <div className="mt-1 flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="border-white/10 bg-white/5 text-white/80"
                >
                  {child.ageMonths} oy
                </Badge>
                <Badge
                  variant="secondary"
                  className="border-white/10 bg-white/5 text-white/80"
                >
                  {child.gender}
                </Badge>
              </div>
            </div>
            <Badge className="rounded-full px-3 py-1 text-xs bg-indigo-500/15 border border-indigo-300/30 text-white/90">
              Risk: {risk}
            </Badge>
          </div>

          <Separator className="my-4 bg-white/10" />

          <div className="flex items-center justify-center">
            <Gauge percent={pct} label={risk} />
          </div>

          <div className="mt-3 text-center text-xs text-white/55">
            Eslatma: Bu skrining. Diagnosis emas.
          </div>
        </Card>

        {/* BLOCKS */}
        <Card className="border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Bloklar bo‘yicha</div>
            <div className="text-xs text-white/60">{pct}% umumiy</div>
          </div>

          <Separator className="my-3 bg-white/10" />

          <div className="grid gap-3">
            {BLOCKS.map((b) => {
              const v = scores.byBlock[b.id];
              const p = Math.round((v.total / v.max) * 100);
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-white/85">{b.title}</div>
                    <div className="text-xs text-white/60">{p}%</div>
                  </div>
                  <div className="mt-2">
                    <Progress value={p} className="h-2 bg-white/10" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI */}
        <Card className="border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Sun’iy intellekt izohi</div>
              <div className="text-xs text-white/60 mt-1">
                Warm-up + blok natijalariga asoslangan muloyim tushuntirish.
              </div>
            </div>
            <Button
              onClick={generateAI}
              disabled={aiLoading}
              className="rounded-2xl"
              variant={ai ? "secondary" : "default"}
            >
              {aiLoading ? "Hisoblanmoqda…" : ai ? "Qayta olish" : "AI izoh olish"}
            </Button>
          </div>

          {err && (
            <div className="mt-3 rounded-2xl border border-rose-300/20 bg-rose-500/10 p-3 text-sm text-rose-100">
              {err}
            </div>
          )}

          {!ai && !aiLoading && !err && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/10 p-3 text-sm text-white/70 leading-relaxed">
              AI diagnosis qo‘ymaydi. Natijani tushunarli tilda izohlaydi va keyingi
              qadamlarni tavsiya qiladi.
            </div>
          )}

          {ai && (
            <>
              <Separator className="my-4 bg-white/10" />
              <div className="text-sm leading-relaxed text-white/90">
                {ai.summary}
              </div>

              <div className="mt-4 grid gap-3">
                <Card className="border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-medium">Nima uchun shunday?</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-white/75 space-y-1">
                    {ai.why.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </Card>

                <Card className="border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-medium">Keyingi qadamlar</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-white/75 space-y-1">
                    {ai.nextSteps.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="mt-3 text-xs text-white/55 leading-relaxed">
                {ai.disclaimer}
              </div>

              <Glossary terms={ai.usedTerms || []} />
            </>
          )}
        </Card>

        {/* PDF button (hidden in print) */}
        <div className="grid gap-3 print:hidden">
          <Button onClick={printPDF} className="w-full h-12 rounded-2xl text-base">
            PDF yuklab olish (Print → Save as PDF)
          </Button>
          <Button
            variant="secondary"
            className="w-full h-12 rounded-2xl text-base"
            onClick={() => (window.location.href = "/")}
          >
            Bosh sahifa
          </Button>
        </div>

        {/* PRINT NOTE (only visible on screen) */}
        <div className="text-xs text-white/55 leading-relaxed print:hidden">
          PDF demo: brauzerda Print → Save as PDF. Keyin “HTML → PDF” server-side ham qo‘shamiz.
        </div>
      </div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          html, body {
            background: white !important;
            color: #111 !important;
          }
          .bg-gradient-to-b, .pointer-events-none {
            display: none !important;
          }
          .border-white\\/10 {
            border-color: #e5e7eb !important;
          }
          .bg-white\\/5, .bg-black\\/10 {
            background: #fff !important;
          }
          .text-white\\/90, .text-white\\/85, .text-white\\/80, .text-white\\/75, .text-white\\/70, .text-white\\/60, .text-white\\/55 {
            color: #111 !important;
          }
          .shadow-\\[0_30px_80px_-45px_rgba\\(0,0,0,0.9\\)\\] {
            box-shadow: none !important;
          }
        }
      `}</style>
    </Shell>
  );
}

/** Premium gauge (SVG) */
function Gauge({ percent, label }: { percent: number; label: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;

  return (
    <div className="relative">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={r}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r={r}
          stroke="rgba(99,102,241,0.95)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 80 80)"
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        <div className="text-xs text-white/60">Umumiy</div>
        <div className="text-3xl font-semibold tracking-tight">{percent}%</div>
        <div className="mt-1 text-xs text-white/70">Risk: {label}</div>
      </div>
    </div>
  );
}

function Glossary({ terms }: { terms: string[] }) {
  const unique = Array.from(new Set(terms)).filter(Boolean);
  if (unique.length === 0) return null;

  return (
    <Card className="mt-4 border-white/10 bg-white/5 p-4">
      <div className="text-sm font-medium">Terminlar izohi</div>
      <Separator className="my-3 bg-white/10" />
      <Accordion type="single" collapsible className="w-full">
        {unique.map((t) => (
          <AccordionItem key={t} value={t} className="border-white/10">
            <AccordionTrigger className="text-sm text-white/85 hover:no-underline">
              {t}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-white/70 leading-relaxed">
              {GLOSSARY[t] || "Izoh qo‘shiladi."}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/app/_components/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loadState, saveState } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLOCKS } from "@/data/questions";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [ageMonths, setAgeMonths] = useState<number>(24);
  const [gender, setGender] = useState<"o'g'il" | "qiz">("o'g'il");

  useEffect(() => {
    const s = loadState();
    if (s.child?.ageMonths) setAgeMonths(s.child.ageMonths);
    if (s.child?.gender) setGender(s.child.gender);
  }, []);

  const ageLabel = useMemo(() => {
    const y = Math.floor(ageMonths / 12);
    const m = ageMonths % 12;
    return `${y} yosh ${m} oy`;
  }, [ageMonths]);

  function go() {
    if (ageMonths < 18 || ageMonths > 84) {
      return alert("Yosh 18 oydan 84 oygacha (7 yosh) bo‘lishi kerak.");
    }
    saveState({ child: { ageMonths, gender } });
    window.location.href = `/test/block/${BLOCKS[0].id}`;
  }

  return (
    <Shell
      badge="Asosiy test"
      title="Bola profili"
      subtitle="Savollar bolangiz yoshiga mos ravishda avtomatik tanlanadi. Test 5 ta blokdan iborat."
      right={<Badge variant="secondary" className="border-white/10 bg-white/5 text-white/80">{ageLabel}</Badge>}
    >
      <div className="grid gap-4">
        <Card className="border-white/10 bg-white/5 p-4">
          <div className="grid gap-3">
            <div>
              <div className="text-xs text-white/60 mb-1">Bolaning yoshi (oylarda)</div>
              <Input
                type="number"
                min={18}
                max={84}
                value={ageMonths}
                onChange={(e) => setAgeMonths(Number(e.target.value))}
                className="rounded-2xl bg-black/20 border-white/10 h-12"
              />
              <div className="mt-1 text-xs text-white/50">18 oy – 84 oy (7 yosh)</div>
            </div>

            <Separator className="bg-white/10" />

            <div>
              <div className="text-xs text-white/60 mb-1">Bolaning jinsi</div>
              <Select value={gender} onValueChange={(v) => setGender(v as any)}>
                <SelectTrigger className="rounded-2xl bg-black/20 border-white/10 h-12">
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="o'g'il">O‘g‘il</SelectItem>
                  <SelectItem value="qiz">Qiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-4">
          <div className="text-sm font-medium">Muhim</div>
          <div className="mt-1 text-sm text-white/70 leading-relaxed">
            Savollar yoshga mos tanlanadi. Har blok yakunida 2 soniyalik “hisoblash” bo‘ladi va keyingi blok ochiladi.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {BLOCKS.map((b) => (
              <span key={b.id} className="text-xs text-white/70 border border-white/10 bg-white/5 px-2.5 py-1 rounded-full">
                {b.title}
              </span>
            ))}
          </div>
        </Card>

        <Button onClick={go} className="w-full h-12 rounded-2xl text-base">
          Testni boshlash
        </Button>

        <div className="text-xs text-white/55 leading-relaxed">
          Eslatma: Bu skrining. Diagnosis emas.
        </div>
      </div>
    </Shell>
  );
}

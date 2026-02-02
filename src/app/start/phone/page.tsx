"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/app/_components/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loadState, saveState } from "@/lib/storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function PhonePage() {
  const [phone, setPhone] = useState("");
  const [parentRole, setParentRole] = useState<"ona" | "ota" | "vasiy" | "boshqa">("ona");
  const [goal, setGoal] = useState<"shubha" | "tekshiruv" | "tavsiya">("tekshiruv");

  useEffect(() => {
    const s = loadState();
    if (s.session?.phone) setPhone(s.session.phone);
    if (s.session?.parentRole) setParentRole(s.session.parentRole);
    if (s.session?.goal) setGoal(s.session.goal);
  }, []);

  function goNext() {
    const p = phone.trim();
    if (!p) return alert("Telefon raqam kiriting.");
    saveState({ session: { phone: p, parentRole, goal } });
    window.location.href = "/test/profile";
  }

  return (
    <Shell
      badge="Kirish"
      title="Telefon raqam bilan davom etish"
      subtitle="Hozircha OTP yo‘q. Bu demo test uchun. Keyin real versiyada OTP qo‘shamiz."
    >
      <div className="grid gap-4">
        <Card className="border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60 mb-1">Telefon raqam</div>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998 90 123 45 67"
            className="rounded-2xl bg-black/20 border-white/10 h-12"
          />

          <Separator className="my-4 bg-white/10" />

          <div className="grid gap-3">
            <div>
              <div className="text-xs text-white/60 mb-1">Kim test topshiryapti?</div>
              <Select value={parentRole} onValueChange={(v) => setParentRole(v as any)}>
                <SelectTrigger className="rounded-2xl bg-black/20 border-white/10 h-12">
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ona">Ona</SelectItem>
                  <SelectItem value="ota">Ota</SelectItem>
                  <SelectItem value="vasiy">Vasiy</SelectItem>
                  <SelectItem value="boshqa">Boshqa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-white/60 mb-1">Testdan maqsad</div>
              <Select value={goal} onValueChange={(v) => setGoal(v as any)}>
                <SelectTrigger className="rounded-2xl bg-black/20 border-white/10 h-12">
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tekshiruv">Rivojlanishni tekshirmoqchiman</SelectItem>
                  <SelectItem value="shubha">Shubham bor</SelectItem>
                  <SelectItem value="tavsiya">Mutaxassis tavsiya qildi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Button onClick={goNext} className="w-full h-12 rounded-2xl text-base">
          Asosiy testga o‘tish
        </Button>

        <Link href="/start/warmup" className="text-center text-sm text-white/65 hover:text-white">
          Orqaga (Warm-up)
        </Link>
      </div>
    </Shell>
  );
}

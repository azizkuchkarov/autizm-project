import Link from "next/link";
import { Shell } from "@/app/_components/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <Shell
      badge="18 oy – 7 yosh"
      title="Autizm skrining testi"
      subtitle="Savollar bolangiz yoshiga mos tanlanadi. Test 5 ta blokdan iborat. Yakunda asosiy xulosa + AI izoh va PDF olasiz."
    >
      <div className="grid gap-3">
        <Card className="border-white/10 bg-white/5 p-4">
          <div className="text-sm font-medium">Qanday ishlaydi?</div>
          <div className="mt-1 text-sm text-white/70 leading-relaxed">
            Warm-up → telefon → bola profili → 5 blok test → natija + AI izoh → PDF.
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-4">
          <div className="text-sm font-medium">Muhim eslatma</div>
          <div className="mt-1 text-sm text-white/70 leading-relaxed">
            Bu skrining. Diagnosis emas. Kuchli shubha bo‘lsa, mutaxassis bilan maslahatlashish tavsiya etiladi.
          </div>
        </Card>

        <div className="pt-2">
          <Link href="/start/warmup">
            <Button className="w-full h-12 rounded-2xl text-base">
              Testni boshlash
            </Button>
          </Link>
          <div className="mt-3 text-xs text-white/55 leading-relaxed">
            Demo rejim: natijalar brauzeringizda vaqtinchalik saqlanadi (DBsiz).
          </div>
        </div>
      </div>
    </Shell>
  );
}

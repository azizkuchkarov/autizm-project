import { Suspense } from "react";
import TransitionClient from "./transition-client";

export const dynamic = "force-dynamic";

export default function TransitionPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <TransitionClient />
    </Suspense>
  );
}

function Fallback() {
  return (
    <div className="mx-auto max-w-[520px] px-4 py-10 text-white">
      <div className="text-sm text-white/70">Hisoblanmoqda…</div>
      <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-indigo-500 to-cyan-300 animate-pulse" />
      </div>
    </div>
  );
}

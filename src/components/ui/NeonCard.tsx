import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen text-white antialiased overflow-x-hidden">
        
        {/* Animated gradient background */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.45),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.35),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.30),transparent_40%)] animate-pulse" />

        {/* subtle noise */}
        <div className="fixed inset-0 -z-10 bg-[url('/noise.png')] opacity-[0.03]" />

        {children}
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "Autism Screening",
  description: "Screening demo (not a diagnosis)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen text-white antialiased overflow-x-hidden bg-black">
        {/* Neon Radial Background */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.55),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.40),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.30),transparent_40%)]" />
        {/* Soft vignette */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_85%)]" />
        {children}
      </body>
    </html>
  );
}

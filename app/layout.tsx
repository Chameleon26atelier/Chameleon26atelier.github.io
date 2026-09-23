import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chameleon26 Atelier — Objets détournés & créations",
  description: "Je récupère ce qu’on oublie, je détourne ce qu’on connaît. Entre essais, accidents heureux et idées un peu décalées.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}

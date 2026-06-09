import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://znit-veridia-carbon.vercel.app"),
  title: {
    default: "VeridIA — Potencial de carbono e renda da sua propriedade",
    template: "%s · VeridIA",
  },
  description:
    "A VeridIA descobre, em minutos e sem custo, o potencial de carbono e renda da sua propriedade rural. Inteligência que comprova. Uma plataforma ZNIT.",
  applicationName: "VeridIA",
  authors: [{ name: "ZNIT" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "VeridIA — Inteligência que comprova",
    description:
      "Descubra o potencial de carbono e renda da sua propriedade rural em poucos minutos.",
    type: "website",
    locale: "pt_BR",
    siteName: "VeridIA",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "code_type — type code, fast",
  description:
    "A typing speed practice app built for source code. Monkeytype, for code.",
  metadataBase: new URL("https://codetype.app"),
  openGraph: {
    title: "code_type",
    description: "Monkeytype, for code.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#10141a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${jetbrainsMono.variable} ${geist.variable}`}>
      <body className="bg-background text-on-surface font-ui-body text-ui-body min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}

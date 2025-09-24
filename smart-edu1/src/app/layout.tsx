import type { Metadata } from "next";
import { Poppins, Inter, Roboto } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const poppins = Poppins({
  variable: "--font-heading",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-body",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartEdu — AI-Powered Smart Education",
  description:
    "Personalized learning, AI tutors, progress tracking – all in one place.",
  metadataBase: new URL("https://smartedu.local"),
  openGraph: {
    title: "SmartEdu — AI-Powered Smart Education",
    description: "Personalized learning, AI tutors, progress tracking – all in one place.",
    url: "https://smartedu.local",
    siteName: "SmartEdu",
    images: [
      { url: "/vercel.svg", width: 1200, height: 630, alt: "SmartEdu" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartEdu — AI-Powered Smart Education",
    description: "Personalized learning, AI tutors, progress tracking – all in one place.",
    images: ["/vercel.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Apply saved theme before paint to avoid flicker and unintended theme changes on auth pages */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const s = localStorage.getItem('theme'); const sys = window.matchMedia('(prefers-color-scheme: dark)').matches; const d = s ? s === 'dark' : sys; document.documentElement.classList.toggle('dark', d); } catch {} })();`,
          }}
        />
      </head>
      <body className={`${poppins.variable} ${inter.variable} ${roboto.variable} antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

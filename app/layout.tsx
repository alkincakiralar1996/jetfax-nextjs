import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaxJet — Send Fax from iPhone Fast",
  description:
    "Send a fax in 60 seconds. No machine. No store. HIPAA-compliant, encrypted, with delivery confirmation. Right from your iPhone.",
  metadataBase: new URL("https://jetfax-nextjs.vercel.app"),
  openGraph: {
    title: "FaxJet — Send Fax from iPhone Fast",
    description:
      "Send a fax in 60 seconds. HIPAA-compliant. Delivery confirmation on every transmission.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FaxJet — Send Fax from iPhone Fast",
    description:
      "Send a fax in 60 seconds. HIPAA-compliant. Delivery confirmation on every transmission.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF7] text-[#0A0A0A]">
        {children}
      </body>
    </html>
  );
}

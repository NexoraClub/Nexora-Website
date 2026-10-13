import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jersey10 = localFont({
  src: "../public/fonts/Jersey10-Regular.ttf",
  variable: "--font-jersey10",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050610",
};

export const metadata: Metadata = {
  title: "Nexora | ISE Club",
  description: "Official website of the Nexora ISE Club.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jersey10.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">

        <SmoothScroll>
          {children}
        </SmoothScroll>
        
      </body>
    </html>
  );
}

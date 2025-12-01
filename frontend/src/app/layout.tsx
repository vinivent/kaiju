import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Providers } from "@/components/providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaiju",
  description: "Sua plataforma reptiliana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        className={`${geistMono.variable} antialiased bg-background`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Providers>
            <Toaster position="top-right" />
            <LayoutWrapper>{children}</LayoutWrapper>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

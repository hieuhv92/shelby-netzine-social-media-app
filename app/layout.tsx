import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/redux/StoreProvider";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { Toaster } from "@shelby-protocol/ui/components";
import AuthProvider from "@/contexts/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Netzin",
  description: "The modern social platform for the next generation.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <WalletProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </WalletProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { inter, interTight } from "./fonts";
import "./globals.css";
import { Footer } from "@/components/site/Footer";
import { MainNav } from "@/components/site/MainNav";
import { UtilityBar } from "@/components/site/UtilityBar";

export const metadata: Metadata = {
  title: "CCH Automobile",
  description:
    "Electric vehicles sourced direct from China, delivered to Africa. New from the factory. Used from the first owner. Every car inspected on our lot in Guangzhou before it ships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <UtilityBar />
        <MainNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

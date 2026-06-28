import { Footer } from "@/components/site/Footer";
import { MainNav } from "@/components/site/MainNav";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

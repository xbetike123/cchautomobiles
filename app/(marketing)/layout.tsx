import { Footer } from "@/components/site/Footer";
import { MainNav } from "@/components/site/MainNav";
import { PlaceOrderModalProvider } from "@/components/site/PlaceOrderModal";
import { RequestCarModalProvider } from "@/components/site/RequestCarModal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function fetchBrandOptions() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("brands_sourced")
    .select("name")
    .eq("active", true)
    .order("order_index", { ascending: true });
  if (error) {
    console.error("[marketing layout] failed to load brands_sourced", error);
    return [] as string[];
  }
  return data.map((row) => row.name);
}

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const brandOptions = await fetchBrandOptions();

  return (
    <RequestCarModalProvider brandOptions={brandOptions}>
      <PlaceOrderModalProvider brandOptions={brandOptions}>
        <MainNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </PlaceOrderModalProvider>
    </RequestCarModalProvider>
  );
}

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AddCarForm } from "@/components/admin/inventory/AddCarForm";
import { getInventoryByCarCode } from "@/lib/admin/queries/inventory";

type PageProps = {
  params: Promise<{ carCode: string }>;
};

export default async function AdminEditCarPage({ params }: PageProps) {
  const { carCode } = await params;
  const decoded = decodeURIComponent(carCode);
  const car = await getInventoryByCarCode(decoded);
  if (!car) notFound();

  const title = `${car.brand} ${car.model}`;

  return (
    <>
      <AdminHeader
        eyebrow={`Inventory · ${car.carCode}`}
        title={`Edit ${title}`}
        description={`${car.year} · ${car.condition === "new" ? "New from factory" : "Used (first-owner)"}`}
        actions={
          <Link
            href={`/admin/inventory/${car.carCode}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to car
          </Link>
        }
      />
      <div className="flex-1 px-6 py-6">
        <AddCarForm initialCar={car} />
      </div>
    </>
  );
}

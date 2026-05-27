import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AddCarForm } from "@/components/admin/inventory/AddCarForm";

export default function AdminAddCarPage() {
  return (
    <>
      <AdminHeader
        eyebrow="Stock"
        title="Add Car"
        description="Register a new vehicle on the CCH lot."
        actions={
          <Link
            href="/admin/inventory"
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to inventory
          </Link>
        }
      />
      <div className="flex-1 px-6 py-6">
        <AddCarForm />
      </div>
    </>
  );
}

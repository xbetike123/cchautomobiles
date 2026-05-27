"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  carCode: string;
  label: string; // human-readable car name, used in the confirm copy
};

export function InventoryRowActions({ carCode, label }: Props) {
  const router = useRouter();

  const handleDelete = () => {
    if (
      !window.confirm(
        `Delete ${label} (${carCode})? This can't be undone.`,
      )
    ) {
      return;
    }
    // Wire to a server action when the admin write layer is built.
    console.log("delete inventory", carCode);
    router.push("/admin/inventory");
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/inventory/${carCode}/edit`}
        className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        className="inline-flex items-center gap-1.5 rounded-full border border-cch-red/40 bg-white px-3.5 py-2 text-[12.5px] font-medium text-cch-red transition-colors hover:bg-cch-red hover:text-white"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        Delete
      </button>
    </div>
  );
}

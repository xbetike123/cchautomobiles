import { LogOut, Search } from "lucide-react";

import { logout } from "@/app/admin-login/actions";
import { AdminHeaderActions } from "@/components/admin/AdminHeaderActions";
import type { AdminProfile } from "@/lib/admin/types";

type Props = {
  profile: AdminProfile;
  todayLabel: string;
};

export function AdminTopBar({ profile, todayLabel }: Props) {
  return (
    <header
      role="banner"
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-hairline bg-white/85 px-6 backdrop-blur-md shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
    >
      <div className="flex items-center gap-3">
        <span className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-text-tertiary">
          Operations Center
        </span>
        <span aria-hidden="true" className="h-3 w-px bg-hairline" />
        <span className="text-[12.5px] text-text-secondary">{todayLabel}</span>
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end gap-3">
        <label className="relative hidden w-full max-w-xs items-center md:flex">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 size-3.5 text-text-tertiary"
          />
          <input
            type="search"
            placeholder="Search leads, cars, codes…"
            aria-label="Search"
            className="h-9 w-full rounded-full border border-hairline bg-surface-tint/70 pl-9 pr-3 text-[13px] text-corporate-black placeholder:text-text-tertiary focus:border-corporate-black/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-corporate-black/10"
          />
        </label>
        <AdminHeaderActions profile={profile} />
        <form action={logout}>
          <button
            type="submit"
            aria-label="Sign out"
            title="Sign out"
            className="flex size-9 items-center justify-center rounded-full border border-hairline text-text-secondary transition hover:border-cch-red/30 hover:bg-cch-red-soft hover:text-cch-red"
          >
            <LogOut aria-hidden="true" className="size-4" />
          </button>
        </form>
      </div>
    </header>
  );
}

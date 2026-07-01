import { LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";

import { login } from "@/app/admin-login/actions";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin/session";
import { cookies } from "next/headers";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  if (
    isValidAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
  ) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-tint px-6">
      <section className="w-full max-w-md rounded-card-lg border border-hairline bg-white p-8 shadow-lift">
        <div className="mb-7 flex size-12 items-center justify-center rounded-full bg-cch-red-soft text-cch-red">
          <LockKeyhole aria-hidden="true" className="size-5" />
        </div>
        <p className="text-meta text-cch-red">Restricted access</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-corporate-black">
          Operations Center
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Enter the administrator password to continue.
        </p>

        <form action={login} className="mt-7 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-corporate-black"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="h-12 w-full rounded-input border border-hairline bg-white px-4 text-sm outline-none transition focus:border-cch-red focus:ring-2 focus:ring-cch-red/15"
            />
          </div>
          {error === "invalid" ? (
            <p role="alert" className="text-sm text-cch-red">
              Incorrect password, or admin authentication is not configured.
            </p>
          ) : null}
          <button
            type="submit"
            className="h-12 w-full rounded-button bg-cch-red px-5 text-sm font-semibold text-white transition hover:bg-cch-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cch-red focus-visible:ring-offset-2"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}

"use client";

import { Check, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";

import {
  createParentCompany,
  deleteParentCompany,
  renameParentCompany,
  setDefaultParentCompany,
} from "@/app/admin/settings/actions";
import type { ParentCompany } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type Props = {
  companies: ParentCompany[];
};

function inputClass(extra?: string) {
  return cn(
    "h-11 w-full rounded-lg border border-hairline bg-white px-4 text-[14px] text-corporate-black placeholder:text-text-tertiary focus:border-corporate-black/40 focus:outline-none focus:ring-2 focus:ring-corporate-black/10",
    extra,
  );
}

export function ParentCompanies({ companies }: Props) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<{ ok: true } | { ok: false; error: string }>,
                onDone?: () => void) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.error);
      else onDone?.();
    });
  };

  const add = () => {
    if (!newName.trim()) return;
    run(() => createParentCompany(newName), () => setNewName(""));
  };

  const saveRename = (id: string) => {
    if (!editingName.trim()) return;
    run(() => renameParentCompany(id, editingName), () => setEditingId(null));
  };

  return (
    <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
      <header className="mb-5">
        <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
          Parent companies
        </h2>
        <p className="mt-1 text-[13px] text-text-secondary">
          Entities CCH issues documents under. Pick one when building a quote or
          invoice and it prints as{" "}
          <span className="font-medium text-corporate-black">C/O</span> on the
          PDF. The default is pre-selected.
        </p>
      </header>

      <ul className="divide-y divide-hairline rounded-lg border border-hairline">
        {companies.length === 0 ? (
          <li className="px-4 py-6 text-center text-[13px] text-text-tertiary">
            No companies yet. Add the entity your documents are issued under.
          </li>
        ) : null}

        {companies.map((company) => {
          const isEditing = editingId === company.id;
          return (
            <li
              key={company.id}
              className="flex flex-wrap items-center gap-3 px-4 py-3"
            >
              {isEditing ? (
                <>
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") saveRename(company.id);
                      if (event.key === "Escape") setEditingId(null);
                    }}
                    className={inputClass("flex-1 min-w-[220px]")}
                  />
                  <button
                    type="button"
                    onClick={() => saveRename(company.id)}
                    disabled={pending}
                    className="inline-flex items-center gap-1.5 rounded-full bg-corporate-black px-3 py-1.5 text-[12px] font-medium text-white hover:bg-corporate-black/90 disabled:opacity-50"
                  >
                    <Check className="size-3.5" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:bg-surface-tint"
                  >
                    <X className="size-3.5" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-corporate-black">
                      C/O {company.legalName}
                    </p>
                    {company.isDefault ? (
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] font-medium text-cch-red">
                        <Star className="size-3 fill-current" />
                        Default
                      </span>
                    ) : null}
                  </div>

                  {!company.isDefault ? (
                    <button
                      type="button"
                      onClick={() => run(() => setDefaultParentCompany(company.id))}
                      disabled={pending}
                      className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:bg-surface-tint disabled:opacity-50"
                    >
                      <Star className="size-3.5" />
                      Make default
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(company.id);
                      setEditingName(company.legalName);
                      setError(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:bg-surface-tint"
                  >
                    <Pencil className="size-3.5" />
                    Rename
                  </button>

                  <button
                    type="button"
                    onClick={() => run(() => deleteParentCompany(company.id))}
                    disabled={pending}
                    aria-label={`Remove ${company.legalName}`}
                    className="grid size-8 place-items-center rounded-full text-text-tertiary hover:bg-cch-red-soft hover:text-cch-red disabled:opacity-50"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder="Company legal name, e.g. Naiyuan Mart Co. Ltd"
          className={inputClass("flex-1 min-w-[240px]")}
        />
        <button
          type="button"
          onClick={add}
          disabled={pending || !newName.trim()}
          className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-4 py-2.5 text-[13px] font-medium text-white shadow-[0_6px_14px_rgba(230,57,70,0.25)] hover:bg-cch-red-hover disabled:opacity-50"
        >
          <Plus className="size-4" />
          Add company
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-[12.5px] text-cch-red">{error}</p>
      ) : null}

      <p className="mt-3 text-[11.5px] text-text-tertiary">
        Renaming a company only affects new documents. Quotes and invoices keep
        the name they were issued under.
      </p>
    </section>
  );
}

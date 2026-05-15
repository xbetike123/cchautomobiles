import { Logomark } from "./Logomark";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-content px-6 py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-1">
            <Logomark />
          </div>
          <div className="space-y-4" aria-label="Inventory">
            <p className="text-meta text-text-tertiary">Inventory</p>
          </div>
          <div className="space-y-4" aria-label="Company">
            <p className="text-meta text-text-tertiary">Company</p>
          </div>
          <div className="space-y-4" aria-label="Support">
            <p className="text-meta text-text-tertiary">Support</p>
          </div>
          <div className="space-y-4" aria-label="Contact">
            <p className="text-meta text-text-tertiary">Contact</p>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-hairline pt-6 text-[12px] text-text-tertiary sm:flex-row sm:items-center">
          <p>© 2026 CCH Automobile. All rights reserved.</p>
          <Logomark size="small" />
        </div>
      </div>
    </footer>
  );
}

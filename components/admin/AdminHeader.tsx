type AdminHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function AdminHeader({
  eyebrow,
  title,
  description,
  actions,
}: AdminHeaderProps) {
  return (
    <div className="border-b border-hairline bg-white">
      <div className="flex items-center justify-between gap-6 px-6 py-5">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-text-tertiary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-1 font-display text-[24px] font-semibold leading-tight tracking-tight text-corporate-black">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}

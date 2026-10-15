import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "gold" | "muted";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    gold: "bg-amber-50 text-amber-700 ring-amber-100",
    muted: "bg-ink-100 text-ink-500 ring-ink-100",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-500 sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 12% 10%, rgba(51,102,245,0.55), transparent 60%), radial-gradient(520px circle at 88% 0%, rgba(240,180,41,0.28), transparent 55%)",
        }}
      />
      <Container className="relative py-14 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow ? (
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-[2.75rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-brand-100/90 sm:text-base">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-100 bg-white/70 px-6 py-14 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h10M4 17h7" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
      {description ? (
        <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white px-5 py-4 shadow-card">
      <div className="font-display text-2xl font-semibold text-brand-700 sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-500">
        {label}
      </div>
    </div>
  );
}

export function Avatar({
  src,
  name,
  className,
  rounded = "rounded-2xl",
}: {
  src?: string | null;
  name?: string | null;
  className?: string;
  rounded?: string;
}) {
  const label = (name ?? "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "Photo"}
        className={cn("h-full w-full object-cover", rounded, className)}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-brand-100 font-display text-2xl font-semibold text-brand-700",
        rounded,
        className,
      )}
    >
      {label}
    </div>
  );
}
